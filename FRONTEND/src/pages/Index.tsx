import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { ThreatScanner } from '@/components/panels/ThreatScanner';
import { LocalDetections } from '@/components/panels/LocalDetections';
import { GlobalThreatFeed } from '@/components/panels/GlobalThreatFeed';
import { NodeHealth } from '@/components/panels/NodeHealth';
import { AIThreatScore } from '@/components/panels/AIThreatScore';
import { ActivityLogs } from '@/components/panels/ActivityLogs';

const panels = [
  ThreatScanner, // Added first
  LocalDetections,
  GlobalThreatFeed,
  NodeHealth,
  AIThreatScore,
  ActivityLogs,
];

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const ActivePanel = panels[activeTab];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default Index;
