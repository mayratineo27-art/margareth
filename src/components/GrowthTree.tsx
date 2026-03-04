import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Sun, Sparkles, CloudRain } from 'lucide-react';

interface GrowthTreeProps {
  level: number;
  onPlaySound: (type: 'pop' | 'success' | 'click' | 'magic') => void;
  onSpeak: (text: string) => void;
}

export const GrowthTree: React.FC<GrowthTreeProps> = ({ level, onPlaySound, onSpeak }) => {
  const [isWatering, setIsWatering] = useState(false);
  const [isSunny, setIsSunny] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Growth milestones
  const milestones = [
    { name: 'Semilla', min: 0, max: 0, stage: 'seed' },
    { name: 'Brote', min: 1, max: 2, stage: 'sprout' },
    { name: 'Arbolito', min: 3, max: 6, stage: 'sapling' },
    { name: 'Árbol Fuerte', min: 7, max: 11, stage: 'tree' },
    { name: 'Árbol Florido', min: 12, max: 100, stage: 'flowering' }
  ];

  const currentMilestoneIndex = milestones.findIndex(m => level >= m.min && level <= m.max) === -1 
    ? milestones.length - 1 
    : milestones.findIndex(m => level >= m.min && level <= m.max);
  
  const currentMilestone = milestones[currentMilestoneIndex];
  const nextMilestone = milestones[currentMilestoneIndex + 1];
  const stage = currentMilestone.stage;

  const progressToNext = nextMilestone 
    ? ((level - currentMilestone.min) / (nextMilestone.min - currentMilestone.min)) * 100 
    : 100;

  const handleWater = () => {
    if (isWatering) return;
    onPlaySound('pop');
    setIsWatering(true);
    onSpeak("¡Qué refrescante! Me encanta el agua.");
    setTimeout(() => {
      setIsWatering(false);
      setShowSparkles(true);
      onPlaySound('magic');
      setTimeout(() => setShowSparkles(false), 2000);
    }, 2000);
  };

  const handleSun = () => {
    if (isSunny) return;
    onPlaySound('click');
    setIsSunny(true);
    onSpeak("¡Qué calientito! El sol me ayuda a crecer.");
    setTimeout(() => {
      setIsSunny(false);
      onPlaySound('success');
    }, 3000);
  };

  const handleTreeClick = () => {
    setIsShaking(true);
    onPlaySound('pop');
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-8 py-10">
      {/* Sky Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <AnimatePresence>
          {isSunny && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-4 right-8 text-yellow-400"
            >
              <Sun size={80} className="animate-spin-slow" />
            </motion.div>
          )}
          {isWatering && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 text-blue-400"
            >
              <CloudRain size={60} />
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, 200], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 h-3 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The Tree Container */}
      <div className="relative w-64 h-64 flex items-end justify-center">
        <motion.div
          animate={{ 
            scale: isSunny ? 1.1 : 1,
            rotate: isWatering ? [0, -2, 2, 0] : isShaking ? [0, -5, 5, -5, 0] : 0
          }}
          onClick={handleTreeClick}
          className="relative z-10 cursor-pointer active:scale-95 transition-transform"
        >
          <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-lg">
            {/* Ground */}
            <ellipse cx="100" cy="180" rx="60" ry="10" fill="#8D6E63" opacity="0.4" />
            
            {/* Seed Stage */}
            {stage === 'seed' && (
              <motion.circle 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                cx="100" cy="175" r="8" fill="#5D4037" 
              />
            )}

            {/* Sprout Stage */}
            {(stage === 'sprout' || stage === 'sapling' || stage === 'tree' || stage === 'flowering') && (
              <motion.path
                d="M 100 180 Q 100 160 100 150"
                stroke="#5D4037"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            )}

            {/* Sapling/Tree Trunk */}
            {(stage === 'sapling' || stage === 'tree' || stage === 'flowering') && (
              <motion.path
                d="M 100 180 L 100 120"
                stroke="#5D4037"
                strokeWidth={stage === 'sapling' ? "10" : "16"}
                strokeLinecap="round"
              />
            )}

            {/* Leaves */}
            {(stage === 'sprout') && (
              <motion.path
                d="M 100 150 Q 115 135 130 150 Q 115 165 100 150"
                fill="#81C784"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}

            {(stage === 'sapling' || stage === 'tree' || stage === 'flowering') && (
              <g>
                <motion.circle 
                  animate={{ scale: stage === 'sapling' ? 0.6 : stage === 'tree' ? 1 : 1.2 }}
                  cx="100" cy="90" r="50" fill="#4CAF50" 
                />
                <motion.circle 
                  animate={{ scale: stage === 'sapling' ? 0.6 : stage === 'tree' ? 1 : 1.2 }}
                  cx="70" cy="110" r="40" fill="#66BB6A" 
                />
                <motion.circle 
                  animate={{ scale: stage === 'sapling' ? 0.6 : stage === 'tree' ? 1 : 1.2 }}
                  cx="130" cy="110" r="40" fill="#81C784" 
                />
              </g>
            )}

            {/* Flowers/Fruits */}
            {stage === 'flowering' && (
              Array.from({ length: Math.min(level, 15) }).map((_, i) => (
                <motion.g
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  transform={`translate(${60 + Math.random() * 80}, ${60 + Math.random() * 70})`}
                >
                  <circle r="6" fill="#FF80AB" />
                  <circle r="2" fill="#FFEB3B" />
                </motion.g>
              ))
            )}
          </svg>

          {/* Sparkles on Growth */}
          <AnimatePresence>
            {showSparkles && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      x: [0, (i % 2 ? 50 : -50)], 
                      y: [0, (i < 3 ? -50 : 50)],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute text-yellow-400"
                  >
                    <Sparkles size={20} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-2">
        <div className="flex justify-between text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <span>{currentMilestone.name}</span>
          {nextMilestone && <span>Próximo: {nextMilestone.name}</span>}
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
          />
        </div>
        {!nextMilestone && (
          <p className="text-[10px] text-center text-emerald-500 font-bold">¡HAS ALCANZADO EL MÁXIMO NIVEL!</p>
        )}
      </div>

      {/* Game Controls */}
      <div className="flex gap-6 mt-4">
        <button
          onClick={handleWater}
          disabled={isWatering}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
            isWatering ? 'bg-blue-100 text-blue-600' : 'bg-white hover:bg-blue-50 text-blue-400 shadow-md'
          }`}
        >
          <Droplets size={32} />
          <span className="font-bold text-sm">Regar</span>
        </button>

        <button
          onClick={handleSun}
          disabled={isSunny}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
            isSunny ? 'bg-yellow-100 text-yellow-600' : 'bg-white hover:bg-yellow-50 text-yellow-400 shadow-md'
          }`}
        >
          <Sun size={32} />
          <span className="font-bold text-sm">Dar Sol</span>
        </button>
      </div>

      <div className="text-center max-w-xs">
        <p className="text-indigo-900 font-bold text-lg">
          {stage === 'seed' && "¡Es una semilla mágica! Cuídala mucho."}
          {stage === 'sprout' && "¡Mira! Está naciendo algo hermoso."}
          {stage === 'sapling' && "Tu árbol está creciendo fuerte."}
          {stage === 'tree' && "¡Qué árbol tan grande y sano!"}
          {stage === 'flowering' && "¡Tu árbol está lleno de flores de alegría!"}
        </p>
      </div>
    </div>
  );
};
