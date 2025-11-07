import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'magenta' | 'aqua' | 'none';
  delay?: number;
}

export const GlassCard = ({ children, className, glow = 'none', delay = 0 }: GlassCardProps) => {
  const glowClasses = {
    cyan: 'glow-cyan',
    magenta: 'glow-magenta',
    aqua: 'glow-aqua',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]',
        glowClasses[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
};
