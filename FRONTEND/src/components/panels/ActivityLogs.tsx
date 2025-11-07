import { GlassCard } from '../GlassCard';
import { activityLogs } from '@/data/mockData';
import { Terminal, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from '@/hooks/use-toast';

export const ActivityLogs = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'warning':
        return 'default';
      default:
        return 'outline';
    }
  };

  const handleExport = () => {
    toast({
      title: 'Exporting Logs',
      description: 'Activity logs are being prepared for download...',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-secondary animate-pulse-glow" />
          <h2 className="text-3xl font-bold text-secondary text-glow">
            Activity Logs
          </h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Download Charts
          </Button>
        </div>
      </motion.div>

      <GlassCard glow="magenta" delay={0.2}>
        <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
          {activityLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-3 rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs text-muted-foreground font-mono">
                      {log.time}
                    </code>
                    <Badge variant={getSeverityColor(log.severity)} className="text-xs">
                      {log.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">{log.event}</p>
                </div>
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
