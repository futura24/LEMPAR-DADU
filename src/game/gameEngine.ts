import type {
  BoardConfig,
  GameState,
  PlayerConfig,
  PlayerState,
  Question,
} from '@/types/game';
import { DEFAULT_BOARD, SCORE_RULES } from './boardData';
import {
  buildPath,
  detectSpecial,
  hasQuestion,
  isWinningCell,
  nextPosition,
} from './gameRules';

/**
 * Seluruh perubahan state permainan terjadi lewat reducer murni di bawah ini.
 * Tidak ada akses DOM, timer, maupun localStorage di sini — semuanya ditangani
 * oleh `useGame`, sehingga aturan permainan dapat diuji tanpa React.
 */
export type GameAction =
  | { type: 'MULAI'; players: PlayerConfig[]; board: BoardConfig; questionsEnabled: boolean }
  | { type: 'LEMPAR_DADU' }
  | { type: 'HASIL_DADU'; value: number }
  | { type: 'LANGKAH' }
  | { type: 'TIBA'; question: Question | null }
  | { type: 'JAWAB'; chosen: number }
  | { type: 'TUTUP_PERTANYAAN' }
  | { type: 'TERAPKAN_LOMPATAN' }
  | { type: 'GILIRAN_BERIKUT' }
  | { type: 'ULANGI' }
  | { type: 'KELUAR' };

const LOG_LIMIT = 8;

export function createPlayerState(config: PlayerConfig): PlayerState {
  return {
    ...config,
    name: config.name.trim(),
    position: 1,
    score: 0,
    steps: 0,
    laddersClimbed: 0,
    snakesHit: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    visited: [1],
  };
}

export function createInitialState(board: BoardConfig = DEFAULT_BOARD): GameState {
  return {
    status: 'menunggu',
    phase: 'menunggu-lempar',
    board,
    questionsEnabled: true,
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    pendingPath: [],
    targetCell: null,
    specialEvent: null,
    questionEvent: null,
    usedQuestionIds: [],
    winnerId: null,
    log: [],
  };
}

function withLog(state: GameState, message: string): GameState {
  return { ...state, log: [message, ...state.log].slice(0, LOG_LIMIT) };
}

function updateCurrentPlayer(
  state: GameState,
  updater: (player: PlayerState) => PlayerState,
): GameState {
  return {
    ...state,
    players: state.players.map((player, index) =>
      index === state.currentPlayerIndex ? updater(player) : player,
    ),
  };
}

export function currentPlayer(state: GameState): PlayerState | undefined {
  return state.players[state.currentPlayerIndex];
}

/** Peringkat pemain: skor tertinggi dulu, lalu posisi terjauh. */
export function ranking(state: GameState): PlayerState[] {
  return [...state.players].sort((a, b) => b.score - a.score || b.position - a.position);
}

function finishGame(state: GameState, player: PlayerState): GameState {
  const winner: PlayerState = { ...player, score: player.score + SCORE_RULES.win };
  const next: GameState = {
    ...state,
    players: state.players.map((p) => (p.id === winner.id ? winner : p)),
    status: 'selesai',
    phase: 'akhir-giliran',
    winnerId: winner.id,
    specialEvent: null,
    questionEvent: null,
    pendingPath: [],
  };
  return withLog(next, `🏆 ${winner.name} mencapai kotak ${state.board.size} dan menang!`);
}

