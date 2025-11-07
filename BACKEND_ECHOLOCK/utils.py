import pandas as pd
import pickle
import json


def extract_url_features(url):
   
    df = pd.DataFrame({'url': [url]})
    
    features = pd.DataFrame()
    features['url_length'] = df['url'].str.len()
    features['num_dots'] = df['url'].str.count(r'\.')
    features['num_hyphens'] = df['url'].str.count('-')
    features['num_underscores'] = df['url'].str.count('_')
    features['num_slashes'] = df['url'].str.count('/')
    features['num_question'] = df['url'].str.count(r'\?')
    features['num_equals'] = df['url'].str.count('=')
    features['num_at'] = df['url'].str.count('@')
    features['num_ampersand'] = df['url'].str.count('&')
    features['num_digits'] = df['url'].str.count(r'\d')
    
    features['has_https'] = df['url'].str.contains(r'https', case=False).astype(int)
    features['has_http'] = df['url'].str.contains(r'http', case=False).astype(int)
    
    features['has_login'] = df['url'].str.contains(r'login', case=False).astype(int)
    features['has_verify'] = df['url'].str.contains(r'verify|confirm|account', case=False).astype(int)
    features['has_update'] = df['url'].str.contains(r'update|secure', case=False).astype(int)
    features['has_free'] = df['url'].str.contains(r'free|win|prize', case=False).astype(int)
    
    features['has_ip'] = df['url'].str.contains(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}').astype(int)
    features['has_shortener'] = df['url'].str.contains(r'bit\.ly|tinyurl|goo\.gl', case=False).astype(int)
    
    return features.iloc[0].to_dict()


def load_model():
   
    try:
        with open('rf_model.pkl', 'rb') as file:
            model = pickle.load(file)
        print("Model loaded successfully")
        return model
    except Exception as e:
        print(f" Error loading model: {str(e)}")
        return None


def load_feature_columns():
   
    try:
        with open('feature_columns.json', 'r') as f:
            return json.load(f)
    except:
        return [
            'url_length', 'num_dots', 'num_hyphens', 'num_underscores',
            'num_slashes', 'num_question', 'num_equals', 'num_at',
            'num_ampersand', 'num_digits', 'has_https', 'has_http',
            'has_login', 'has_verify', 'has_update', 'has_free',
            'has_ip', 'has_shortener'
        ]


def predict_url(model, features):
   
    try:
        
        feature_columns = load_feature_columns()
        
        # Convert to DataFrame
        feature_values = [features.get(col, 0) for col in feature_columns]
        X = pd.DataFrame([feature_values], columns=feature_columns)
        
        # Predict
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]

        
        result = {
            'prediction': 'phishing' if prediction == 0 else 'normal',
            'confidence': round(probabilities[prediction] * 100, 2),
            'probabilities': {
                'phishing': round(probabilities[0] * 100, 2),
                'normal': round(probabilities[1] * 100, 2)
            }
        }
        
        return result
        
    except Exception as e:
        print(f" Prediction error: {str(e)}")
        return {
            'prediction': 'error',
            'confidence': 0,
            'probabilities': {'phishing': 0, 'normal': 0}
        }