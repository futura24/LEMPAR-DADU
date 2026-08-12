import type { BoardConfig, PieceColor, PlayerState } from '@/types/game';
import { cellCenter } from '@/game/gameRules';

interface PlayerPieceProps {
  player: PlayerState;
  color: PieceColor;
  board: BoardConfig;
  /** Urutan bidak pada kotak yang sama, agar tidak saling menutupi. */
  slot: number;
  isActive: boolean;
}

/** Geseran bidak (dalam pecahan lebar kotak) saat beberapa bidak berada di kotak yang sama. */
const OFFSETS = [
  [-0.2, -0.18],
  [0.2, -0.18],
  [-0.2, 0.2],
  [0.2, 0.2],
];

const PATTERNS: Record<PieceColor['pattern'], string> = {
  polos: '',
  titik: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85) 18%, transparent 19%), radial-gradient(circle at 70% 62%, rgba(255,255,255,0.85) 14%, transparent 15%)',
  garis:
    'repeating-linear-gradient(135deg, rgba(255,255,255,0.75) 0 3px, transparent 3px 8px)',
  kotak:
    'repeating-conic-gradient(rgba(255,255,255,0.7) 0% 25%, transparent 0% 50%) 0 0 / 46% 46%',
};

export function PlayerPiece({ player, color, board, slot, isActive }: PlayerPieceProps) {
  const center = cellCenter(player.position, board);
  const cellWidth = 100 / board.cols;
  const [dx, dy] = OFFSETS[slot % OFFSETS.length];

  const size = cellWidth * 0.58;

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[260ms] ease-out motion-reduce:transition-none"
      style={{
        left: `${center.x + dx * cellWidth}%`,
        top: `${center.y + dy * cellWidth}%`,
        width: `${size}%`,
      }}
    >
      <div
        className={[
          'relative aspect-square rounded-full border-[3px] shadow-pop-sm',
          'flex items-center justify-center',
          isActive ? 'ring-4 ring-matahari motion-safe:animate-mengambang' : '',
        ].join(' ')}
        style={{
          backgroundColor: color.hex,
          borderColor: color.dark,
          backgroundImage: PATTERNS[color.pattern] || undefined,
        }}
        role="img"
        aria-label={`Bidak ${player.name}, warna ${color.label}, motif ${color.pattern}, berada di kotak ${player.position}`}
        title={`${player.name} — kotak ${player.position}`}
      >
        <span
          aria-hidden="true"
          className="select-none leading-none"
          style={{ fontSize: 'clamp(0.6rem, 2.1vw, 1.15rem)' }}
        >
          {player.avatar}
        </span>
      </div>
    </div>
  );
}
