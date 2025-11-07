import { Lock, Brain, Globe, Activity, ScrollText, Settings, Scan } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

const tabs = [
  { icon: Scan, label: 'Threat Scanner', color: 'text-primary' }, // Added first
  { icon: Activity, label: 'Local Detections', color: 'text-primary' },
  { icon: Globe, label: 'Global Threat Feed', color: 'text-secondary' },
  { icon: Settings, label: 'Node Health', color: 'text-accent' },
  { icon: Brain, label: 'AI Threat Score', color: 'text-primary' },
  { icon: ScrollText, label: 'Activity Logs', color: 'text-secondary' },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Lock className="w-8 h-8 text-primary animate-pulse-glow" />
            <h1 className="text-2xl font-bold text-glow" style={{ fontFamily: 'Orbitron' }}>
              ECHOLOCK
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === index;

              return (
                <button
                  key={index}
                  onClick={() => onTabChange(index)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                    'hover:bg-muted/50',
                    isActive && 'bg-muted'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? tab.color : 'text-muted-foreground')} />
                  <span
                    className={cn(
                      'text-sm font-medium hidden md:block',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
