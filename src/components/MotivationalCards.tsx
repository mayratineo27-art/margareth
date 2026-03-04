import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Star, Sun, CloudRain, ShieldCheck } from 'lucide-react';

const CARDS = [
    { id: 1, text: "¡Eres valiente como un león!", icon: Star, color: "#FDE047", bg: "bg-yellow-100" },
    { id: 2, text: "Tu sonrisa ilumina el mundo.", icon: Sun, color: "#FB923C", bg: "bg-orange-100" },
    { id: 3, text: "Está bien sentir, respiramos juntos.", icon: CloudRain, color: "#60A5FA", bg: "bg-blue-100" },
    { id: 4, text: "Eres un gran amigo y muy amado.", icon: Heart, color: "#F472B6", bg: "bg-pink-100" },
    { id: 5, text: "Tu corazón es puro y mágico.", icon: Sparkles, color: "#A78BFA", bg: "bg-purple-100" },
    { id: 6, text: "Tienes el poder de estar en calma.", icon: ShieldCheck, color: "#34D399", bg: "bg-emerald-100" },
];

export const MotivationalCards: React.FC = () => {
    const [index, setIndex] = useState(0);

    const nextCard = () => {
        setIndex((prev) => (prev + 1) % CARDS.length);
    };

    const current = CARDS[index];

    return (
        <div className="w-full flex flex-col items-center gap-6 py-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                    transition={{ duration: 0.5, type: 'spring', damping: 15 }}
                    className={`w-full max-w-sm aspect-[3/4] ${current.bg} rounded-[3rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center gap-8 border-4 border-white relative overflow-hidden group cursor-pointer`}
                    onClick={nextCard}
                >
                    {/* Decorative background circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <current.icon size={48} color={current.color} />
                    </div>

                    <h3 className="text-3xl font-black text-slate-800 font-hand leading-tight">
                        {current.text}
                    </h3>

                    <div className="flex gap-2">
                        {CARDS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${i === index ? 'w-6 bg-slate-800' : 'bg-slate-300'}`}
                            />
                        ))}
                    </div>

                    <p className="text-sm font-bold text-slate-400 absolute bottom-6">
                        Toca para ver otra tarjeta mágica
                    </p>
                </motion.div>
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextCard}
                className="px-8 py-3 bg-white text-slate-800 rounded-full font-bold shadow-md border border-slate-100 flex items-center gap-2 hover:bg-slate-50 transition-colors"
            >
                <Sparkles size={20} className="text-purple-500" />
                Siguiente mensaje mágico
            </motion.button>
        </div>
    );
};
