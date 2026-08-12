import type { BoardConfig, PieceColor, ScoreRules } from '@/types/game';

/**
 * Konfigurasi papan bawaan. Ubah nilai di sini (atau lewat halaman Editor)
 * tanpa perlu menyentuh satu baris pun kode komponen.
 */
export const DEFAULT_BOARD: BoardConfig = {
  size: 100,
  cols: 10,
  ladders: [
    { from: 3, to: 22 },
    { from: 8, to: 30 },
    { from: 15, to: 44 },
    { from: 28, to: 57 },
    { from: 36, to: 66 },
    { from: 51, to: 72 },
    { from: 71, to: 92 },
  ],
  snakes: [
    { from: 17, to: 5 },
    { from: 34, to: 12 },
    { from: 47, to: 26 },
    { from: 62, to: 19 },
    { from: 88, to: 49 },
    { from: 97, to: 78 },
  ],
  questionCells: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
};

export const SCORE_RULES: ScoreRules = {
  newCell: 1,
  ladder: 10,
  snake: -5,
  correctAnswer: 5,
  win: 50,
};

/** Ukuran papan yang boleh dipilih di Editor (selalu bujur sangkar). */
export const BOARD_PRESETS = [
  { label: '6 × 6 — 36 kotak', size: 36, cols: 6 },
  { label: '8 × 8 — 64 kotak', size: 64, cols: 8 },
  { label: '10 × 10 — 100 kotak', size: 100, cols: 10 },
] as const;

export const PIECE_COLORS: PieceColor[] = [
  { id: 'merah', label: 'Merah', hex: '#FB7185', dark: '#BE123C', pattern: 'polos' },
  { id: 'biru', label: 'Biru', hex: '#38BDF8', dark: '#0369A1', pattern: 'titik' },
  { id: 'hijau', label: 'Hijau', hex: '#4ADE80', dark: '#15803D', pattern: 'garis' },
  { id: 'ungu', label: 'Ungu', hex: '#A78BFA', dark: '#6D28D9', pattern: 'kotak' },
  { id: 'jingga', label: 'Jingga', hex: '#FB923C', dark: '#C2410C', pattern: 'titik' },
  { id: 'toska', label: 'Toska', hex: '#2DD4BF', dark: '#0F766E', pattern: 'garis' },
];

export const AVATARS = ['🧒', '👧', '🐱', '🐰', '🦊', '🐼', '🐨', '🦁'];

export const DEFAULT_NAMES = ['Budi', 'Siti', 'Andi', 'Rina'];

export const MAX_PLAYERS = 4;
export const DICE_MIN = 1;
export const DICE_MAX = 6;
