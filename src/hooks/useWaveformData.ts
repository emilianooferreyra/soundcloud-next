import { useState, useEffect, useCallback, useRef } from "react";

interface UseWaveformDataResult {
  data: number[] | null;
  loading: boolean;
  error: string | null;
}

export const useWaveformData = (url: string): UseWaveformDataResult => {
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on the client side
  useEffect(() => {
    if (typeof window !== "undefined" && !audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    // Cleanup AudioContext on unmount
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const processAudio = useCallback(async (audioBuffer: AudioBuffer) => {
    const rawData = audioBuffer.getChannelData(0);
    const samples = 200;
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData: number[] = [];

    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]);
      }
      filteredData.push(sum / blockSize);
    }

    const max = Math.max(...filteredData);
    const normalizedData = filteredData.map((n) => n / max);

    setData(normalizedData);
  }, []);

  const loadData = useCallback(
    async (audioUrl: string) => {
      if (!audioUrl || !audioContextRef.current) return;

      setLoading(true);
      setError(null);
      const audioContext = audioContextRef.current;

      try {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        const audioBuffer = await new Promise<AudioBuffer>(
          (resolve, reject) => {
            audioContext.decodeAudioData(arrayBuffer, resolve, (err) =>
              reject(err)
            );
          }
        );

        await processAudio(audioBuffer);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to decode audio data";
        setError(errorMessage);
        console.error("Error processing audio:", err);
      } finally {
        setLoading(false);
      }
    },
    [processAudio]
  );

  useEffect(() => {
    if (url && audioContextRef.current) {
      loadData(url);
    }
  }, [url, loadData]);

  return { data, loading, error };
};
