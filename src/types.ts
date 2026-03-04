import { Heart, Smile, Frown, Zap, Ghost, CloudRain } from 'lucide-react';

export interface Emotion {
  id: string;
  label: string;
  icon: any;
  color: string;
  bg: string;
}

export const EMOTIONS: Emotion[] = [
  { id: 'happy', label: 'Feliz', icon: Smile, color: '#FFD700', bg: 'bg-soft-yellow' },
  { id: 'sad', label: 'Triste', icon: CloudRain, color: '#4682B4', bg: 'bg-soft-blue' },
  { id: 'angry', label: 'Enojado', icon: Zap, color: '#FF4500', bg: 'bg-warm-orange' },
  { id: 'scared', label: 'Asustado', icon: Ghost, color: '#9370DB', bg: 'bg-soft-purple' },
  { id: 'calm', label: 'Tranquilo', icon: Heart, color: '#98FB98', bg: 'bg-soft-green' },
];

export interface DiaryEntry {
  id: string;
  emotionId: string;
  drawing?: string;
  audioUrl?: string;
  timestamp: number;
}
