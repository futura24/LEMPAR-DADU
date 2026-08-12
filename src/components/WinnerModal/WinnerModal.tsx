import type { PieceColor, PlayerState } from '@/types/game';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface WinnerModalProps {
  winner: PlayerState | null;
  standings: PlayerState[];
  colors: Record<string, PieceColor>;
  onRestart: () => void;
  onHome: () => void;
}

export function WinnerModal({ winner, standings, colors, onRestart, onHome }: WinnerModalProps) {
  if (!winner) return null;

  return (
    <Modal
      open
      hideClose
      tone="juara"
      title={`${winner.name} juara! 🏆`}
      footer={
        <>
          <Button variant="lembut" onClick={onHome}>
            Kembali ke beranda
          </Button>
          <Button onClick={onRestart}>Main lagi</Button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 text-3xl"
          style={{
            backgroundColor: colors[winner.colorId]?.hex ?? '#EEE',
            borderColor: colors[winner.colorId]?.dark ?? '#999',
          }}
        >
          {winner.avatar}
        </span>
        <div>
          <p className="font-display text-3xl font-bold text-tinta">{winner.score} poin</p>
          <p className="font-body text-tinta-soft">
            {winner.steps} langkah · {winner.laddersClimbed} tangga · {winner.snakesHit} rintangan ·{' '}
            {winner.correctAnswers} jawaban benar
          </p>
        </div>
      </div>

      {standings.length > 1 && (
        <>
          <h3 className="mt-6 font-display text-lg font-bold text-tinta">Hasil akhir</h3>
          <ol className="mt-2 space-y-1">
            {standings.map((player, index) => (
              <li
                key={player.id}
                className="flex items-center justify-between rounded-xl border-2 border-tinta/15 bg-white/70 px-3 py-2 font-body"
              >
                <span>
                  {index + 1}. {player.avatar} {player.name}
                </span>
                <span className="font-display font-bold">{player.score} poin</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Modal>
  );
}
