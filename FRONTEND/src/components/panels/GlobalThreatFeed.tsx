import { GlassCard } from '../GlassCard';
import { globalThreats } from '@/data/mockData';
import { Globe2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';

export const GlobalThreatFeed = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-secondary text-secondary-foreground';
      case 'medium':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <Globe2 className="w-8 h-8 text-secondary animate-pulse-glow" />
        <h2 className="text-3xl font-bold text-secondary text-glow">
          Global Threat Feed
        </h2>
      </motion.div>

      <GlassCard glow="magenta" delay={0.2}>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            <motion.div
              className="w-2 h-2 rounded-full bg-secondary"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-secondary"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-secondary"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
          </div>
          <span className="text-sm text-secondary font-semibold">LIVE FEED</span>
        </div>

        <div className="space-y-3">
          {globalThreats.map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-4 rounded-lg border border-secondary/20 hover:border-secondary/50 transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <code className="text-sm text-primary">{threat.ip}</code>
                  <span className="text-sm text-muted-foreground">{threat.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {threat.type}
                  </Badge>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.status}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
