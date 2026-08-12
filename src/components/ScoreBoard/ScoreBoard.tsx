import { Trophy } from 'lucide-react';
import type { PieceColor, PlayerState } from '@/types/game';

interface ScoreBoardProps {
  standings: PlayerState[];
  colors: Record<string, PieceColor>;
  activePlayerId: number | null;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function ScoreBoard({ standings, colors, activePlayerId }: ScoreBoardProps) {
  return (
    <section
      className="rounded-blob border-4 border-tinta/70 bg-kertas p-4 shadow-kartu"
      aria-label="Peringkat pemain"
    >
      <h2 className="flex items-center gap-2 font-display text-xl font-bold text-tinta">
        <Trophy aria-hidden="true" className="h-5 w-5 text-matahari-deep" />
        Peringkat
      </h2>

      <ol className="mt-3 space-y-2">
        {standings.map((player, index) => {
          const color = colors[player.colorId];
          const isActive = player.id === activePlayerId;
          return (
            <li
              key={player.id}
              className={[
                'flex items-center gap-3 rounded-2xl border-2 px-3 py-2',
                isActive ? 'border-matahari-deep bg-matahari-light/70' : 'border-tinta/15 bg-white/80',
              ].join(' ')}
            >
              <span aria-hidden="true" className="w-6 text-center font-display text-lg">
                {MEDALS[index] ?? index + 1}
              </span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-base"
                style={{ backgroundColor: color?.hex ?? '#EEE', borderColor: color?.dark ?? '#999' }}
              >
                {player.avatar}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display font-semibold text-tinta">
                  {player.name}
                  {isActive && <span className="ml-1 font-body text-xs text-tinta-soft">(giliran)</span>}
                </span>
                <span className="block font-body text-xs text-tinta-soft">
                  Kotak {player.position} · 🪜 {player.laddersClimbed} · 🐛 {player.snakesHit} · ⭐{' '}
                  {player.correctAnswers}
                </span>
              </span>
              <span className="font-display text-lg font-bold text-tinta">{player.score}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
