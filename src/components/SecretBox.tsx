import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Sparkles, Wind } from 'lucide-react';

interface SecretBoxProps {
  onComplete: () => void;
}

export const SecretBox: React.FC<SecretBoxProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'write' | 'throw' | 'transform'>('write');
  const [thought, setThought] = useState('');

  const handleTransform = () => {
    setStep('transform');
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full gap-6">
      <AnimatePresence mode="wait">
        {step === 'write' && (
          <motion.div
            key="write"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <h3 className="text-2xl font-bold text-indigo-900 text-center">¿Qué te hace sentir mal hoy?</h3>
            <p className="text-slate-500 text-center">Escríbelo o dibújalo aquí para que Margareth lo transforme.</p>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Escribe aquí..."
              className="w-full h-32 p-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 outline-none resize-none text-lg"
            />
            <button
              onClick={() => setStep('throw')}
              disabled={!thought.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              ¡Listo!
            </button>
          </motion.div>
        )}

        {step === 'throw' && (
          <motion.div
            key="throw"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col items-center gap-8"
          >
            <h3 className="text-2xl font-bold text-indigo-900 text-center">¡Ahora lánzalo a la Caja Mágica!</h3>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-48 h-48 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl relative"
              onClick={handleTransform}
            >
              <Trash2 size={80} />
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 p-2 rounded-full animate-bounce">
                <Sparkles size={24} />
              </div>
            </motion.div>
            <p className="text-slate-400 italic">Toca la caja para atrapar tu pensamiento...</p>
          </motion.div>
        )}

        {step === 'transform' && (
          <motion.div
            key="transform"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 2 }}
              className="text-yellow-500"
            >
              <Sparkles size={120} />
            </motion.div>
            <h3 className="text-3xl font-black text-indigo-900 text-center">¡Transformado en Polvo de Estrellas!</h3>
            <p className="text-xl text-indigo-600 font-bold">¡Ya no puede hacerte daño! ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
