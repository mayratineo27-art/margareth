import React from 'react';
import { motion } from 'motion/react';

export const Mascot: React.FC<{ message?: string; emotion?: string; interactive?: boolean; onInteract?: () => void }> = ({ message, emotion, interactive, onInteract }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Shadow/Base Platform */}
        <motion.ellipse
          animate={{
            scale: emotion === 'happy' ? [1, 0.8, 1] : [1, 1.05, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          cx="0" cy="0" rx="50" ry="15"
          className="absolute bottom-4 fill-slate-900/10"
          style={{ transform: 'translateX(-50%)' }}
        />

        <motion.div
          animate={{
            y: emotion === 'happy' ? [0, -40, 0] : [0, -8, 0],
            scaleX: emotion === 'happy' ? [1, 0.9, 1.1, 1] : [1, 1.02, 1],
            scaleY: emotion === 'happy' ? [1, 1.1, 0.9, 1] : [1, 0.98, 1],
            rotate: emotion === 'sad' ? [0, -2, 2, 0] : 0
          }}
          transition={{
            duration: emotion === 'happy' ? 0.6 : 3,
            repeat: Infinity,
            ease: emotion === 'happy' ? "easeOut" : "easeInOut"
          }}
          className="relative w-48 h-48 cursor-pointer z-10"
          onClick={onInteract}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="spriteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Ears - Bouncy sprite style */}
            <motion.path
              animate={{ rotate: emotion === 'happy' ? [0, -15, 15, 0] : [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              d="M 60 40 Q 40 0 80 20 L 90 70 Z"
              fill="#8B5CF6"
              stroke="#4C1D95"
              strokeWidth="4"
            />
            <motion.path
              animate={{ rotate: emotion === 'happy' ? [0, 15, -15, 0] : [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              d="M 140 40 Q 160 0 120 20 L 110 70 Z"
              fill="#8B5CF6"
              stroke="#4C1D95"
              strokeWidth="4"
            />

            {/* Body - Rounder Game Character */}
            <rect x="45" y="60" width="110" height="110" rx="55" fill="url(#spriteGrad)" stroke="#4C1D95" strokeWidth="6" />

            {/* Belly patch */}
            <circle cx="100" cy="130" r="35" fill="white" opacity="0.2" />

            {/* Eyes - Large, animated, friendly */}
            <g>
              <motion.g
                animate={{
                  scaleY: emotion === 'sad' ? 0.5 : 1,
                  y: emotion === 'sad' ? 5 : 0
                }}
              >
                <circle cx="75" cy="110" r="14" fill="white" />
                <circle cx="125" cy="110" r="14" fill="white" />
                <circle cx="75" cy="110" r="8" fill="#1E293B" />
                <circle cx="125" cy="110" r="8" fill="#1E293B" />
                <circle cx="78" cy="107" r="3" fill="white" />
                <circle cx="128" cy="107" r="3" fill="white" />
              </motion.g>

              {/* Blink */}
              <motion.rect
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], delay: 2 }}
                x="60" y="95" width="30" height="30" rx="15" fill="#A78BFA"
              />
              <motion.rect
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], delay: 2 }}
                x="110" y="95" width="30" height="30" rx="15" fill="#A78BFA"
              />
            </g>

            {/* Mouth */}
            {emotion === 'happy' ? (
              <path d="M 85 140 Q 100 155 115 140" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            ) : emotion === 'sad' ? (
              <path d="M 90 150 Q 100 142 110 150" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 90 145 Q 100 153 110 145" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            )}

            {/* Blush */}
            <circle cx="55" cy="130" r="10" fill="#FDA4AF" opacity="0.5" />
            <circle cx="145" cy="130" r="10" fill="#FDA4AF" opacity="0.5" />

            {/* Hands */}
            <motion.circle
              animate={{
                y: emotion === 'happy' ? [0, -20, 0] : 0,
                x: emotion === 'happy' ? [0, -5, 0] : 0
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
              cx="40" cy="150" r="12" fill="#7C3AED" stroke="#4C1D95" strokeWidth="3"
            />
            <motion.circle
              animate={{
                y: emotion === 'happy' ? [0, -20, 0] : 0,
                x: emotion === 'happy' ? [0, 5, 0] : 0
              }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              cx="160" cy="150" r="12" fill="#7C3AED" stroke="#4C1D95" strokeWidth="3"
            />
          </svg>
        </motion.div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border-4 border-indigo-100 max-w-sm text-center font-bold text-indigo-950 font-hand text-2xl leading-relaxed"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-indigo-100 border-t-0 border-l-0 rotate-45" />
          {message}
        </motion.div>
      )}
    </div>
  );
};
