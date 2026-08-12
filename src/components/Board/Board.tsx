import { useMemo } from 'react';
import type { BoardConfig, PieceColor, PlayerState } from '@/types/game';
import { boardCellsInRenderOrder, cellToCoord, rowCount } from '@/game/gameRules';
import { Cell, type CellKind } from '@/components/Cell/Cell';
import { PlayerPiece } from '@/components/PlayerPiece/PlayerPiece';
import { BoardOverlay } from './BoardOverlay';

interface BoardProps {
  board: BoardConfig;
  players: PlayerState[];
  colors: Record<string, PieceColor>;
  targetCell: number | null;
  activePlayerId: number | null;
}

function kindOf(cell: number, board: BoardConfig): CellKind {
  if (cell === board.size) return 'finish';
  if (cell === 1) return 'start';
  if (board.ladders.some((jump) => jump.from === cell)) return 'tangga';
  if (board.snakes.some((jump) => jump.from === cell)) return 'rintangan';
  if (board.questionCells.includes(cell)) return 'soal';
  return 'biasa';
}

export function Board({ board, players, colors, targetCell, activePlayerId }: BoardProps) {
  const cells = useMemo(() => boardCellsInRenderOrder(board), [board]);
  const rows = rowCount(board);

  /** Bidak dikelompokkan per kotak agar dapat digeser saat menumpuk. */
  const slots = useMemo(() => {
    const map = new Map<number, number[]>();
    players.forEach((player) => {
      const list = map.get(player.position) ?? [];
      list.push(player.id);
      map.set(player.position, list);
    });
    return map;
  }, [players]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-blob border-4 border-tinta/70 bg-white shadow-kartu"
      style={{ aspectRatio: `${board.cols} / ${rows}` }}
      role="grid"
      aria-label={`Papan permainan ${board.cols} kali ${rows}, ${board.size} kotak`}
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell) => {
          const { row } = cellToCoord(cell, board);
          return (
            <Cell
              key={cell}
              number={cell}
              kind={kindOf(cell, board)}
              isTarget={targetCell === cell}
              striped={row % 2 === 0}
            />
          );
        })}
      </div>

      <BoardOverlay board={board} />

      {players.map((player) => {
        const color = colors[player.colorId];
        if (!color) return null;
        const slot = slots.get(player.position)?.indexOf(player.id) ?? 0;
        return (
          <PlayerPiece
            key={player.id}
            player={player}
            color={color}
            board={board}
            slot={slot}
            isActive={player.id === activePlayerId}
          />
        );
      })}
    </div>
  );
}
