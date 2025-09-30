"use client";

import { useState, useCallback, MouseEvent } from "react";
import type { WaveformPlayerProps } from "../types/waveform";
import { Waveform } from "./Waveform";
import { AudioTimeline } from "./AudioTimeline";

export const WaveformTimeline = ({
  url,
  onReady,
  onProgress,
  progress = 0,
  className = "",
  waveColor = "#666",
  progressColor = "#ff5500",
}: WaveformPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  const handleWaveformReady = useCallback(() => {
    setIsReady(true);
    onReady?.();
  }, [onReady]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!isReady || !onProgress) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const newProgress = clickX / rect.width;

      onProgress(Math.max(0, Math.min(1, newProgress)));
    },
    [isReady, onProgress]
  );

  return (
    <div
      className={`waveform-timeline ${
        isReady ? "waveform-timeline--ready" : ""
      } ${className}`}
      onClick={handleClick}
      style={{ cursor: isReady ? "pointer" : "default" }}
    >
      <div
        className="waveform-timeline__container"
        style={{ position: "relative" }}
      >
        <Waveform
          url={url}
          onReady={handleWaveformReady}
          waveColor={waveColor}
          className="waveform-timeline__waveform"
        />

        {isReady && (
          <div
            className="waveform-timeline__overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
            }}
          >
            <AudioTimeline
              progress={progress}
              className="waveform-timeline__progress"
            />

            <div
              className="waveform-timeline__progress-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor: progressColor,
                opacity: 0.7,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
