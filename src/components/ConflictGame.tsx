import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, MessageCircle, HandHelping, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { generateConflictScenario, evaluateConflictChoice } from '../services/groqService';

interface Option {
  id: string;
  text: string;
  type: string;
}

interface Scenario {
  situation: string;
  question: string;
  options: Option[];
}

interface ConflictGameProps {
  onComplete: () => void;
  onSpeak: (text: string) => void;
}

export const ConflictGame: React.FC<ConflictGameProps> = ({ onComplete, onSpeak }) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadScenario = async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedId(null);
    setIsEvaluating(false);
    const data = await generateConflictScenario();
    setScenario(data);
    setLoading(false);
    if (data.situation) {
      onSpeak(data.situation + ". " + data.question);
    }
  };

  useEffect(() => {
    loadScenario();
  }, []);

  const handleChoice = async (option: Option) => {
    if (isEvaluating) return;
    setSelectedId(option.id);
    setIsEvaluating(true);

    // Smooth transition message
    onSpeak("¡Qué buena elección! Deja que Margareth piense un poquito...");

    const fb = await evaluateConflictChoice(scenario!.situation, option.text);
    setFeedback(fb);
    setIsEvaluating(false);
    onSpeak(fb);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive': return <HandHelping className="text-green-500" />;
      case 'negative': return <ShieldAlert className="text-red-500" />;
      default: return <MessageCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-8 min-h-[400px]">
      <div className="flex items-center gap-3 text-indigo-600 mb-2">
        <Users size={32} />
        <h3 className="text-2xl font-bold">Simulador de Amigos</h3>
      </div>

      <AnimatePresence mode="wait">
        {loading && !scenario ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-12"
          >
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Margareth está pensando una historia...</p>
          </motion.div>
        ) : scenario && !feedback ? (
          <motion.div
            key="scenario"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col gap-6"
          >
            <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 text-center">
              <p className="text-xl font-bold text-indigo-900 mb-2">{scenario.situation}</p>
              <p className="text-slate-600 italic">{scenario.question}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={isEvaluating}
                  className={`glass-card p-4 flex items-center gap-4 transition-all text-left group border-2 ${selectedId === option.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-transparent hover:bg-indigo-50'
                    }`}
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    {selectedId === option.id && isEvaluating ? (
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      getIcon(option.type)
                    )}
                  </div>
                  <span className="font-bold text-slate-700 flex-1">{option.text}</span>
                  {selectedId === option.id && isEvaluating ? null : <ChevronRight className="text-slate-300" />}
                </button>
              ))}
            </div>
          </motion.div>
        ) : feedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center gap-6 py-8"
          >
            <div className="w-20 h-20 bg-soft-green rounded-full flex items-center justify-center text-green-600 shadow-inner">
              <Sparkles size={40} />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-green-100 text-center">
              <p className="text-xl font-bold text-slate-800">{feedback}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={loadScenario}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Otra historia
              </button>
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg"
              >
                ¡Terminar!
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
