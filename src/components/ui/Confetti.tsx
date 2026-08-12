import { useMemo } from 'react';

const WARNA = ['#FBBF24', '#4ADE80', '#38BDF8', '#FB7185', '#A78BFA', '#FB923C'];

/** Hujan konfeti sederhana berbasis CSS; otomatis nonaktif pada prefers-reduced-motion. */
export function Confetti({ pieces = 42 }: { pieces?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        duration: 2.6 + Math.random() * 1.8,
        size: 8 + Math.random() * 8,
        color: WARNA[i % WARNA.length],
        bulat: i % 3 === 0,
      })),
    [pieces],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute top-0 block animate-[konfeti_linear_forwards]"
          style={{
            left: `${item.left}%`,
            width: item.size,
            height: item.size * (item.bulat ? 1 : 0.5),
            backgroundColor: item.color,
            borderRadius: item.bulat ? '9999px' : '2px',
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
