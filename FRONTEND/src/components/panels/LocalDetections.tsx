import { GlassCard } from '../GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { threatDetections, hourlyThreats } from '@/data/mockData';
import { Shield, AlertTriangle, Bug, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const icons = [Shield, Bug, Zap, AlertTriangle];

export const LocalDetections = () => {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-primary text-glow"
      >
        Local Detections
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {threatDetections.map((threat, index) => {
          const Icon = icons[index];
          return (
            <GlassCard key={threat.name} glow="cyan" delay={index * 0.1}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{threat.name}</p>
                  <p className="text-3xl font-bold text-primary animate-pulse-glow">
                    {threat.count}
                  </p>
                </div>
                <Icon className="w-10 h-10 text-primary opacity-50" />
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard glow="aqua" delay={0.4}>
        <h3 className="text-xl font-semibold mb-4 text-accent">Threat Activity (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={hourlyThreats}>
            <defs>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorThreats)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
};
