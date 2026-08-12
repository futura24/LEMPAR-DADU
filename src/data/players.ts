import type { PlayerConfig } from '@/types/game';
import { AVATARS, DEFAULT_NAMES, PIECE_COLORS } from '@/game/boardData';

export function createDefaultPlayer(index: number): PlayerConfig {
  return {
    id: index + 1,
    name: DEFAULT_NAMES[index] ?? `Pemain ${index + 1}`,
    avatar: AVATARS[index % AVATARS.length],
    colorId: PIECE_COLORS[index % PIECE_COLORS.length].id,
  };
}

export function createDefaultPlayers(count: number): PlayerConfig[] {
  return Array.from({ length: count }, (_, index) => createDefaultPlayer(index));
}

/** Memvalidasi bentuk data pemain yang dibaca dari LocalStorage. */
export function isPlayerConfigList(value: unknown): value is PlayerConfig[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as PlayerConfig).name === 'string' &&
        typeof (item as PlayerConfig).avatar === 'string' &&
        typeof (item as PlayerConfig).colorId === 'string',
    )
  );
}
