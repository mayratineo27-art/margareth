import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const BubbleGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);
  const [bubbles, setBubbles] = useState<number[]>([]);

  useEffect(() => {
    let timer: any;
    if (phase === 'inhale') {
      timer = setTimeout(() => setPhase('hold'), 4000);
    } else if (phase === 'hold') {
      timer = setTimeout(() => setPhase('exhale'), 2000);
    } else if (phase === 'exhale') {
      timer = setTimeout(() => {
        setCount(c => c + 1);
        setPhase('inhale');
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'exhale') {
      const interval = setInterval(() => {
        setBubbles(b => [...b, Date.now()]);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setBubbles([]);
    }
  }, [phase]);

  useEffect(() => {
    if (count >= 3) {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 h-full">
      <div className="text-3xl font-bold text-indigo-600">
        {phase === 'inhale' && "Toma aire... 🌬️"}
        {phase === 'hold' && "Aguanta... 🎈"}
        {phase === 'exhale' && "Suelta burbujas... ✨"}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={{
            scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 0.8,
            backgroundColor: phase === 'inhale' ? '#BDE0FE' : phase === 'hold' ? '#A2D2FF' : '#FFD1DC',
          }}
          transition={{ duration: phase === 'hold' ? 0.2 : 4, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full shadow-inner border-4 border-white/50"
        />
        
        <AnimatePresence>
          {bubbles.map(id => (
            <motion.div
              key={id}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1.5], 
                x: (Math.random() - 0.5) * 300, 
                y: -400,
                opacity: 0 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute w-8 h-8 rounded-full bg-white/40 border border-white/60 backdrop-blur-sm"
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full ${i <= count ? 'bg-indigo-500' : 'bg-indigo-200'}`} 
          />
        ))}
      </div>
    </div>
  );
};
