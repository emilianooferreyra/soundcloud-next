"use client";

import { useRef, useEffect, useCallback } from "react";
import { useWaveformData } from "@/hooks/useWaveformData";

interface WaveformProps {
  url: string;
  className?: string;
  waveColor?: string;
  onReady: () => void;
}

export const Waveform = ({
  url,
  className = "",
  waveColor = "#1d1e1f",
  onReady,
}: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data, loading, error } = useWaveformData(url);

  const renderCanvas = useCallback(
    (waveformData: number[]) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const ratio = window.devicePixelRatio || 1;
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.scale(ratio, ratio);
      context.fillStyle = waveColor;
      context.clearRect(0, 0, width, height);

      const sampleCount = waveformData.length;
      const barWidth = width / sampleCount;
      const topHeight = height * 0.7;
      const bottomHeight = height * 0.3;

      for (let i = 0; i < sampleCount; i++) {
        const amp = waveformData[i];

        const topBarHeight = amp * topHeight;
        context.fillRect(
          i * barWidth,
          topHeight - topBarHeight,
          barWidth,
          topBarHeight
        );

        const bottomBarHeight = amp * bottomHeight;
        context.fillRect(i * barWidth, topHeight, barWidth, bottomBarHeight);
      }

      onReady();
    },
    [waveColor, onReady]
  );

  useEffect(() => {
    if (data && containerRef.current) {
      renderCanvas(data);
    }
  }, [data, renderCanvas]);

  useEffect(() => {
    const handleResize = () => {
      if (data && containerRef.current) {
        renderCanvas(data);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data, renderCanvas]);

  if (error) {
    return (
      <div className={`waveform-error ${className}`}>
        <p>Error loading waveform: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`waveform-loading ${className}`}>
        <div className="animate-pulse bg-gray-300 h-full w-full rounded" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`waveform ${className}`}>
      <canvas ref={canvasRef} className="waveform-canvas" />
    </div>
  );
};
