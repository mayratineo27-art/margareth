import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Undo, Download } from 'lucide-react';

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  color: string;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineWidth = 8;
        context.strokeStyle = color;
        setCtx(context);
      }
      
      // Handle resize
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (context) {
          context.lineCap = 'round';
          context.lineWidth = 8;
        }
      };
      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }
  }, [color]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    ctx?.beginPath();
    ctx?.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    ctx?.closePath();
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      const rect = canvasRef.current?.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - (rect?.left || 0),
        offsetY: e.touches[0].clientY - (rect?.top || 0),
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const clear = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onSave("");
    }
  };

  return (
    <div className="relative w-full aspect-video bg-white rounded-3xl border-4 border-dashed border-indigo-200 overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className="w-full h-full cursor-crosshair"
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button onClick={clear} className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors">
          <Eraser size={24} />
        </button>
      </div>
    </div>
  );
};
