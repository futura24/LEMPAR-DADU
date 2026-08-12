import { Dices, Footprints, MapPin, Star } from 'lucide-react';
import type { PieceColor, PlayerState, TurnPhase } from '@/types/game';
import { Dice } from '@/components/Dice/Dice';
import { Button } from '@/components/ui/Button';

interface PlayerPanelProps {
  player: PlayerState | undefined;
  color: PieceColor | undefined;
  diceValue: number | null;
  phase: TurnPhase;
  canRoll: boolean;
  onRoll: () => void;
}

const PHASE_TEXT: Record<TurnPhase, string> = {
  'menunggu-lempar': 'Giliranmu! Tekan tombol dadu.',
  mengocok: 'Dadu sedang dikocok…',
  berjalan: 'Bidak sedang melangkah…',
  lompatan: 'Ada sesuatu di kotak ini!',
  pertanyaan: 'Jawab pertanyaannya dulu, ya.',
  'akhir-giliran': 'Giliran berpindah…',
};

function Statistik({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border-2 border-tinta/15 bg-white/80 px-3 py-2 text-center">
      <p className="flex items-center justify-center gap-1 font-body text-xs font-semibold text-tinta-soft">
        {icon}
        {label}
      </p>
      <p className="font-display text-xl font-bold text-tinta">{value}</p>
    </div>
  );
}

export function PlayerPanel({
  player,
  color,
  diceValue,
  phase,
  canRoll,
  onRoll,
}: PlayerPanelProps) {
  if (!player) return null;

  return (
    <section
      className="rounded-blob border-4 border-tinta/70 bg-kertas p-4 shadow-kartu"
      aria-label="Panel giliran pemain"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] text-2xl"
          style={{ backgroundColor: color?.hex ?? '#EEE', borderColor: color?.dark ?? '#999' }}
        >
          {player.avatar}
        </span>
        <div className="min-w-0">
          <p className="font-body text-xs font-bold uppercase tracking-wide text-tinta-soft">Giliran</p>
          <p className="truncate font-display text-2xl font-bold leading-tight text-tinta">{player.name}</p>
        </div>
      </div>

      <p aria-live="polite" className="mt-3 font-body text-sm text-tinta-soft">
        {PHASE_TEXT[phase]}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <Dice value={diceValue} isRolling={phase === 'mengocok'} />
        <Button
          size="lg"
          onClick={onRoll}
          disabled={!canRoll}
          block
          icon={<Dices aria-hidden="true" className="h-6 w-6" />}
        >
          Lempar dadu
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Statistik icon={<MapPin aria-hidden="true" className="h-3.5 w-3.5" />} label="Posisi" value={player.position} />
        <Statistik icon={<Star aria-hidden="true" className="h-3.5 w-3.5" />} label="Skor" value={player.score} />
        <Statistik icon={<Footprints aria-hidden="true" className="h-3.5 w-3.5" />} label="Langkah" value={player.steps} />
      </div>
    </section>
  );
}
