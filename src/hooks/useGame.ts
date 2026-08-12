import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { BoardConfig, HighScoreEntry, PlayerConfig, Question } from '@/types/game';
import { createInitialState, currentPlayer, gameReducer, ranking } from '@/game/gameEngine';
import { hasQuestion, rollDice } from '@/game/gameRules';
import { createQuestionEngine, createStaticSource, difficultyForCell } from '@/game/questionEngine';
import { STORAGE_KEYS, readStorage, writeStorage } from './useLocalStorage';
import { useSound } from './useSound';

/** Semua durasi animasi dikumpulkan di sini agar mudah disetel. */
export const TIMING = {
  roll: 900,
  step: 200,
  landing: 180,
  special: 1500,
  endTurn: 900,
} as const;

interface UseGameOptions {
  board: BoardConfig;
  soundEnabled: boolean;
  questionsEnabled: boolean;
  /** Bank soal khusus (mis. hasil suntingan di Editor). Kosongkan untuk memakai bank bawaan. */
  questions?: Question[];
}

export function useGame({ board, soundEnabled, questionsEnabled, questions }: UseGameOptions) {
  const [state, dispatch] = useReducer(gameReducer, board, createInitialState);
  const playSound = useSound(soundEnabled);
  const questionEngine = useMemo(
    () => createQuestionEngine(questions && questions.length > 0 ? createStaticSource(questions) : undefined),
    [questions],
  );
  const lastCueRef = useRef<string>('');

  /** Mencegah satu isyarat suara berbunyi dua kali (mis. efek ganda saat pengembangan). */
  const playOnce = useCallback(
    (key: string, sound: Parameters<typeof playSound>[0]) => {
      if (lastCueRef.current === key) return;
      lastCueRef.current = key;
      playSound(sound);
    },
    [playSound],
  );

  /* -------------------------------------------------------------- */
  /* Aksi dari UI                                                    */
  /* -------------------------------------------------------------- */

  const startGame = useCallback(
    (players: PlayerConfig[], nextBoard: BoardConfig) => {
      dispatch({ type: 'MULAI', players, board: nextBoard, questionsEnabled });
    },
    [questionsEnabled],
  );

  const rollDiceAction = useCallback(() => {
    if (state.phase !== 'menunggu-lempar' || state.status !== 'bermain') return;
    playSound('dadu');
    dispatch({ type: 'LEMPAR_DADU' });
  }, [playSound, state.phase, state.status]);

  const answerQuestion = useCallback(
    (chosen: number) => {
      const event = state.questionEvent;
      if (!event || event.chosen !== null) return;
      playSound(chosen === event.question.answer ? 'benar' : 'salah');
      dispatch({ type: 'JAWAB', chosen });
    },
    [playSound, state.questionEvent],
  );

  const closeQuestion = useCallback(() => dispatch({ type: 'TUTUP_PERTANYAAN' }), []);
  const restart = useCallback(() => dispatch({ type: 'ULANGI' }), []);
  const quit = useCallback(() => dispatch({ type: 'KELUAR' }), []);

  /* -------------------------------------------------------------- */
  /* Alur otomatis: kocok → jalan → tiba → efek → giliran berikutnya  */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    if (state.phase !== 'mengocok') return;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'HASIL_DADU', value: rollDice() });
    }, TIMING.roll);
    return () => window.clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== 'berjalan' || state.pendingPath.length === 0) return;
    const timer = window.setTimeout(() => {
      playSound('langkah');
      dispatch({ type: 'LANGKAH' });
    }, TIMING.step);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.pendingPath, playSound]);

  useEffect(() => {
    if (state.phase !== 'berjalan' || state.pendingPath.length > 0) return;
    const player = currentPlayer(state);
    if (!player) return;

    const needsQuestion = state.questionsEnabled && hasQuestion(player.position, state.board);
    const question = needsQuestion
      ? questionEngine.pick(state.usedQuestionIds, difficultyForCell(player.position, state.board.size))
      : null;

    const timer = window.setTimeout(() => dispatch({ type: 'TIBA', question }), TIMING.landing);
    return () => window.clearTimeout(timer);
  }, [state, questionEngine]);

  useEffect(() => {
    if (state.phase !== 'lompatan' || !state.specialEvent) return;
    const { type, from, to } = state.specialEvent;
    playOnce(`${type}-${from}-${to}`, type === 'ladder' ? 'tangga' : 'rintangan');
    const timer = window.setTimeout(() => dispatch({ type: 'TERAPKAN_LOMPATAN' }), TIMING.special);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.specialEvent, playOnce]);

  useEffect(() => {
    if (state.phase !== 'akhir-giliran' || state.status !== 'bermain') return;
    const timer = window.setTimeout(() => {
      // Isyarat suara direset agar kejadian serupa berikutnya tetap berbunyi.
      lastCueRef.current = '';
      dispatch({ type: 'GILIRAN_BERIKUT' });
    }, TIMING.endTurn);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.status]);

  /* -------------------------------------------------------------- */
  /* Kemenangan: suara + simpan skor tertinggi                        */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    if (state.status !== 'selesai' || state.winnerId === null) return;
    const winner = state.players.find((player) => player.id === state.winnerId);
    if (!winner) return;

    playOnce(`menang-${winner.id}-${winner.score}`, 'menang');

    const entry: HighScoreEntry = {
      name: winner.name,
      score: winner.score,
      date: new Date().toISOString(),
    };
    const stored = readStorage<HighScoreEntry[]>(STORAGE_KEYS.highScores, []);
    const list = Array.isArray(stored) ? stored : [];
    writeStorage(
      STORAGE_KEYS.highScores,
      [...list, entry].sort((a, b) => b.score - a.score).slice(0, 5),
    );
  }, [state.status, state.winnerId, state.players, playOnce]);

  const active = currentPlayer(state);
  const winner = state.players.find((player) => player.id === state.winnerId) ?? null;

  return {
    state,
    activePlayer: active,
    winner,
    standings: ranking(state),
    canRoll: state.status === 'bermain' && state.phase === 'menunggu-lempar',
    startGame,
    rollDice: rollDiceAction,
    answerQuestion,
    closeQuestion,
    restart,
    quit,
    playSound,
  };
}
