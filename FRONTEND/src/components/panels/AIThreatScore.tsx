import { GlassCard } from '../GlassCard';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { aiThreatScore } from '@/data/mockData';
import { Brain, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const radarData = [
  { category: 'Network', value: 85 },
  { category: 'Endpoint', value: 72 },
  { category: 'Email', value: 90 },
  { category: 'Web', value: 68 },
  { category: 'Cloud', value: 78 },
];

export const AIThreatScore = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <Brain className="w-8 h-8 text-primary animate-pulse-glow" />
        <h2 className="text-3xl font-bold text-primary text-glow">
          AI Threat Score
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard glow="cyan" delay={0.2}>
          <h3 className="text-xl font-semibold mb-4 text-center">Risk Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Radar
                name="Threat Level"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
          <motion.div
            className="text-center mt-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-5xl font-bold text-primary text-glow">
              {aiThreatScore.risk}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">Overall Risk Level</p>
          </motion.div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard glow="magenta" delay={0.3}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                  <p className="text-3xl font-bold text-destructive">{aiThreatScore.critical}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="aqua" delay={0.4}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">False Positives Filtered</p>
                  <p className="text-3xl font-bold text-accent">{aiThreatScore.falsePositives}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="cyan" delay={0.5}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                  <p className="text-3xl font-bold text-primary">{aiThreatScore.accuracy}%</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
