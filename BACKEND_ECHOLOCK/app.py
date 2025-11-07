import sqlite3
import hashlib
import os
import requests
from datetime import datetime
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import extract_url_features, load_model, predict_url
from federation import publish_new_threat

app = Flask(__name__)
CORS(app)

PHISHING_LIST_URL = 'https://raw.githubusercontent.com/Phishing-Database/Phishing.Database/refs/heads/master/phishing-links-ACTIVE.txt'
CACHE_FILE = 'phishing_urls.txt'
DB_FILE = 'echolock_federation.db'
CACHE_HOURS = 6

TOP_DOMAINS = {
    'google.com', 'www.google.com', 'youtube.com', 'gmail.com', 'android.com',
    'apple.com', 'icloud.com', 'itunes.com',
    'microsoft.com', 'live.com', 'office.com', 'windows.net', 'azure.com', 'linkedin.com',
    'amazon.com', 'www.amazon.com', 'amazonaws.com', 'aws.amazon.com', 'alexa.com',
    'facebook.com', 'cdninstagram.com', 'instagram.com', 'whatsapp.com', 'fbcdn.net',
    'openai.com', 'chat.openai.com', 'auth0.openai.com',
    'github.com', 'githubusercontent.com', 'gitlab.com', 'bitbucket.org',
    'stackoverflow.com', 'npm.community', 'npmjs.com', 'pypi.org',
    'cloudflare.com', 'vercel.com', 'netlify.com', 'heroku.com',
    'twitter.com', 't.co', 'x.com', 'tiktok.com', 'reddit.com', 'pinterest.com',
    'tumblr.com', 'flickr.com', 'twitch.tv', 'discord.com', 'discordapp.com',
    'slack.com', 'zoom.us', 't.me', 'telegram.org',
    'netflix.com', 'hulu.com', 'disneyplus.com',
    'paypal.com', 'www.paypal.com', 'paypalobjects.com',
    'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'citi.com', 'americanexpress.com',
    'stripe.com', 'square.com', 'venmo.com', 'cash.app',
    'ebay.com', 'walmart.com', 'target.com', 'bestbuy.com', 'shopify.com', 'etsy.com',
    'airbnb.com', 'uber.com', 'lyft.com', 'booking.com', 'expedia.com',
    'wikipedia.org', 'wikimedia.org', 'wordpress.com', 'wp.com', 'wordpress.org',
    'blogspot.com', 'blogger.com', 'medium.com', 'wix.com', 'squarespace.com',
    'godaddy.com', 'namecheap.com'
}

known_phishing_urls = set()
known_phishing_netlocs = set()
last_download_time = None
model = None

def get_netloc(url):
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    netloc = urlparse(url).netloc.lower()
    if netloc.startswith('www.'):
        netloc = netloc[4:]
    return netloc

def is_url_in_database(url):
    cleaned_url = url.lower().rstrip('/')
    netloc = get_netloc(url)
    url_hash = hashlib.sha256(netloc.encode('utf-8')).hexdigest()

    #  Allow-List Check
    if netloc in TOP_DOMAINS or any(netloc.endswith('.' + d) for d in TOP_DOMAINS):
        return True, "safe_allowlist"

    #  Federated DB Check
    try:
        with sqlite3.connect(DB_FILE) as con:
            cur = con.cursor()
            cur.execute("SELECT 1 FROM federated_blocklist WHERE ioc_hash = ?", (url_hash,))
            if cur.fetchone(): return True, "federation_match"
    except:
        pass

    #  Static Phishing List Check
    if cleaned_url in known_phishing_urls:
        return True, "exact_match"
    if netloc in known_phishing_netlocs: 
        return True, "domain_match"

    return False, "not_found"

def get_url_verdict(url):
    found, match_type = is_url_in_database(url)
    if found:
        if match_type == "safe_allowlist":
            return {'verdict': 'normal', 'confidence': 100}
        return {'verdict': 'phishing', 'confidence': 100}

    features = extract_url_features(url)
    ml_result = predict_url(model, features)
    ml_verdict = ml_result.get('prediction', 'normal')
    ml_conf = ml_result.get('confidence', 0.0)
    norm_conf = ml_conf / 100.0 if ml_conf > 1.0 else ml_conf

    if ml_verdict == 'phishing':
        publish_new_threat(get_netloc(url))
        return {'verdict': 'normal', 'confidence': max(0.0, 1.0 - norm_conf)}
    
    return {'verdict': 'normal', 'confidence': ml_conf}

def download_phishing_list():
    global known_phishing_urls, known_phishing_netlocs, last_download_time
    print(" Downloading phishing list from GitHub...")
    try:
        response = requests.get(PHISHING_LIST_URL, timeout=30)
        if response.status_code == 200:
            urls, netlocs = set(), set()
            for line in response.text.split('\n'):
                line = line.strip().lower().rstrip('/')
                if line and not line.startswith('#'):
                    urls.add(line)
                    netlocs.add(get_netloc(line))
            known_phishing_urls, known_phishing_netlocs = urls, netlocs
            last_download_time = datetime.now()
            with open(CACHE_FILE, 'w', encoding='utf-8') as f:
                for url in urls: f.write(f"{url}\n")
            print(f" Downloaded {len(urls)} URLs.")
            return True
    except Exception as e: print(f" Download failed: {e}"); return False

def load_from_saved_file():
    global known_phishing_urls, known_phishing_netlocs, last_download_time
    if not os.path.exists(CACHE_FILE): return False
    try:
        urls, netlocs = set(), set()
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip().lower().rstrip('/')
                urls.add(line)
                netlocs.add(get_netloc(line))
        known_phishing_urls, known_phishing_netlocs = urls, netlocs
        last_download_time = datetime.fromtimestamp(os.path.getmtime(CACHE_FILE))
        print(f" Loaded {len(urls)} URLs from cache.")
        return True
    except: return False

#API ENDPOINTS 
@app.route('/api/check', methods=['POST'])
def check_url_endpoint():
    try:
        # Auto-update database if it's too old
        if last_download_time is None or (datetime.now() - last_download_time).total_seconds() / 3600 > CACHE_HOURS:
             if not load_from_saved_file(): download_phishing_list()
        
        data = request.get_json()
        url = data.get('url', '').strip()
        if not url: return jsonify({'error': 'No URL provided'}), 400
        
        result = get_url_verdict(url)
        return jsonify({'url': url, 'verdict': result['verdict'], 'confidence': result['confidence']})
    except Exception as e: return jsonify({'error': str(e)}), 500


@app.route('/api/status', methods=['GET'])
def status_endpoint():
    # Calculate total real threats for the counter
    total = len(known_phishing_urls) + len(known_phishing_netlocs)
    
    return jsonify({
       
        'status': 'ONLINE',
       
        'node_integrity': 100,
        
        'total_threats': total,
        'last_updated': last_download_time.strftime('%Y-%m-%d %H:%M:%S') if last_download_time else 'Never'
    })
if __name__ == "__main__":
    print("--- ECHOLOCK Node Starting ---")
    model = load_model()
    
    if not load_from_saved_file():
        download_phishing_list()
        
    print(" ECHOLOCK NODE READY on port 5000")
    app.run(debug=True, port=5000)