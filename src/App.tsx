import { useCallback, useMemo, useState } from 'react';
import type {
  BoardConfig,
  HighScoreEntry,
  PlayerConfig,
  Question,
  Screen,
  Settings,
} from '@/types/game';
import { DEFAULT_BOARD } from '@/game/boardData';
import { validateBoard } from '@/game/gameRules';
import { sanitizeQuestions } from '@/game/questionEngine';
import { QUESTION_BANK } from '@/data/questions';
import { createDefaultPlayers, isPlayerConfigList } from '@/data/players';
import { STORAGE_KEYS, readStorage, useLocalStorage } from '@/hooks/useLocalStorage';
import { Home } from '@/pages/Home';
import { Setup } from '@/pages/Setup';
import { Game } from '@/pages/Game';
import { Editor } from '@/pages/Editor';

const DEFAULT_SETTINGS: Settings = { soundEnabled: true, questionsEnabled: true };

function isSettings(value: unknown): value is Settings {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Settings).soundEnabled === 'boolean' &&
    typeof (value as Settings).questionsEnabled === 'boolean'
  );
}

/** Konfigurasi papan tersimpan hanya dipakai bila masih lolos validasi. */
function isBoardConfig(value: unknown): value is BoardConfig {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as BoardConfig;
  if (!Array.isArray(candidate.ladders) || !Array.isArray(candidate.snakes)) return false;
  if (!Array.isArray(candidate.questionCells)) return false;
  if (typeof candidate.size !== 'number' || typeof candidate.cols !== 'number') return false;
  return validateBoard(candidate).length === 0;
}

function isQuestionList(value: unknown): value is Question[] {
  return Array.isArray(value) && sanitizeQuestions(value as Question[]).length > 0;
}

/** Latar langit dengan awan yang bergerak pelan. */
function Langit() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-langit-light via-white to-rumput-light">
      {[
        { top: '8%', size: 120, duration: 64, delay: 0 },
        { top: '22%', size: 84, duration: 92, delay: -30 },
        { top: '45%', size: 150, duration: 110, delay: -60 },
      ].map((cloud) => (
        <svg
          key={cloud.top}
          viewBox="0 0 100 44"
          className="absolute motion-safe:animate-awan motion-reduce:opacity-40"
          style={{
            top: cloud.top,
            width: cloud.size,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <g fill="#FFFFFF" opacity="0.85">
            <ellipse cx="34" cy="28" rx="30" ry="15" />
            <ellipse cx="56" cy="21" rx="22" ry="16" />
            <ellipse cx="74" cy="30" rx="20" ry="12" />
          </g>
        </svg>
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('beranda');

  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
    isSettings,
  );
  const [savedPlayers, setSavedPlayers] = useLocalStorage<PlayerConfig[]>(
    STORAGE_KEYS.players,
    createDefaultPlayers(2),
    isPlayerConfigList,
  );
  const [board, setBoard] = useLocalStorage<BoardConfig>(STORAGE_KEYS.board, DEFAULT_BOARD, isBoardConfig);
  const [questions, setQuestions] = useLocalStorage<Question[]>(
    STORAGE_KEYS.questions,
    QUESTION_BANK,
    isQuestionList,
  );

  const [activePlayers, setActivePlayers] = useState<PlayerConfig[]>(savedPlayers);

  const highScores = useMemo(
    () => readStorage<HighScoreEntry[]>(STORAGE_KEYS.highScores, []),
    // Dibaca ulang setiap kali pemain kembali ke beranda.
    [screen],
  );

  const startGame = useCallback(
    (players: PlayerConfig[]) => {
      setSavedPlayers(players);
      setActivePlayers(players);
      setScreen('permainan');
    },
    [setSavedPlayers],
  );

  const toggleSound = useCallback(
    () => setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled })),
    [setSettings],
  );

  return (
    <>
      <Langit />
      <main className="min-h-screen">
        {screen === 'beranda' && (
          <Home
            settings={settings}
            onChangeSettings={setSettings}
            highScores={Array.isArray(highScores) ? highScores : []}
            onStart={() => setScreen('setup')}
            onOpenEditor={() => setScreen('editor')}
          />
        )}

        {screen === 'setup' && (
          <Setup initialPlayers={savedPlayers} onBack={() => setScreen('beranda')} onStart={startGame} />
        )}

        {screen === 'permainan' && (
          <Game
            players={activePlayers}
            board={board}
            questions={questions}
            soundEnabled={settings.soundEnabled}
            questionsEnabled={settings.questionsEnabled}
            onToggleSound={toggleSound}
            onHome={() => setScreen('beranda')}
          />
        )}

        {screen === 'editor' && (
          <Editor
            board={board}
            questions={questions}
            onBack={() => setScreen('beranda')}
            onSave={(nextBoard, nextQuestions) => {
              setBoard(nextBoard);
              setQuestions(nextQuestions.length > 0 ? nextQuestions : QUESTION_BANK);
            }}
          />
        )}
      </main>
    </>
  );
}
