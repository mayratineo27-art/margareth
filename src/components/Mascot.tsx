import React from 'react';
import { motion } from 'motion/react';

export const Mascot: React.FC<{ message?: string; emotion?: string }> = ({ message, emotion }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: emotion === 'happy' ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-48 h-48"
      >
        {/* Simple SVG Mascot: Margareth (A friendly purple creature) */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#7E22CE', stopOpacity: 1 }} />
            </radialGradient>
          </defs>
          {/* Body */}
          <circle cx="100" cy="110" r="70" fill="url(#grad1)" />
          {/* Ears */}
          <ellipse cx="60" cy="60" rx="20" ry="30" fill="#7E22CE" transform="rotate(-30 60 60)" />
          <ellipse cx="140" cy="60" rx="20" ry="30" fill="#7E22CE" transform="rotate(30 140 60)" />
          {/* Eyes */}
          <circle cx="75" cy="100" r="12" fill="white" />
          <circle cx="125" cy="100" r="12" fill="white" />
          <motion.circle
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}
            cx="75" cy="100" r="6" fill="black"
          />
          <motion.circle
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}
            cx="125" cy="100" r="6" fill="black"
          />
          {/* Mouth */}
          {emotion === 'sad' ? (
            <path d="M 70 140 Q 100 120 130 140" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
          ) : emotion === 'angry' ? (
            <path d="M 70 140 L 130 140" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 70 130 Q 100 160 130 130" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
          )}
          {/* Cheeks */}
          <circle cx="60" cy="125" r="8" fill="#F472B6" opacity="0.6" />
          <circle cx="140" cy="125" r="8" fill="#F472B6" opacity="0.6" />
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 max-w-sm text-center font-bold text-indigo-950 font-hand text-2xl"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/60 border-t border-l border-white/40 rotate-45" />
          {message}
        </motion.div>
      )}
    </div>
  );
};
