import type { Difficulty, Question } from '@/types/game';
import { QUESTION_BANK } from '@/data/questions';

/**
 * Sumber soal dibungkus di balik satu antarmuka. Untuk berpindah ke JSON,
 * database, atau API, cukup buat objek lain yang memenuhi `QuestionSource`
 * lalu berikan ke `createQuestionEngine` — kode permainan tidak berubah.
 */
export interface QuestionSource {
  all(): Question[];
}

export const localQuestionSource: QuestionSource = {
  all: () => QUESTION_BANK,
};

/** Contoh adapter untuk file JSON statis atau endpoint API. */
export function createStaticSource(questions: Question[]): QuestionSource {
  return { all: () => questions.filter(isValidQuestion) };
}

export function isValidQuestion(question: Question): boolean {
  return (
    typeof question.question === 'string' &&
    question.question.trim().length > 0 &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    Number.isInteger(question.answer) &&
    question.answer >= 0 &&
    question.answer < question.options.length
  );
}

/** Menyaring soal rusak agar modal pertanyaan tidak pernah tampil kosong. */
export function sanitizeQuestions(questions: Question[]): Question[] {
  return questions.filter(isValidQuestion);
}

export interface QuestionEngine {
  /** Mengambil satu soal yang belum terpakai. Mengembalikan null bila bank kosong. */
  pick(usedIds: number[], difficulty?: Difficulty): Question | null;
  count(): number;
}

export function createQuestionEngine(
  source: QuestionSource = localQuestionSource,
  random: () => number = Math.random,
): QuestionEngine {
  const bank = sanitizeQuestions(source.all());

  return {
    count: () => bank.length,
    pick(usedIds, difficulty) {
      if (bank.length === 0) return null;

      const byDifficulty = difficulty ? bank.filter((q) => q.difficulty === difficulty) : bank;
      const pool = byDifficulty.length > 0 ? byDifficulty : bank;

      // Bila semua soal sudah terpakai, bank diputar ulang dari awal.
      const unused = pool.filter((q) => !usedIds.includes(q.id));
      const candidates = unused.length > 0 ? unused : pool;

      return candidates[Math.floor(random() * candidates.length)] ?? null;
    },
  };
}

export function checkAnswer(question: Question, chosen: number): boolean {
  return chosen === question.answer;
}

/** Kesulitan soal menyesuaikan posisi pemain di papan. */
export function difficultyForCell(cell: number, size: number): Difficulty {
  const ratio = cell / size;
  if (ratio < 0.34) return 'easy';
  if (ratio < 0.7) return 'medium';
  return 'hard';
}
