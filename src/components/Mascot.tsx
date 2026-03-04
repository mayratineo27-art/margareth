import React from 'react';
import { motion } from 'motion/react';

export const Mascot: React.FC<{ message?: string; emotion?: string; interactive?: boolean; onInteract?: () => void }> = ({ message, emotion, interactive, onInteract }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: emotion === 'happy' ? [0, 3, -3, 0] : [0, 1, -1, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`relative w-56 h-56 cursor-pointer group transition-all duration-500`}
        onClick={onInteract}
      >
        {/* Glow behind mascot */}
        <div className="absolute inset-0 bg-purple-400/20 blur-3xl rounded-full scale-110 group-hover:bg-purple-400/30 transition-colors" />

        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_20px_rgba(126,34,206,0.3)]">
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="45%" fy="45%">
              <stop offset="0%" style={{ stopColor: '#C084FC', stopOpacity: 1 }} />
              <stop offset="70%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#7E22CE', stopOpacity: 1 }} />
            </radialGradient>
            <filter id="fluff">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
          </defs>

          {/* Ears - Fluffier and twitching */}
          <motion.path
            d="M 50 70 Q 30 20 60 40 L 80 80 Z"
            fill="#7E22CE"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: 'url(#fluff)' }}
          />
          <motion.path
            d="M 150 70 Q 170 20 140 40 L 120 80 Z"
            fill="#7E22CE"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ filter: 'url(#fluff)' }}
          />

          {/* Body - Fluffy creature */}
          <circle cx="100" cy="115" r="75" fill="url(#grad1)" style={{ filter: 'url(#fluff)' }} />

          {/* Eyes - Sparkly and larger */}
          <g>
            <circle cx="72" cy="105" r="18" fill="white" />
            <circle cx="128" cy="105" r="18" fill="white" />

            <motion.g
              animate={{
                scale: emotion === 'happy' ? 1.2 : 1,
                y: emotion === 'sad' ? 2 : 0
              }}
            >
              <circle cx="72" cy="105" r="10" fill="#1E293B" />
              <circle cx="128" cy="105" r="10" fill="#1E293B" />

              {/* Eye Sparkles */}
              <circle cx="68" cy="100" r="4" fill="white" opacity="0.9" />
              <circle cx="76" cy="108" r="2" fill="white" opacity="0.7" />
              <circle cx="124" cy="100" r="4" fill="white" opacity="0.9" />
              <circle cx="132" cy="108" r="2" fill="white" opacity="0.7" />
            </motion.g>

            {/* Blinking */}
            <motion.rect
              animate={{ height: [0, 36, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], delay: 2 }}
              x="50" y="87" width="44" height="0" rx="18" fill="url(#grad1)"
            />
            <motion.rect
              animate={{ height: [0, 36, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1], delay: 2 }}
              x="106" y="87" width="44" height="0" rx="18" fill="url(#grad1)"
            />
          </g>

          {/* Paws */}
          <motion.circle
            animate={{ x: emotion === 'happy' ? [0, -5, 0] : 0, y: emotion === 'happy' ? [0, -10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            cx="55" cy="160" r="12" fill="#9333EA"
          />
          <motion.circle
            animate={{ x: emotion === 'happy' ? [0, 5, 0] : 0, y: emotion === 'happy' ? [0, -10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: 0.2 }}
            cx="145" cy="160" r="12" fill="#9333EA"
          />

          {/* Mouth */}
          {emotion === 'sad' ? (
            <path d="M 85 145 Q 100 135 115 145" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          ) : emotion === 'angry' ? (
            <path d="M 85 145 L 115 145" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          ) : (
            <path d="M 80 140 Q 100 160 120 140" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          )}

          {/* Cheeks */}
          <circle cx="55" cy="135" r="10" fill="#FDA4AF" opacity="0.5" />
          <circle cx="145" cy="135" r="10" fill="#FDA4AF" opacity="0.5" />

          {/* Heart accessory when happy */}
          {emotion === 'happy' && (
            <motion.path
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              d="M 100 65 C 100 60 90 55 85 65 C 80 75 100 85 100 85 C 100 85 120 75 115 65 C 110 55 100 60 100 65"
              fill="#F43F5E"
            />
          )}
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white/70 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-white/60 max-w-sm text-center font-bold text-indigo-950 font-hand text-2xl leading-relaxed"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/70 border-t border-l border-white/60 rotate-45" />
          {message}
        </motion.div>
      )}
    </div>
  );
};
