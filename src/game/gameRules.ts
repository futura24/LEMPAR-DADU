import type { BoardConfig, Jump, PlayerConfig, SpecialEvent } from '@/types/game';
import { DICE_MAX, DICE_MIN, MAX_PLAYERS } from './boardData';

/* ------------------------------------------------------------------ */
/* Geometri papan                                                      */
/* ------------------------------------------------------------------ */

export function rowCount(board: BoardConfig): number {
  return Math.ceil(board.size / board.cols);
}

/**
 * Mengubah nomor kotak menjadi koordinat baris/kolom pada grid.
 * Kotak 1 berada di kiri bawah, lalu berkelok (boustrophedon) ke atas —
 * pola papan ular tangga tradisional.
 */
export function cellToCoord(cell: number, board: BoardConfig): { row: number; col: number } {
  const index = cell - 1;
  const rowFromBottom = Math.floor(index / board.cols);
  const offset = index % board.cols;
  const col = rowFromBottom % 2 === 0 ? offset : board.cols - 1 - offset;
  const row = rowCount(board) - 1 - rowFromBottom;
  return { row, col };
}

/** Titik tengah kotak dalam persen (0–100) terhadap sisi papan. */
export function cellCenter(cell: number, board: BoardConfig): { x: number; y: number } {
  const { row, col } = cellToCoord(cell, board);
  const rows = rowCount(board);
  return {
    x: ((col + 0.5) / board.cols) * 100,
    y: ((row + 0.5) / rows) * 100,
  };
}

/** Daftar nomor kotak berurutan sesuai urutan render grid (kiri-atas ke kanan-bawah). */
export function boardCellsInRenderOrder(board: BoardConfig): number[] {
  const rows = rowCount(board);
  const cells: number[] = [];
  for (let row = 0; row < rows; row += 1) {
    const rowFromBottom = rows - 1 - row;
    const base = rowFromBottom * board.cols;
    const line: number[] = [];
    for (let i = 0; i < board.cols; i += 1) {
      const cell = base + i + 1;
      if (cell <= board.size) line.push(cell);
    }
    cells.push(...(rowFromBottom % 2 === 0 ? line : [...line].reverse()));
  }
  return cells;
}

/* ------------------------------------------------------------------ */
/* Dadu & pergerakan                                                   */
/* ------------------------------------------------------------------ */

export function rollDice(random: () => number = Math.random): number {
  return DICE_MIN + Math.floor(random() * (DICE_MAX - DICE_MIN + 1));
}

/**
 * Aturan menang: langkah yang melewati kotak terakhir dibatalkan.
 * Contoh: posisi 97 + dadu 4 = 101 → pemain tetap di 97.
 */
export function nextPosition(position: number, dice: number, board: BoardConfig): number {
  const target = position + dice;
  return target > board.size ? position : target;
}

/** Jalur kotak yang dilewati bidak, satu per satu, untuk animasi. */
export function buildPath(from: number, to: number): number[] {
  const path: number[] = [];
  for (let cell = from + 1; cell <= to; cell += 1) path.push(cell);
  return path;
}

export function findJump(cell: number, jumps: Jump[]): Jump | undefined {
  return jumps.find((jump) => jump.from === cell);
}

/** Mengembalikan efek tangga/ular pada kotak tertentu, jika ada. */
export function detectSpecial(cell: number, board: BoardConfig): SpecialEvent | null {
  const ladder = findJump(cell, board.ladders);
  if (ladder) return { type: 'ladder', from: ladder.from, to: ladder.to };
  const snake = findJump(cell, board.snakes);
  if (snake) return { type: 'snake', from: snake.from, to: snake.to };
  return null;
}

export function hasQuestion(cell: number, board: BoardConfig): boolean {
  return board.questionCells.includes(cell);
}

export function isWinningCell(cell: number, board: BoardConfig): boolean {
  return cell === board.size;
}

/* ------------------------------------------------------------------ */
/* Validasi                                                            */
/* ------------------------------------------------------------------ */

/** Memeriksa konfigurasi papan. Mengembalikan daftar pesan kesalahan. */
export function validateBoard(board: BoardConfig): string[] {
  const errors: string[] = [];

  if (board.cols < 4) errors.push('Jumlah kolom papan minimal 4.');
  if (board.size < board.cols * 4) errors.push('Papan terlalu kecil untuk dimainkan.');
  if (board.size % board.cols !== 0) errors.push('Jumlah kotak harus kelipatan jumlah kolom.');

  const inRange = (n: number) => Number.isInteger(n) && n >= 1 && n <= board.size;
  const starts = new Map<number, string>();

  const check = (jump: Jump, kind: 'Tangga' | 'Rintangan') => {
    const nama = `${kind} ${jump.from} → ${jump.to}`;
    if (!inRange(jump.from) || !inRange(jump.to)) {
      errors.push(`${nama}: posisi harus antara 1 dan ${board.size}.`);
      return;
    }
    if (jump.from === jump.to) {
      errors.push(`${nama}: kotak awal dan tujuan tidak boleh sama.`);
      return;
    }
    if (kind === 'Tangga' && jump.to < jump.from)
      errors.push(`${nama}: tangga harus menuju kotak yang lebih tinggi.`);
    if (kind === 'Rintangan' && jump.to > jump.from)
      errors.push(`${nama}: rintangan harus menuju kotak yang lebih rendah.`);
    if (jump.from === 1) errors.push(`${nama}: kotak 1 adalah garis start, tidak boleh dipakai.`);
    if (jump.from === board.size)
      errors.push(`${nama}: kotak ${board.size} adalah FINISH, tidak boleh dipakai.`);

    const existing = starts.get(jump.from);
    if (existing) errors.push(`Kotak ${jump.from} dipakai dua kali (${existing} dan ${nama}).`);
    else starts.set(jump.from, nama);
  };

  board.ladders.forEach((jump) => check(jump, 'Tangga'));
  board.snakes.forEach((jump) => check(jump, 'Rintangan'));

  board.questionCells.forEach((cell) => {
    if (!inRange(cell)) errors.push(`Kotak soal ${cell} berada di luar papan.`);
  });

  return errors;
}

/** Memeriksa konfigurasi pemain sebelum permainan dimulai. */
export function validatePlayers(players: PlayerConfig[]): string[] {
  const errors: string[] = [];

  if (players.length < 1) errors.push('Permainan membutuhkan minimal 1 pemain.');
  if (players.length > MAX_PLAYERS) errors.push(`Jumlah pemain maksimal ${MAX_PLAYERS}.`);

  players.forEach((player, index) => {
    if (!player.name.trim()) errors.push(`Nama pemain ${index + 1} masih kosong.`);
    if (player.name.trim().length > 12)
      errors.push(`Nama "${player.name}" terlalu panjang (maksimal 12 huruf).`);
  });

  const colors = players.map((p) => p.colorId);
  if (new Set(colors).size !== colors.length) errors.push('Setiap pemain harus memakai warna bidak yang berbeda.');

  const names = players.map((p) => p.name.trim().toLowerCase()).filter(Boolean);
  if (new Set(names).size !== names.length) errors.push('Nama pemain tidak boleh sama.');

  return errors;
}
