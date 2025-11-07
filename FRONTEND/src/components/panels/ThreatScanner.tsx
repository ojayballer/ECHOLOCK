import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Globe2, Database, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/GlassCard';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = "http://127.0.0.1:5000";

// Types
interface ScanResult {
  is_phishing: boolean;
  confidence: number;
  url: string;
  threat_type?: string;
  timestamp?: string;
}

interface FederationStatus {
  status: string;
  total_phishing_urls: number;
  unique_phishing_domains: number;
  node_uptime: number;
}

export const ThreatScanner = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [federationStatus, setFederationStatus] = useState<FederationStatus | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Poll federation status every 5 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/status`);
        if (response.ok) {
          const data = await response.json();
          setFederationStatus(data);
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.error('Federation status error:', error);
        setIsOnline(false);
      }
    };

    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    if (!url.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a URL to scan',
        variant: 'destructive',
      });
      return;
    }

    setScanning(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();
      
      const mappedResult: ScanResult = {
          is_phishing: data.verdict === 'phishing',
          confidence: data.confidence,
          url: data.url,
          timestamp: new Date().toLocaleTimeString()
      };

      setResult(mappedResult);

      // Show toast notification
      toast({
        title: mappedResult.is_phishing ? '⚠️ THREAT DETECTED' : '✅ URL Safe',
        description: `Confidence: ${mappedResult.confidence.toFixed(1)}%`,
        variant: mappedResult.is_phishing ? 'destructive' : 'default',
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: 'Scan Failed',
        description: 'Could not connect to threat intelligence network',
        variant: 'destructive',
      });
    } finally {
      setScanning(false);
    }
  };

  const totalThreats = federationStatus
    ? (federationStatus.total_phishing_urls || 0) + (federationStatus.unique_phishing_domains || 0)
    : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <Shield className="w-8 h-8 text-primary animate-pulse-glow" />
        <h2 className="text-3xl font-bold text-primary text-glow" style={{ fontFamily: 'Orbitron, monospace' }}>
          THREAT SCANNER
        </h2>
      </motion.div>

      {/* Federation Status Bar */}
      <GlassCard glow="cyan" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Uplink Status */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: isOnline ? [1, 1.2, 1] : 1,
                opacity: isOnline ? [1, 0.6, 1] : 0.3,
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-3 h-3 rounded-full ${isOnline ? 'bg-accent' : 'bg-destructive'}`}
            />
            <div>
              <p className="text-xs text-muted-foreground font-mono">FEDERATION UPLINK</p>
              <p className={`text-sm font-bold font-mono ${isOnline ? 'text-accent' : 'text-destructive'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </p>
            </div>
          </div>

          {/* Global Threat Counter */}
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground font-mono">GLOBAL THREATS</p>
              <motion.p
                key={totalThreats}
                initial={{ scale: 1.3, color: 'hsl(var(--secondary))' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                className="text-2xl font-bold font-mono"
              >
                {totalThreats.toLocaleString()}
              </motion.p>
            </div>
          </div>

          {/* Node Uptime */}
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground font-mono">NODE INTEGRITY</p>
              <p className="text-sm font-bold font-mono">
                 100%
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* URL Scanner */}
      <GlassCard glow="aqua" delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold font-mono">URL THREAT ANALYSIS</h3>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter URL to scan (e.g., http://suspicious-site.xyz)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              className="flex-1 font-mono bg-background/50 border-primary/30 focus:border-primary"
              disabled={scanning}
            />
            <Button
              onClick={handleScan}
              disabled={scanning || !url.trim()}
              className="min-w-[120px] font-mono font-bold bg-primary hover:bg-primary/80"
            >
              {scanning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"
                  />
                  SCANNING
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  SCAN NOW
                </>
              )}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Verdict Display */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.url}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <GlassCard
              glow={result.is_phishing ? 'magenta' : 'cyan'}
              delay={0}
              className={`border-2 ${
                result.is_phishing
                  ? 'border-destructive bg-destructive/10'
                  : 'border-accent bg-accent/10'
              }`}
            >
              <motion.div
                animate={
                  result.is_phishing
                    ? {
                        opacity: [1, 0.7, 1],
                        borderColor: ['hsl(var(--destructive))', 'hsl(var(--secondary))', 'hsl(var(--destructive))'],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
                className="space-y-4"
              >
                {/* Verdict Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.is_phishing ? (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <AlertTriangle className="w-12 h-12 text-destructive" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Shield className="w-12 h-12 text-accent" />
                      </motion.div>
                    )}
                    <div>
                      <motion.h3
                        className={`text-3xl font-bold font-mono ${
                          result.is_phishing ? 'text-destructive' : 'text-accent'
                        }`}
                        animate={result.is_phishing ? { opacity: [1, 0.8, 1] } : {}}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        {result.is_phishing ? '⚠️ THREAT DETECTED' : '✓ URL SAFE'}
                      </motion.h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {result.is_phishing ? 'Phishing attempt identified' : 'No threats detected'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Confidence Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono text-muted-foreground">AI CONFIDENCE SCORE</span>
                    <motion.span
                      initial={{ scale: 1.5 }}
                      animate={{ scale: 1 }}
                      className={`text-2xl font-bold font-mono ${
                        result.is_phishing ? 'text-destructive' : 'text-accent'
                      }`}
                    >
                      {result.confidence.toFixed(1)}%
                    </motion.span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${
                        result.is_phishing
                          ? 'bg-gradient-to-r from-destructive to-secondary'
                          : 'bg-gradient-to-r from-accent to-primary'
                      }`}
                    />
                  </div>
                </div>

                {/* URL Details */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-mono">TARGET URL</span>
                    <code className="text-primary font-mono text-xs break-all max-w-[60%] text-right">
                      {result.url}
                    </code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-mono">SCAN TIMESTAMP</span>
                    <span className="text-foreground font-mono">
                      {result.timestamp}
                    </span>
                  </div>
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial State - No Results */}
      {!result && !scanning && (
        <GlassCard glow="none" delay={0.3}>
          <div className="text-center py-12">
            <Globe2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground font-mono">
              Enter a URL above to begin threat analysis
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Powered by AI-driven federation intelligence
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};