/** Menentukan apa yang terjadi setelah bidak berhenti di sebuah kotak. */
function resolveLanding(state: GameState, question: Question | null): GameState {
  const player = currentPlayer(state);
  if (!player) return state;

  if (isWinningCell(player.position, state.board)) return finishGame(state, player);

  if (state.questionsEnabled && question && hasQuestion(player.position, state.board)) {
    return {
      ...state,
      phase: 'pertanyaan',
      questionEvent: { question, chosen: null, isCorrect: null },
      usedQuestionIds: [...state.usedQuestionIds, question.id].slice(-40),
    };
  }

  const special = detectSpecial(player.position, state.board);
  if (special) return { ...state, phase: 'lompatan', specialEvent: special };

  return { ...state, phase: 'akhir-giliran' };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MULAI': {
      const base = createInitialState(action.board);
      return {
        ...base,
        status: 'bermain',
        questionsEnabled: action.questionsEnabled,
        players: action.players.map(createPlayerState),
        log: ['Permainan dimulai. Semua bidak berada di kotak 1.'],
      };
    }

    case 'LEMPAR_DADU': {
      if (state.status !== 'bermain' || state.phase !== 'menunggu-lempar') return state;
      return { ...state, phase: 'mengocok', diceValue: null, targetCell: null };
    }

    case 'HASIL_DADU': {
      const player = currentPlayer(state);
      if (!player || state.phase !== 'mengocok') return state;

      const target = nextPosition(player.position, action.value, state.board);

      if (target === player.position) {
        return withLog(
          { ...state, diceValue: action.value, phase: 'akhir-giliran' },
          `${player.name} mendapat ${action.value}. Langkah melewati kotak ${state.board.size}, jadi bidak tetap di ${player.position}.`,
        );
      }

      return withLog(
        {
          ...state,
          diceValue: action.value,
          phase: 'berjalan',
          pendingPath: buildPath(player.position, target),
          targetCell: target,
        },
        `${player.name} mendapat ${action.value} dan melangkah ke kotak ${target}.`,
      );
    }

    case 'LANGKAH': {
      if (state.pendingPath.length === 0) return state;
      const [cell, ...rest] = state.pendingPath;

      return updateCurrentPlayer({ ...state, pendingPath: rest }, (player) => {
        const isNewCell = !player.visited.includes(cell);
        return {
          ...player,
          position: cell,
          steps: player.steps + 1,
          score: player.score + (isNewCell ? SCORE_RULES.newCell : 0),
          visited: isNewCell ? [...player.visited, cell] : player.visited,
        };
      });
    }

    case 'TIBA': {
      if (state.phase !== 'berjalan' || state.pendingPath.length > 0) return state;
      return resolveLanding(state, action.question);
    }

    case 'JAWAB': {
      const event = state.questionEvent;
      if (!event || event.chosen !== null) return state;

      const isCorrect = action.chosen === event.question.answer;
      const player = currentPlayer(state);

      const next = updateCurrentPlayer(state, (p) => ({
        ...p,
        score: p.score + (isCorrect ? SCORE_RULES.correctAnswer : 0),
        correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: p.wrongAnswers + (isCorrect ? 0 : 1),
      }));

      return withLog(
        { ...next, questionEvent: { ...event, chosen: action.chosen, isCorrect } },
        isCorrect
          ? `⭐ ${player?.name ?? 'Pemain'} menjawab benar (+${SCORE_RULES.correctAnswer} poin).`
          : `${player?.name ?? 'Pemain'} belum tepat menjawab soal.`,
      );
    }

    case 'TUTUP_PERTANYAAN': {
      const player = currentPlayer(state);
      if (!player) return state;

      const cleared: GameState = { ...state, questionEvent: null };
      const special = detectSpecial(player.position, state.board);
      if (special) return { ...cleared, phase: 'lompatan', specialEvent: special };
      return { ...cleared, phase: 'akhir-giliran' };
    }

    case 'TERAPKAN_LOMPATAN': {
      const special = state.specialEvent;
      const player = currentPlayer(state);
      if (!special || !player) return state;

      const isLadder = special.type === 'ladder';
      const moved = updateCurrentPlayer(state, (p) => {
        const isNewCell = !p.visited.includes(special.to);
        return {
          ...p,
          position: special.to,
          score: p.score + (isLadder ? SCORE_RULES.ladder : SCORE_RULES.snake),
          laddersClimbed: p.laddersClimbed + (isLadder ? 1 : 0),
          snakesHit: p.snakesHit + (isLadder ? 0 : 1),
          visited: isNewCell ? [...p.visited, special.to] : p.visited,
        };
      });

      const logged = withLog(
        { ...moved, specialEvent: null, targetCell: special.to, phase: 'akhir-giliran' },
        isLadder
          ? `🪜 ${player.name} menaiki tangga ${special.from} → ${special.to} (+${SCORE_RULES.ladder} poin).`
          : `🐛 ${player.name} terkena rintangan ${special.from} → ${special.to} (${SCORE_RULES.snake} poin).`,
      );

      const updated = currentPlayer(logged);
      if (updated && isWinningCell(updated.position, state.board)) return finishGame(logged, updated);
      return logged;
    }

    case 'GILIRAN_BERIKUT': {
      if (state.status !== 'bermain') return state;
      return {
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        phase: 'menunggu-lempar',
        pendingPath: [],
        targetCell: null,
        specialEvent: null,
        questionEvent: null,
      };
    }

    case 'ULANGI': {
      const base = createInitialState(state.board);
      return {
        ...base,
        status: 'bermain',
        questionsEnabled: state.questionsEnabled,
        players: state.players.map((player) => createPlayerState(player)),
        log: ['Permainan diulang dari awal.'],
      };
    }

    case 'KELUAR':
      return createInitialState(state.board);

    default:
      return state;
  }
}
