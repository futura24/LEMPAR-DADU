import { useEffect, useState } from 'react';

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [30, 30],
    [70, 70],
  ],
  3: [
    [30, 30],
    [50, 50],
    [70, 70],
  ],
  4: [
    [30, 30],
    [70, 30],
    [30, 70],
    [70, 70],
  ],
  5: [
    [30, 30],
    [70, 30],
    [50, 50],
    [30, 70],
    [70, 70],
  ],
  6: [
    [30, 27],
    [70, 27],
    [30, 50],
    [70, 50],
    [30, 73],
    [70, 73],
  ],
};

interface DiceProps {
  value: number | null;
  isRolling: boolean;
}

export function Dice({ value, isRolling }: DiceProps) {
  const [face, setFace] = useState(value ?? 1);

  useEffect(() => {
    if (!isRolling) {
      if (value) setFace(value);
      return;
    }
    const timer = window.setInterval(() => setFace(1 + Math.floor(Math.random() * 6)), 90);
    return () => window.clearInterval(timer);
  }, [isRolling, value]);

  return (
    <div
      className={[
        'h-20 w-20 shrink-0 sm:h-24 sm:w-24',
        isRolling ? 'motion-safe:animate-dadu-guling' : '',
      ].join(' ')}
      role="img"
      aria-live="polite"
      aria-label={isRolling ? 'Dadu sedang dikocok' : `Mata dadu ${face}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_0_rgba(47,42,37,0.25)]">
        <rect x="4" y="4" width="92" height="92" rx="22" fill="#FFFBF2" stroke="#2F2A25" strokeWidth="5" />
        {PIPS[face].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8.5" fill="#2F2A25" />
        ))}
      </svg>
    </div>
  );
}
