import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, Zap, Gamepad2 } from 'lucide-react';
import { MascotCustomization } from './Mascot';

export const MascotRun: React.FC<{ customization?: MascotCustomization }> = ({
    customization = { color: '#A78BFA', accessory: 'none' }
}) => {
    const mainColor = customization.color;
    const darkColor = '#4C1D95';

    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [obstacles, setObstacles] = useState<{ id: number; x: number; type: number }[]>([]);

    const gameRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(null);
    const lastTimeRef = useRef<number>(0);
    const obstacleIdRef = useRef(0);

    // Game Constants
    const JUMP_DURATION = 600;
    const OBSTACLE_SPEED = 0.3; // pixels per ms
    const SPAWN_RATE = 2000; // ms
    const PLAYER_X = 50;
    const GROUND_Y = 300;
    const PLAYER_WIDTH = 60;
    const PLAYER_HEIGHT = 80;
    const OBSTACLE_WIDTH = 40;
    const OBSTACLE_HEIGHT = 40;

    const jump = () => {
        if (!isJumping && gameState === 'playing') {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), JUMP_DURATION);
        } else if (gameState !== 'playing') {
            startGame();
        }
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setObstacles([]);
        lastTimeRef.current = performance.now();
    };

    const update = (time: number) => {
        if (gameState !== 'playing') return;

        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        setObstacles(prev => {
            const next = prev
                .map(obs => ({ ...obs, x: obs.x - OBSTACLE_SPEED * deltaTime }))
                .filter(obs => obs.x > -100);

            // Spawn new obstacle
            if (next.length === 0 || (next[next.length - 1].x < 800 - (Math.random() * 300 + 400))) {
                next.push({
                    id: obstacleIdRef.current++,
                    x: 800,
                    type: Math.floor(Math.random() * 3)
                });
            }

            // Collision detection
            const collision = next.some(obs => {
                const obsX = obs.x;
                const obsY = GROUND_Y - OBSTACLE_HEIGHT;

                const playerY = isJumping ? GROUND_Y - 150 : GROUND_Y - PLAYER_HEIGHT;

                return (
                    PLAYER_X < obsX + OBSTACLE_WIDTH &&
                    PLAYER_X + PLAYER_WIDTH > obsX &&
                    playerY + PLAYER_HEIGHT > obsY &&
                    playerY < obsY + OBSTACLE_HEIGHT
                );
            });

            if (collision) {
                setGameState('gameover');
                if (score > highScore) setHighScore(score);
                return prev;
            }

            return next;
        });

        setScore(s => s + 1);
        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(update);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, isJumping]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState, isJumping]);

    return (
        <div
            ref={gameRef}
            className="w-full max-w-4xl h-[400px] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-indigo-100 cursor-pointer select-none"
            onClick={jump}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 bg-[#F8FAFC]" style={{
                backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            {/* Clouds */}
            <motion.div
                animate={{ x: [-100, 900] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-10 opacity-20"
            >
                <Sparkles size={100} className="text-indigo-300" />
            </motion.div>

            {/* Score */}
            <div className="absolute top-6 right-8 flex flex-col items-end z-20">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl font-hand">
                    <Zap size={24} className="text-yellow-400" />
                    {score}
                </div>
                <div className="text-slate-400 text-sm font-bold flex items-center gap-1">
                    <Trophy size={14} /> HI: {highScore}
                </div>
            </div>


            {/* Ground */}
            <div className="absolute bottom-0 w-full h-1/4 bg-slate-100 border-t-4 border-slate-200" />

            {/* Player: Margareth */}
            <motion.div
                animate={{
                    y: isJumping ? -150 : 0,
                    rotate: isJumping ? [0, -10, 10, 0] : [0, 2, -2, 0],
                    scaleY: isJumping ? 1.1 : 1
                }}
                transition={{ duration: isJumping ? 0.3 : 0.5, ease: isJumping ? "easeOut" : "easeInOut" }}
                className="absolute left-[50px] bottom-[100px] z-30"
            >
                <svg viewBox="0 0 200 200" className="w-[80px] h-[80px] drop-shadow-lg">
                    <defs>
                        <linearGradient id="gameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: mainColor, stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: mainColor, stopOpacity: 0.8 }} />
                        </linearGradient>
                    </defs>
                    <rect x="45" y="60" width="110" height="110" rx="55" fill="url(#gameGrad)" stroke={darkColor} strokeWidth="8" />

                    {/* Character Face */}
                    <circle cx="75" cy="110" r="14" fill="white" />
                    <circle cx="125" cy="110" r="14" fill="white" />
                    <circle cx="75" cy="110" r="8" fill="#1E293B" />
                    <circle cx="125" cy="110" r="8" fill="#1E293B" />
                    <circle cx="100" cy="130" r="35" fill="white" opacity="0.2" />

                    {/* Ears */}
                    <path d="M 60 40 Q 40 0 80 20 L 90 70 Z" fill={mainColor} stroke={darkColor} strokeWidth="4" />
                    <path d="M 140 40 Q 160 0 120 20 L 110 70 Z" fill={mainColor} stroke={darkColor} strokeWidth="4" />

                    {/* Accessories in Game */}
                    {customization.accessory === 'glasses' && (
                        <g stroke={darkColor} strokeWidth="4" fill="none">
                            <circle cx="75" cy="110" r="18" stroke="#1E293B" />
                            <circle cx="125" cy="110" r="18" stroke="#1E293B" />
                            <path d="M 93 110 L 107 110" stroke="#1E293B" />
                        </g>
                    )}

                    {customization.accessory === 'hat' && (
                        <g transform="translate(100, 60)">
                            <path d="M -40 0 Q 0 -60 40 0 Z" fill="#EF4444" stroke={darkColor} strokeWidth="4" />
                            <rect x="-50" y="-5" width="100" height="10" rx="5" fill="#EF4444" stroke={darkColor} strokeWidth="4" />
                        </g>
                    )}

                    {customization.accessory === 'bow' && (
                        <g transform="translate(140, 50) rotate(-20)">
                            <path d="M -15 -10 L 15 10 L 15 -10 L -15 10 Z" fill="#F472B6" stroke={darkColor} strokeWidth="4" />
                            <circle cx="0" cy="0" r="5" fill="#F472B6" stroke={darkColor} strokeWidth="4" />
                        </g>
                    )}

                    {customization.accessory === 'crown' && (
                        <g transform="translate(100, 55)">
                            <path d="M -30 0 L -40 -30 L -15 -15 L 0 -40 L 15 -15 L 40 -30 L 30 0 Z" fill="#FBBF24" stroke={darkColor} strokeWidth="4" />
                        </g>
                    )}
                </svg>
            </motion.div>

            {/* Obstacles */}
            {obstacles.map(obs => (
                <div
                    key={obs.id}
                    className="absolute bottom-[100px] z-30"
                    style={{ left: `${obs.x}px` }}
                >
                    <div className="w-[40px] h-[40px] bg-red-400 rounded-xl border-4 border-red-900 shadow-md flex items-center justify-center animate-bounce">
                        <span className="text-white font-bold text-xl">!</span>
                    </div>
                </div>
            ))}

            {/* UI States */}
            <AnimatePresence>
                {gameState === 'start' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 border-4 border-indigo-200"
                        >
                            <h2 className="text-4xl font-black text-indigo-900 font-hand">¡Aventura Offline!</h2>
                            <p className="text-slate-500 font-bold max-w-[200px] text-center">Toca la pantalla o presiona Espacio para saltar</p>
                            <button
                                onClick={startGame}
                                className="px-10 py-4 bg-indigo-600 text-white rounded-full font-black text-2xl shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-3"
                            >
                                ¡A jugar!
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {gameState === 'gameover' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-red-950/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white"
                    >
                        <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-4 border-red-200">
                            <h2 className="text-4xl font-black text-red-600 font-hand">¡Oh no!</h2>
                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 font-bold uppercase tracking-tight">Tu puntuación</span>
                                <span className="text-6xl font-black text-slate-800">{score}</span>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-10 py-4 bg-red-500 text-white rounded-full font-black text-2xl shadow-lg hover:bg-red-600 transition-colors flex items-center gap-3"
                            >
                                <RotateCcw /> Reintentar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
