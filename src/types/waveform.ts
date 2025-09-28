export interface WaveformData {
  width: number;
  height: number;
  samples: number[];
}

export interface WaveformPlayerProps {
  url: string;
  onReady?: () => void;
  onProgress?: (progress: number) => void;
  progress?: number;
  isPlaying?: boolean;
  className?: string;
  waveColor?: string;
  progressColor?: string;
}
