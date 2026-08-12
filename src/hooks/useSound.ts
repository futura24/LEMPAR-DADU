import { useCallback, useEffect, useRef } from 'react';

export type SoundName =
  | 'dadu'
  | 'langkah'
  | 'tangga'
  | 'rintangan'
  | 'benar'
  | 'salah'
  | 'menang'
  | 'klik';

type Note = { freq: number; start: number; dur: number; type?: OscillatorType; gain?: number };

/**
 * Suara dibangkitkan langsung oleh Web Audio API sehingga aplikasi tidak
 * memerlukan berkas audio apa pun. AudioContext baru dibuat setelah pemain
 * menyentuh layar, jadi tidak ada suara yang berbunyi otomatis saat halaman dibuka.
 */
const SOUNDS: Record<SoundName, Note[]> = {
  klik: [{ freq: 660, start: 0, dur: 0.07, type: 'triangle', gain: 0.18 }],
  dadu: [
    { freq: 220, start: 0, dur: 0.05, type: 'square', gain: 0.12 },
    { freq: 300, start: 0.09, dur: 0.05, type: 'square', gain: 0.12 },
    { freq: 260, start: 0.18, dur: 0.05, type: 'square', gain: 0.12 },
    { freq: 340, start: 0.27, dur: 0.06, type: 'square', gain: 0.12 },
  ],
  langkah: [{ freq: 520, start: 0, dur: 0.06, type: 'sine', gain: 0.14 }],
  tangga: [
    { freq: 523, start: 0, dur: 0.1 },
    { freq: 659, start: 0.1, dur: 0.1 },
    { freq: 784, start: 0.2, dur: 0.1 },
    { freq: 1047, start: 0.3, dur: 0.18 },
  ],
  rintangan: [
    { freq: 440, start: 0, dur: 0.12, type: 'sawtooth', gain: 0.12 },
    { freq: 330, start: 0.12, dur: 0.12, type: 'sawtooth', gain: 0.12 },
    { freq: 220, start: 0.24, dur: 0.2, type: 'sawtooth', gain: 0.12 },
  ],
  benar: [
    { freq: 784, start: 0, dur: 0.1 },
    { freq: 1047, start: 0.11, dur: 0.2 },
  ],
  salah: [
    { freq: 300, start: 0, dur: 0.14, type: 'triangle', gain: 0.14 },
    { freq: 240, start: 0.15, dur: 0.2, type: 'triangle', gain: 0.14 },
  ],
  menang: [
    { freq: 523, start: 0, dur: 0.12 },
    { freq: 659, start: 0.13, dur: 0.12 },
    { freq: 784, start: 0.26, dur: 0.12 },
    { freq: 1047, start: 0.39, dur: 0.16 },
    { freq: 1319, start: 0.56, dur: 0.3 },
  ],
};

type AudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & { webkitAudioContext?: AudioContextCtor };
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

export function useSound(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      void contextRef.current?.close().catch(() => undefined);
      contextRef.current = null;
    };
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      const Ctor = getAudioContextCtor();
      if (!Ctor) return;

      try {
        if (!contextRef.current) contextRef.current = new Ctor();
        const ctx = contextRef.current;
        if (ctx.state === 'suspended') void ctx.resume();

        const now = ctx.currentTime;
        SOUNDS[name].forEach((note) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = note.type ?? 'sine';
          osc.frequency.setValueAtTime(note.freq, now + note.start);

          const peak = note.gain ?? 0.16;
          gain.gain.setValueAtTime(0.0001, now + note.start);
          gain.gain.exponentialRampToValueAtTime(peak, now + note.start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.dur);

          osc.connect(gain).connect(ctx.destination);
          osc.start(now + note.start);
          osc.stop(now + note.start + note.dur + 0.02);
        });
      } catch (error) {
        console.warn('Efek suara tidak dapat diputar di perangkat ini.', error);
      }
    },
    [enabled],
  );

  return play;
}
