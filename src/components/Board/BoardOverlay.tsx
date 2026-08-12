import type { BoardConfig, Jump } from '@/types/game';
import { cellCenter } from '@/game/gameRules';

interface Point {
  x: number;
  y: number;
}

interface Geometry {
  a: Point;
  b: Point;
  dx: number;
  dy: number;
  nx: number;
  ny: number;
  length: number;
}

function geometry(jump: Jump, board: BoardConfig): Geometry {
  const a = cellCenter(jump.from, board);
  const b = cellCenter(jump.to, board);
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const length = Math.hypot(vx, vy) || 1;
  return { a, b, dx: vx / length, dy: vy / length, nx: -vy / length, ny: vx / length, length };
}

/** Tangga kayu: dua rel sejajar dengan anak tangga di antaranya. */
function Ladder({ jump, board, unit }: { jump: Jump; board: BoardConfig; unit: number }) {
  const { a, dx, dy, nx, ny, length } = geometry(jump, board);
  const half = unit * 0.2;
  const rungGap = unit * 0.42;
  const rungCount = Math.max(2, Math.round(length / rungGap) - 1);

  const rail = (sign: number) => ({
    x1: a.x + nx * half * sign,
    y1: a.y + ny * half * sign,
    x2: a.x + dx * length + nx * half * sign,
    y2: a.y + dy * length + ny * half * sign,
  });

  const rungs = Array.from({ length: rungCount }, (_, i) => {
    const t = ((i + 1) / (rungCount + 1)) * length;
    const cx = a.x + dx * t;
    const cy = a.y + dy * t;
    return {
      key: i,
      x1: cx + nx * half,
      y1: cy + ny * half,
      x2: cx - nx * half,
      y2: cy - ny * half,
    };
  });

  return (
    <g>
      {rungs.map((rung) => (
        <line
          key={rung.key}
          x1={rung.x1}
          y1={rung.y1}
          x2={rung.x2}
          y2={rung.y2}
          stroke="#E7B77A"
          strokeWidth={unit * 0.1}
          strokeLinecap="round"
        />
      ))}
      {[1, -1].map((sign) => {
        const r = rail(sign);
        return (
          <line
            key={sign}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="#8A4B14"
            strokeWidth={unit * 0.11}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

const WORM_COLORS = ['#FB7185', '#A78BFA', '#FB923C', '#2DD4BF', '#F472B6', '#60A5FA'];

/** Rintangan digambar sebagai cacing pelangi yang ramah, bukan ular menakutkan. */
function Worm({
  jump,
  board,
  unit,
  index,
}: {
  jump: Jump;
  board: BoardConfig;
  unit: number;
  index: number;
}) {
  const { a, b, dx, dy, nx, ny, length } = geometry(jump, board);
  const amp = Math.min(unit * 0.55, length * 0.2);
  const swing = index % 2 === 0 ? 1 : -1;

  const c1 = { x: a.x + dx * (length / 3) + nx * amp * swing, y: a.y + dy * (length / 3) + ny * amp * swing };
  const c2 = { x: a.x + dx * ((length * 2) / 3) - nx * amp * swing, y: a.y + dy * ((length * 2) / 3) - ny * amp * swing };
  const path = `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;

  const color = WORM_COLORS[index % WORM_COLORS.length];
  const headR = unit * 0.24;
  const eye = unit * 0.055;

  return (
    <g>
      <path d={path} fill="none" stroke="#2F2A25" strokeOpacity={0.18} strokeWidth={unit * 0.34} strokeLinecap="round" />
      <path d={path} fill="none" stroke={color} strokeWidth={unit * 0.28} strokeLinecap="round" />
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={unit * 0.08}
        strokeLinecap="round"
        strokeDasharray={`${unit * 0.06} ${unit * 0.24}`}
      />
      <circle cx={b.x} cy={b.y} r={unit * 0.12} fill={color} />
      <circle cx={a.x} cy={a.y} r={headR} fill={color} stroke="#2F2A25" strokeOpacity={0.25} strokeWidth={unit * 0.04} />
      <circle cx={a.x - headR * 0.35} cy={a.y - headR * 0.2} r={eye} fill="#2F2A25" />
      <circle cx={a.x + headR * 0.35} cy={a.y - headR * 0.2} r={eye} fill="#2F2A25" />
      <path
        d={`M ${a.x - headR * 0.34} ${a.y + headR * 0.28} q ${headR * 0.34} ${headR * 0.34} ${headR * 0.68} 0`}
        fill="none"
        stroke="#2F2A25"
        strokeWidth={unit * 0.04}
        strokeLinecap="round"
      />
    </g>
  );
}

export function BoardOverlay({ board }: { board: BoardConfig }) {
  // Satu "unit" = lebar satu kotak dalam koordinat viewBox 0–100.
  const unit = 100 / board.cols;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {board.ladders.map((jump) => (
        <Ladder key={`tangga-${jump.from}`} jump={jump} board={board} unit={unit} />
      ))}
      {board.snakes.map((jump, index) => (
        <Worm key={`cacing-${jump.from}`} jump={jump} board={board} unit={unit} index={index} />
      ))}
    </svg>
  );
}
