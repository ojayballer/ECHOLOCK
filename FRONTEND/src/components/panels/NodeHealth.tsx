import { GlassCard } from '../GlassCard';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { nodeHealth } from '@/data/mockData';
import { Cpu, HardDrive, Clock, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

const metrics = [
  { key: 'cpu', label: 'CPU Load', value: nodeHealth.cpu, icon: Cpu, suffix: '%', color: 'hsl(var(--chart-1))' },
  { key: 'memory', label: 'Memory', value: nodeHealth.memory, icon: HardDrive, suffix: '%', color: 'hsl(var(--chart-2))' },
  { key: 'uptime', label: 'Uptime', value: nodeHealth.uptime, icon: Clock, suffix: '%', color: 'hsl(var(--chart-3))' },
  { key: 'ping', label: 'Network Ping', value: nodeHealth.ping, icon: Wifi, suffix: 'ms', color: 'hsl(var(--chart-4))' },
];

export const NodeHealth = () => {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-accent text-glow"
      >
        Node Health
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const data = [{ value: metric.value, fill: metric.color }];

          return (
            <GlassCard key={metric.key} glow="aqua" delay={index * 0.1}>
              <div className="flex flex-col items-center">
                <Icon className="w-6 h-6 text-accent mb-2" />
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                
                <ResponsiveContainer width="100%" height={120}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, metric.key === 'ping' ? 100 : 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill={metric.color}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>

                <motion.p
                  className="text-2xl font-bold"
                  style={{ color: metric.color }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {metric.value}{metric.suffix}
                </motion.p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
