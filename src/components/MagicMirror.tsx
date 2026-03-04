import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MagicMirrorProps {
  onComplete: (photo: string) => void;
  emotionColor: string;
}

export const MagicMirror: React.FC<MagicMirrorProps> = ({ onComplete, emotionColor }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      setError("No pudimos abrir la cámara. ¡Pide ayuda a un adulto!");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        // Add a "magic" frame
        ctx.strokeStyle = emotionColor;
        ctx.lineWidth = 20;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        const data = canvas.toDataURL('image/png');
        setPhoto(data);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h3 className="text-2xl font-bold text-indigo-900">El Espejo Mágico</h3>
      
      <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-slate-100">
        <AnimatePresence mode="wait">
          {!photo ? (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              <div className="absolute inset-0 border-[12px] border-dashed opacity-30 animate-pulse" style={{ borderColor: emotionColor }} />
            </motion.div>
          ) : (
            <motion.div key="photo" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full h-full">
              <img src={photo} alt="Selfie" className="w-full h-full object-cover scale-x-[-1]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        {!photo ? (
          <button onClick={takePhoto} className="p-6 bg-indigo-500 text-white rounded-full shadow-xl hover:bg-indigo-600 active:scale-90 transition-all">
            <Camera size={40} />
          </button>
        ) : (
          <>
            <button onClick={() => setPhoto(null)} className="p-4 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-all">
              <RefreshCw size={32} />
            </button>
            <button onClick={() => onComplete(photo)} className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all">
              <Check size={32} />
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      {error && <p className="text-red-500 font-bold">{error}</p>}
    </div>
  );
};
