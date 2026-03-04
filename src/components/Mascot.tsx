import React from 'react';
import { motion } from 'motion/react';

export const Mascot: React.FC<{ message?: string; emotion?: string; interactive?: boolean; onInteract?: () => void }> = ({ message, emotion, interactive, onInteract }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: emotion === 'happy' ? [0, 2, -2, 0] : [0, 0.5, -0.5, 0],
          scale: [1, 1.01, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-56 h-56 cursor-pointer group"
        onClick={onInteract}
      >
        {/* Soft Glow */}
        <div className="absolute inset-0 bg-purple-200/30 blur-3xl rounded-full scale-110" />

        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#D8B4FE', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Ears - Round and friendly */}
          <circle cx="60" cy="70" r="25" fill="#A855F7" />
          <circle cx="140" cy="70" r="25" fill="#A855F7" />
          <circle cx="60" cy="70" r="15" fill="#F0ABFC" />
          <circle cx="140" cy="70" r="15" fill="#F0ABFC" />

          {/* Body - Soft round shape */}
          <rect x="40" y="80" width="120" height="100" rx="55" fill="url(#bodyGrad)" />

          {/* White Belly - Makes it look like a plushie */}
          <circle cx="100" cy="145" r="35" fill="white" opacity="0.3" />

          {/* Eyes - Simple, round, friendly */}
          <g>
            <circle cx="75" cy="115" r="10" fill="#2D3748" />
            <circle cx="125" cy="115" r="10" fill="#2D3748" />

            {/* Eye Sparkle */}
            <circle cx="78" cy="112" r="3" fill="white" />
            <circle cx="128" cy="112" r="3" fill="white" />

            {/* Simple Blink Animation */}
            <motion.ellipse
              animate={{ scaleY: [0, 1.2, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], delay: 3 }}
              cx="75" cy="115" rx="11" ry="11" fill="#D8B4FE"
            />
            <motion.ellipse
              animate={{ scaleY: [0, 1.2, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], delay: 3 }}
              cx="125" cy="115" rx="11" ry="11" fill="#D8B4FE"
            />
          </g>

          {/* Hands/Paws - Small and stubby */}
          <motion.circle
            animate={{ y: emotion === 'happy' ? [0, -8, 0] : 0 }}
            transition={{ duration: 0.6, repeat: Infinity }}
            cx="45" cy="150" r="12" fill="#9333EA"
          />
          <motion.circle
            animate={{ y: emotion === 'happy' ? [0, -8, 0] : 0 }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
            cx="155" cy="150" r="12" fill="#9333EA"
          />

          {/* Mouth - Sweet curve */}
          {emotion === 'sad' ? (
            <path d="M 90 140 Q 100 132 110 140" stroke="#2D3748" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : emotion === 'angry' ? (
            <path d="M 90 140 L 110 140" stroke="#2D3748" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 90 135 Q 100 145 110 135" stroke="#2D3748" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}

          {/* Rosy Cheeks */}
          <circle cx="60" cy="130" r="8" fill="#FDA4AF" opacity="0.6" />
          <circle cx="140" cy="130" r="8" fill="#FDA4AF" opacity="0.6" />
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/50 max-w-sm text-center font-bold text-indigo-950 font-hand text-2xl leading-relaxed"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/80 border-t border-l border-white/50 rotate-45" />
          {message}
        </motion.div>
      )}
    </div>
  );
};
