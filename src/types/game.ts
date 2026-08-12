/**
 * Seluruh tipe data permainan dikumpulkan di satu tempat agar
 * game engine, UI, dan penyimpanan lokal memakai kontrak yang sama.
 */

/** Warna bidak yang tersedia. Setiap pemain wajib memakai warna berbeda. */
export interface PieceColor {
  id: string;
  /** Nama warna dalam Bahasa Indonesia, dipakai juga untuk aria-label. */
  label: string;
  /** Warna isi bidak. */
  hex: string;
  /** Warna garis tepi/bayangan bidak. */
  dark: string;
  /** Pola non-warna (titik/garis) agar pemain tetap dapat dibedakan tanpa warna. */
  pattern: 'polos' | 'titik' | 'garis' | 'kotak';
}

/** Konfigurasi pemain yang dibuat pada halaman Pengaturan Pemain. */
export interface PlayerConfig {
  id: number;
  name: string;
  avatar: string;
  colorId: string;
}

/** Kondisi pemain selama permainan berlangsung. */
export interface PlayerState extends PlayerConfig {
  position: number;
  score: number;
  steps: number;
  laddersClimbed: number;
  snakesHit: number;
  correctAnswers: number;
  wrongAnswers: number;
  /** Nomor kotak yang pernah disinggahi, dipakai untuk poin "kotak baru". */
  visited: number[];
}

export interface Jump {
  from: number;
  to: number;
}

/** Konfigurasi papan; dapat diubah lewat Editor dan disimpan di LocalStorage. */
export interface BoardConfig {
  /** Jumlah kotak total, harus kelipatan dari cols. */
  size: number;
  /** Jumlah kolom papan. */
  cols: number;
  ladders: Jump[];
  snakes: Jump[];
  /** Kotak yang memunculkan pertanyaan saat disinggahi. */
  questionCells: number[];
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  question: string;
  options: string[];
  /** Indeks jawaban benar pada array options (0-based). */
  answer: number;
  difficulty: Difficulty;
  competency: string;
}

/** Status besar aplikasi permainan. */
export type GameStatus = 'menunggu' | 'bermain' | 'selesai';

/**
 * Fase giliran. UI memakai ini untuk menentukan tombol aktif,
 * modal yang tampil, dan animasi yang berjalan.
 */
export type TurnPhase =
  | 'menunggu-lempar'
  | 'mengocok'
  | 'berjalan'
  | 'lompatan'
  | 'pertanyaan'
  | 'akhir-giliran';

export interface SpecialEvent {
  type: 'ladder' | 'snake';
  from: number;
  to: number;
}

export interface QuestionEvent {
  question: Question;
  /** Indeks jawaban yang dipilih pemain; null berarti belum menjawab. */
  chosen: number | null;
  isCorrect: boolean | null;
}

export interface GameState {
  status: GameStatus;
  phase: TurnPhase;
  board: BoardConfig;
  questionsEnabled: boolean;
  players: PlayerState[];
  currentPlayerIndex: number;
  diceValue: number | null;
  /** Sisa kotak yang harus dilalui bidak, satu per satu. */
  pendingPath: number[];
  /** Kotak tujuan yang sedang di-highlight di papan. */
  targetCell: number | null;
  specialEvent: SpecialEvent | null;
  questionEvent: QuestionEvent | null;
  /** Id soal yang sudah terpakai agar tidak berulang terlalu cepat. */
  usedQuestionIds: number[];
  winnerId: number | null;
  /** Catatan aktivitas singkat untuk panel riwayat. */
  log: string[];
}

/** Aturan poin, dikumpulkan agar mudah disetel ulang. */
export interface ScoreRules {
  newCell: number;
  ladder: number;
  snake: number;
  correctAnswer: number;
  win: number;
}

export interface Settings {
  soundEnabled: boolean;
  questionsEnabled: boolean;
}

export interface HighScoreEntry {
  name: string;
  score: number;
  date: string;
}

export type Screen = 'beranda' | 'setup' | 'permainan' | 'editor';
