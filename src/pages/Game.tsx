import { useEffect, useMemo, useState } from 'react';
import type { BoardConfig, PieceColor, PlayerConfig, Question } from '@/types/game';
import { PIECE_COLORS } from '@/game/boardData';
import { useGame } from '@/hooks/useGame';
import { Board } from '@/components/Board/Board';
import { PlayerPanel } from '@/components/PlayerPanel/PlayerPanel';
import { ScoreBoard } from '@/components/ScoreBoard/ScoreBoard';
import { GameControls } from '@/components/GameControls/GameControls';
import { QuestionModal } from '@/components/QuestionModal/QuestionModal';
import { EventModal } from '@/components/EventModal/EventModal';
import { WinnerModal } from '@/components/WinnerModal/WinnerModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/ui/Confetti';

interface GameProps {
  players: PlayerConfig[];
  board: BoardConfig;
  soundEnabled: boolean;
  questionsEnabled: boolean;
  questions: Question[];
  onToggleSound: () => void;
  onHome: () => void;
}

const COLOR_MAP: Record<string, PieceColor> = Object.fromEntries(
  PIECE_COLORS.map((color) => [color.id, color]),
);

export function Game({
  players,
  board,
  soundEnabled,
  questionsEnabled,
  questions,
  onToggleSound,
  onHome,
}: GameProps) {
  const game = useGame({ board, soundEnabled, questionsEnabled, questions });
  const [confirmRestart, setConfirmRestart] = useState(false);
  const { startGame } = game;

  useEffect(() => {
    startGame(players, board);
  }, [startGame, players, board]);

  const activeColor = useMemo(
    () => (game.activePlayer ? COLOR_MAP[game.activePlayer.colorId] : undefined),
    [game.activePlayer],
  );

  if (game.state.status === 'menunggu') {
    return (
      <p className="p-8 text-center font-body text-tinta-soft">Menyiapkan papan permainan…</p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-4">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="mx-auto w-full max-w-[min(100%,34rem)] lg:max-w-[min(100%,calc(100vh-6rem))]">
          <Board
            board={game.state.board}
            players={game.state.players}
            colors={COLOR_MAP}
            targetCell={game.state.targetCell}
            activePlayerId={game.activePlayer?.id ?? null}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <PlayerPanel
            player={game.activePlayer}
            color={activeColor}
            diceValue={game.state.diceValue}
            phase={game.state.phase}
            canRoll={game.canRoll}
            onRoll={game.rollDice}
          />
          <ScoreBoard
            standings={game.standings}
            colors={COLOR_MAP}
            activePlayerId={game.activePlayer?.id ?? null}
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <GameControls
              soundEnabled={soundEnabled}
              onToggleSound={onToggleSound}
              onRestart={() => setConfirmRestart(true)}
              onHome={onHome}
              log={game.state.log}
            />
          </div>
        </div>
      </div>

      <QuestionModal
        event={game.state.questionEvent}
        playerName={game.activePlayer?.name ?? 'Pemain'}
        onAnswer={game.answerQuestion}
        onClose={game.closeQuestion}
      />

      <EventModal event={game.state.specialEvent} />

      {game.state.status === 'selesai' && <Confetti />}
      <WinnerModal
        winner={game.winner}
        standings={game.standings}
        colors={COLOR_MAP}
        onRestart={() => {
          game.restart();
        }}
        onHome={onHome}
      />

      <Modal
        open={confirmRestart}
        title="Ulangi permainan?"
        tone="hati-hati"
        onClose={() => setConfirmRestart(false)}
        footer={
          <>
            <Button variant="lembut" onClick={() => setConfirmRestart(false)}>
              Batal
            </Button>
            <Button
              variant="bahaya"
              onClick={() => {
                setConfirmRestart(false);
                game.restart();
              }}
            >
              Ya, ulangi
            </Button>
          </>
        }
      >
        Semua posisi bidak dan skor akan kembali ke awal. Pemain dan warna bidak tetap sama.
      </Modal>
    </div>
  );
}
