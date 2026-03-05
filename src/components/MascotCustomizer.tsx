import React from 'react';
import { motion } from 'framer-motion';
import { Mascot, MascotCustomization } from './Mascot';
import { ChevronLeft, Check, Palette, Sparkles } from 'lucide-react';

interface Props {
    customization: MascotCustomization;
    onUpdate: (customization: MascotCustomization) => void;
    onClose: () => void;
}

const COLORS = [
    { name: 'Violeta', value: '#A78BFA' },
    { name: 'Rosa', value: '#F472B6' },
    { name: 'Cielo', value: '#60A5FA' },
    { name: 'Esmeralda', value: '#34D399' },
    { name: 'Ambar', value: '#FBBF24' },
];

const ACCESSORIES = [
    { id: 'none', name: 'Nada', icon: '✨' },
    { id: 'hat', name: 'Gorra', icon: '🧢' },
    { id: 'glasses', name: 'Gafas', icon: '👓' },
    { id: 'bow', name: 'Lazo', icon: '🎀' },
    { id: 'crown', name: 'Corona', icon: '👑' },
] as const;

export const MascotCustomizer: React.FC<Props> = ({ customization, onUpdate, onClose }) => {
    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto p-4">
            <div className="w-full flex items-center justify-between">
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 font-bold text-slate-600">
                    <ChevronLeft size={24} />
                    <span>Volver</span>
                </button>
                <h2 className="text-3xl font-black text-indigo-900 font-hand flex items-center gap-2">
                    <Sparkles className="text-yellow-500" />
                    El Armario de Margareth
                </h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                {/* Preview Area */}
                <div className="glass-card p-12 flex items-center justify-center min-h-[400px] bg-gradient-to-b from-white to-indigo-50/30">
                    <Mascot customization={customization} emotion="happy" message="¡Me veo genial! ✨" />
                </div>

                {/* Controls Area */}
                <div className="flex flex-col gap-8">
                    {/* Color Selection */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <Palette size={20} className="text-indigo-500" />
                            Elige mi color
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => onUpdate({ ...customization, color: color.value })}
                                    className={`w-12 h-12 rounded-2xl border-4 transition-all hover:scale-110 flex items-center justify-center`}
                                    style={{
                                        backgroundColor: color.value,
                                        borderColor: customization.color === color.value ? 'white' : 'transparent',
                                        boxShadow: customization.color === color.value ? `0 0 0 4px ${color.value}` : 'none'
                                    }}
                                >
                                    {customization.color === color.value && <Check size={20} className="text-white drop-shadow-md" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accessory Selection */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <Sparkles size={20} className="text-indigo-500" />
                            Mis accesorios
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {ACCESSORIES.map((acc) => (
                                <button
                                    key={acc.id}
                                    onClick={() => onUpdate({ ...customization, accessory: acc.id })}
                                    className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 font-black ${customization.accessory === acc.id
                                            ? 'bg-indigo-600 border-indigo-200 text-white translate-y-[-4px] shadow-lg'
                                            : 'bg-white border-slate-50 text-slate-400 hover:border-indigo-100'
                                        }`}
                                >
                                    <span className="text-3xl">{acc.icon}</span>
                                    <span className="text-xs uppercase tracking-wider">{acc.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="btn-primary w-full py-6 text-xl translate-y-2 shadow-2xl"
                    >
                        ¡Listo para jugar!
                    </button>
                </div>
            </div>
        </div>
    );
};
