/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  BookOpen,
  Gamepad2,
  TreePine,
  Mic,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  X,
  Trash2,
  Camera,
  Award,
  BarChart3,
  UserCircle,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { EMOTIONS, DiaryEntry, Emotion } from './types';
import { Mascot } from './components/Mascot';
import { DrawingCanvas } from './components/DrawingCanvas';
import { GrowthTree } from './components/GrowthTree';
import { BubbleGame } from './components/BubbleGame';
import { SecretBox } from './components/SecretBox';
import { MagicMirror } from './components/MagicMirror';
import { ConflictGame } from './components/ConflictGame';
import { MotivationalCards } from './components/MotivationalCards';
import { MascotRun } from './components/MascotRun';
import { getDailyAdvice, analyzeEmotion, speakMessage, generateConflictScenario, evaluateConflictChoice } from './services/groqService';

export default function App() {
  const [view, setView] = useState<'home' | 'diary' | 'games' | 'tree' | 'stickers' | 'teacher'>('home');
  const [diarySubView, setDiarySubView] = useState<'new' | 'history'>('new');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [drawing, setDrawing] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [dailyAdvice, setDailyAdvice] = useState<string>("¡Hola! Soy Margareth, tu amiga emocional.");
  const [mascotMessage, setMascotMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeGame, setActiveGame] = useState<'bubbles' | 'secret' | 'mirror' | 'conflict' | null>(null);
  const [stickers, setStickers] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(!window.navigator.onLine);

  const playSound = (type: 'pop' | 'success' | 'click' | 'magic') => {
    const sounds = {
      pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
      click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      magic: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.4;
    audio.play().catch(() => { }); // Ignore autoplay blocks
  };

  const handleSpeak = (text: string) => {
    speakMessage(text);
  };

  // Load data
  useEffect(() => {
    const savedDiary = localStorage.getItem('margareth_diary');
    const savedStickers = localStorage.getItem('margareth_stickers');
    if (savedDiary) setDiaryEntries(JSON.parse(savedDiary));
    if (savedStickers) setStickers(JSON.parse(savedStickers));

    const fetchAdvice = async () => {
      const history = JSON.parse(savedDiary || '[]');
      const advice = await getDailyAdvice(history);
      setDailyAdvice(advice);
      setMascotMessage(advice);
      // Speak advice on start
      setTimeout(() => handleSpeak("¡Hola! Soy Margareth. " + advice), 1000);
    };
    fetchAdvice();

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Contextual Guidance & Audio Instructions
  useEffect(() => {
    if (view === 'diary' && !selectedEmotion) {
      handleSpeak("¿Cómo te sientes hoy? Toca una carita.");
    } else if (view === 'games' && !activeGame) {
      handleSpeak("¡Vamos a jugar! Elige un juego para sentirte mejor.");
    } else if (view === 'tree') {
      handleSpeak("¡Mira cuánto ha crecido tu árbol de sentimientos!");
    } else if (view === 'teacher') {
      handleSpeak("Bienvenida al panel de control, profesora.");
    }
  }, [view]);

  const saveEntry = async () => {
    if (!selectedEmotion) return;
    setLoading(true);
    playSound('success');

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      emotionId: selectedEmotion.id,
      drawing: drawing,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...diaryEntries];
    setDiaryEntries(updated);
    localStorage.setItem('margareth_diary', JSON.stringify(updated));

    // Award a sticker if it's a milestone
    if (updated.length % 3 === 0) {
      const newStickers = [...stickers, '🌟'];
      setStickers(newStickers);
      localStorage.setItem('margareth_stickers', JSON.stringify(newStickers));
    }

    // Analyze with Gemini
    const feedback = await analyzeEmotion(selectedEmotion.label, drawing);

    // Smart Suggestion
    let suggestion = "";
    if (selectedEmotion.id === 'angry' || selectedEmotion.id === 'scared') {
      suggestion = " ¿Quieres jugar a las burbujas para calmarte?";
    }

    setMascotMessage(feedback + suggestion);
    handleSpeak(feedback + suggestion);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [selectedEmotion.color, '#ffffff']
    });

    setLoading(false);
    setTimeout(() => {
      if (selectedEmotion.id === 'angry' || selectedEmotion.id === 'scared') {
        setView('games');
        setActiveGame('bubbles');
      } else {
        setView('home');
      }
      setSelectedEmotion(null);
      setDrawing("");
    }, 7000);
  };

  const getChartData = () => {
    const counts = EMOTIONS.map(e => ({
      name: e.label,
      count: diaryEntries.filter(entry => entry.emotionId === e.id).length,
      color: e.color
    }));
    return counts;
  };

  const handleGameComplete = (type: string) => {
    setActiveGame(null);
    playSound('magic');
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    const msg = type === 'secret'
      ? "¡Ese pensamiento ya no existe! Lo transformamos en magia."
      : type === 'mirror'
        ? "¡Qué sonrisa tan bonita! Te ves radiante."
        : type === 'conflict'
          ? "¡Eres un gran amigo! Sabes resolver problemas con amor."
          : "¡Lo hiciste genial! Te ves mucho más tranquilo.";
    setMascotMessage(msg);
    handleSpeak(msg);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-5xl mx-auto selection:bg-indigo-200">
      <div className="premium-bg" />
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView('home')}
        >
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Heart fill="currentColor" className="animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-indigo-900 tracking-tighter font-hand text-gradient">MARGARETH</h1>
        </motion.div>

        <div className="flex gap-2">
          <button
            onClick={() => { playSound('click'); setView('teacher'); }}
            className={`p-3 rounded-2xl transition-all ${view === 'teacher' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
            title="Modo Maestro"
          >
            <BarChart3 size={24} />
          </button>
          <button
            onClick={() => { playSound('click'); setView('stickers'); }}
            className={`p-3 rounded-2xl transition-all relative ${view === 'stickers' ? 'bg-yellow-100 text-yellow-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <Award size={24} />
            {stickers.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {stickers.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <Mascot
                message={mascotMessage}
                emotion={diaryEntries[0]?.emotionId || 'happy'}
                onInteract={() => {
                  const phrases = [
                    "¡Me encanta jugar contigo! ✨",
                    "Eres una persona muy especial. 💖",
                    "¡Qué alegría verte de nuevo! 🌈",
                    "¿Hacemos algo mágico hoy? 🪄",
                    "Tu corazón brilla mucho. 🌟"
                  ];
                  const random = phrases[Math.floor(Math.random() * phrases.length)];
                  setMascotMessage(random);
                  handleSpeak(random);
                  playSound('magic');
                }}
              />

              {/* Quick Breathe Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playSound('click'); setView('games'); setActiveGame('bubbles'); }}
                className="w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-[2rem] shadow-xl font-bold text-xl group"
              >
                <div className="bg-white/20 p-2 rounded-full group-hover:rotate-12 transition-transform">
                  <Sparkles />
                </div>
                ¡Necesito un momento de calma! (Respirar)
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <button
                  onClick={() => { playSound('click'); setView('diary'); }}
                  className="glass-card p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform group"
                >
                  <div className="w-16 h-16 bg-soft-pink rounded-3xl flex items-center justify-center text-pink-600 group-hover:rotate-12 transition-transform">
                    <BookOpen size={32} />
                  </div>
                  <span className="font-bold text-xl">Mi Diario</span>
                </button>

                <button
                  onClick={() => { playSound('click'); setView('games'); }}
                  className="glass-card p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform group"
                >
                  <div className="w-16 h-16 bg-soft-blue rounded-3xl flex items-center justify-center text-blue-600 group-hover:rotate-12 transition-transform">
                    <Gamepad2 size={32} />
                  </div>
                  <span className="font-bold text-xl">Juegos</span>
                </button>

                <button
                  onClick={() => { playSound('click'); setView('tree'); }}
                  className="glass-card p-8 flex flex-col items-center gap-4 hover:scale-105 transition-transform group"
                >
                  <div className="w-16 h-16 bg-soft-green rounded-3xl flex items-center justify-center text-green-600 group-hover:rotate-12 transition-transform">
                    <TreePine size={32} />
                  </div>
                  <span className="font-bold text-xl">Mi Árbol</span>
                </button>
              </div>

              {/* Motivational Cards Section */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-yellow-500" />
                  <h3 className="text-2xl font-black text-indigo-900 font-hand">Tarjetas Mágicas</h3>
                </div>
                <MotivationalCards />
              </div>

              {/* Weekly Mood Summary */}
              {diaryEntries.length > 0 && (
                <div className="w-full glass-card p-6 flex flex-col gap-4 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-indigo-950 font-hand text-xl">¿Cómo has estado últimamente?</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-bold">Últimos 5 días</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {diaryEntries.slice(0, 5).map((entry) => {
                      const emotion = EMOTIONS.find(e => e.id === entry.emotionId);
                      return (
                        <div key={entry.id} className={`flex-shrink-0 w-16 h-20 ${emotion?.bg} rounded-2xl flex flex-col items-center justify-center gap-1 border border-white/40`}>
                          {emotion && <emotion.icon size={24} color={emotion.color} />}
                          <span className="text-[10px] font-bold text-slate-500">
                            {new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Daily Advice Banner */}
              <div className="w-full bg-indigo-50 p-6 rounded-[2.5rem] border-2 border-indigo-100 flex items-center gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-indigo-500">
                  <Sparkles />
                </div>
                <p className="font-medium text-indigo-800 italic text-lg leading-snug">"{dailyAdvice}"</p>
              </div>
            </motion.div>
          )}

          {view === 'diary' && (
            <motion.div
              key="diary"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full flex flex-col gap-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ChevronLeft size={32} />
                  </button>
                  <h2 className="text-3xl font-bold font-hand">Mi Diario del Corazón</h2>
                </div>
                <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
                  <button
                    onClick={() => setDiarySubView('new')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${diarySubView === 'new' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400'}`}
                  >
                    Nuevo
                  </button>
                  <button
                    onClick={() => setDiarySubView('history')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${diarySubView === 'history' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400'}`}
                  >
                    Historial
                  </button>
                </div>
              </div>

              {diarySubView === 'new' ? (
                <>
                  {!selectedEmotion ? (
                    <div className="flex flex-col gap-6">
                      <p className="text-2xl font-medium text-center text-slate-600">¿Cómo te sientes hoy?</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {EMOTIONS.map(emotion => (
                          <button
                            key={emotion.id}
                            onClick={() => { playSound('click'); setSelectedEmotion(emotion); }}
                            className={`emotion-btn ${emotion.bg} group`}
                          >
                            <emotion.icon size={48} color={emotion.color} className="group-hover:scale-125 transition-transform" />
                            <span className="mt-4 font-bold text-lg">{emotion.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8">
                      <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-2xl ${selectedEmotion.bg}`}>
                            <selectedEmotion.icon size={32} color={selectedEmotion.color} />
                          </div>
                          <span className="text-2xl font-bold">Me siento {selectedEmotion.label}</span>
                        </div>
                        <button onClick={() => setSelectedEmotion(null)} className="text-slate-400">Cambiar</button>
                      </div>

                      <div className="flex flex-col gap-4">
                        <p className="text-xl font-medium">¡Dibuja lo que sientes!</p>
                        <DrawingCanvas color={selectedEmotion.color} onSave={setDrawing} />
                      </div>

                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setIsRecording(!isRecording)}
                          className={`p-6 rounded-full shadow-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-indigo-500'}`}
                        >
                          <Mic size={32} />
                        </button>

                        <button
                          onClick={saveEntry}
                          disabled={loading}
                          className="btn-primary flex items-center gap-2"
                        >
                          {loading ? (
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 size={24} />
                              <span>Guardar en mi corazón</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-6">
                  {diaryEntries.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-400 italic">
                      Aún no tienes historias guardadas. ¡Escribe algo hoy!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {diaryEntries.map((entry) => {
                        const emotion = EMOTIONS.find(e => e.id === entry.emotionId);
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-4 flex flex-col gap-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${emotion?.bg}`}>
                                  {emotion && <emotion.icon size={24} color={emotion.color} />}
                                </div>
                                <span className="font-bold text-slate-700">Me sentí {emotion?.label}</span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            {entry.drawing && (
                              <div className="bg-white rounded-2xl p-2 border border-slate-100 aspect-video flex items-center justify-center overflow-hidden">
                                <img src={entry.drawing} alt="Mi dibujo" className="max-h-full object-contain" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full flex flex-col gap-8"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full">
                  <ChevronLeft size={32} />
                </button>
                <h2 className="text-3xl font-bold font-hand">Juegos de Calma</h2>
              </div>

              {!activeGame ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => { playSound('click'); setActiveGame('bubbles'); }}
                    className="glass-card p-8 flex flex-col items-center gap-6 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-24 h-24 bg-soft-blue rounded-full flex items-center justify-center text-blue-500 shadow-inner">
                      <Sparkles size={48} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Burbujas de Aire</h3>
                      <p className="text-slate-500">Respira profundo y suelta burbujas mágicas.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { playSound('click'); setActiveGame('secret'); }}
                    className="glass-card p-8 flex flex-col items-center gap-6 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-24 h-24 bg-soft-purple rounded-full flex items-center justify-center text-purple-600 shadow-inner">
                      <Trash2 size={48} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Caja de Secretos</h3>
                      <p className="text-slate-500">Dile adiós a los pensamientos que te ponen triste.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { playSound('click'); setActiveGame('mirror'); }}
                    className="glass-card p-8 flex flex-col items-center gap-6 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-24 h-24 bg-soft-yellow rounded-full flex items-center justify-center text-yellow-600 shadow-inner">
                      <Camera size={48} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Espejo Mágico</h3>
                      <p className="text-slate-500">¡Mírate y sonríe! Eres especial.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { playSound('click'); setActiveGame('conflict'); }}
                    className="glass-card p-8 flex flex-col items-center gap-6 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-24 h-24 bg-soft-pink rounded-full flex items-center justify-center text-pink-600 shadow-inner">
                      <Users size={48} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Simulador de Amigos</h3>
                      <p className="text-slate-500">Aprende a resolver problemas con tus amigos.</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="glass-card relative overflow-hidden min-h-[500px]">
                  <button
                    onClick={() => setActiveGame(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full z-10"
                  >
                    <X size={24} />
                  </button>
                  {activeGame === 'bubbles' && <BubbleGame onComplete={() => handleGameComplete('bubbles')} />}
                  {activeGame === 'secret' && <SecretBox onComplete={() => handleGameComplete('secret')} />}
                  {activeGame === 'mirror' && <MagicMirror emotionColor="#FFD700" onComplete={() => handleGameComplete('mirror')} />}
                  {activeGame === 'conflict' && <ConflictGame onSpeak={handleSpeak} onComplete={() => handleGameComplete('conflict')} />}
                </div>
              )}
            </motion.div>
          )}

          {view === 'tree' && (
            <motion.div
              key="tree"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <div className="w-full flex items-center gap-4">
                <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full">
                  <ChevronLeft size={32} />
                </button>
                <h2 className="text-3xl font-bold font-hand">Mi Árbol del Crecimiento</h2>
              </div>

              <div className="glass-card w-full p-8 flex flex-col items-center gap-8">
                <GrowthTree
                  level={diaryEntries.length}
                  onPlaySound={playSound}
                  onSpeak={handleSpeak}
                />

                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-900">¡Tu árbol tiene {diaryEntries.length} flores!</p>
                  <p className="text-slate-500 mt-2">Cada vez que compartes lo que sientes, tu árbol crece más fuerte.</p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'stickers' && (
            <motion.div
              key="stickers"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col gap-8"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full">
                  <ChevronLeft size={32} />
                </button>
                <h2 className="text-3xl font-bold font-hand">Mis Premios Mágicos</h2>
              </div>

              <div className="glass-card p-8 grid grid-cols-3 md:grid-cols-6 gap-4">
                {stickers.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="aspect-square bg-white rounded-2xl shadow-md flex items-center justify-center text-4xl"
                  >
                    {s}
                  </motion.div>
                ))}
                {stickers.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-400 italic">
                    ¡Aún no tienes premios! Sigue usando tu diario para ganar estrellas mágicas.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'teacher' && (
            <motion.div
              key="teacher"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ChevronLeft size={32} />
                  </button>
                  <h2 className="text-3xl font-bold text-slate-800">Panel del Maestro</h2>
                </div>
                <div className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-bold">
                  <UserCircle size={20} />
                  <span>Prof. Margareth</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold mb-6">Clima Emocional del Aula</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                          {getChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-8 flex flex-col gap-4">
                  <h3 className="text-xl font-bold mb-2">Resumen de Actividad</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="text-slate-600">Total de Registros</span>
                      <span className="text-2xl font-black text-indigo-600">{diaryEntries.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="text-slate-600">Premios Entregados</span>
                      <span className="text-2xl font-black text-yellow-600">{stickers.length}</span>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <p className="text-sm text-indigo-800 font-medium">💡 Tip Pedagógico:</p>
                      <p className="text-xs text-indigo-600 mt-1">
                        Has detectado un aumento en la emoción "Enojo". Considera realizar una actividad grupal de respiración mañana.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-indigo-950/20 backdrop-blur-3xl flex items-center justify-center p-6"
          >
            <div className="w-full max-w-4xl flex flex-col items-center gap-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 border-2 border-indigo-100"
              >
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-2xl font-black text-indigo-900 font-hand">¡Oh! Se fue el internet... ¡Pero Margareth sigue aquí!</h2>
              </motion.div>
              <MascotRun />
              <p className="text-white/60 font-bold">Volverás automáticamente cuando regrese la conexión</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <footer className="mt-12 w-full flex justify-center gap-12 opacity-30">
        <div className="w-16 h-16 bg-soft-pink rounded-full blur-xl" />
        <div className="w-24 h-24 bg-soft-blue rounded-full blur-2xl" />
        <div className="w-16 h-16 bg-soft-yellow rounded-full blur-xl" />
      </footer>
    </div>
  );
}
