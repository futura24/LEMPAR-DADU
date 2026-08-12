import { Check, X } from 'lucide-react';
import type { QuestionEvent } from '@/types/game';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SCORE_RULES } from '@/game/boardData';

interface QuestionModalProps {
  event: QuestionEvent | null;
  playerName: string;
  onAnswer: (index: number) => void;
  onClose: () => void;
}

const HURUF = ['A', 'B', 'C', 'D', 'E', 'F'];

const LABEL_KESULITAN: Record<string, string> = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Menantang',
};

export function QuestionModal({ event, playerName, onAnswer, onClose }: QuestionModalProps) {
  if (!event) return null;

  const { question, chosen, isCorrect } = event;
  const answered = chosen !== null;

  return (
    <Modal
      open
      hideClose
      tone={answered ? (isCorrect ? 'gembira' : 'hati-hati') : 'netral'}
      title={answered ? (isCorrect ? 'Hebat! Jawabanmu benar! ⭐' : 'Belum tepat 🙂') : `Soal untuk ${playerName}`}
      footer={
        answered ? (
          <Button variant="kedua" onClick={onClose}>
            Lanjutkan permainan
          </Button>
        ) : undefined
      }
    >
      <div className="mb-3 flex flex-wrap gap-2 font-body text-xs font-bold uppercase tracking-wide text-tinta-soft">
        <span className="rounded-full border-2 border-tinta/20 bg-white/70 px-3 py-1">
          {question.competency}
        </span>
        <span className="rounded-full border-2 border-tinta/20 bg-white/70 px-3 py-1">
          {LABEL_KESULITAN[question.difficulty] ?? question.difficulty}
        </span>
      </div>

      <p className="font-display text-xl font-semibold leading-snug text-tinta sm:text-2xl">
        {question.question}
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const isAnswer = index === question.answer;
          const isChosen = index === chosen;

          let style = 'border-tinta/20 bg-white hover:bg-kertas';
          if (answered && isAnswer) style = 'border-rumput-deep bg-rumput-light';
          else if (answered && isChosen) style = 'border-stroberi-deep bg-stroberi-light';
          else if (answered) style = 'border-tinta/15 bg-white/60 opacity-70';

          return (
            <li key={option}>
              <button
                type="button"
                disabled={answered}
                onClick={() => onAnswer(index)}
                className={[
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left',
                  'font-body text-base font-semibold text-tinta transition sm:text-lg',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60',
                  'disabled:cursor-default',
                  style,
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-tinta/25 bg-kertas font-display font-bold"
                >
                  {HURUF[index]}
                </span>
                <span className="flex-1">{option}</span>
                {answered && isAnswer && <Check aria-hidden="true" className="h-5 w-5 text-rumput-deep" />}
                {answered && isChosen && !isAnswer && <X aria-hidden="true" className="h-5 w-5 text-stroberi-deep" />}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <p aria-live="polite" className="mt-4 font-body text-base text-tinta">
          {isCorrect
            ? `Jawaban benar, kamu mendapat ${SCORE_RULES.correctAnswer} poin tambahan.`
            : 'Belum tepat. Coba lagi di kesempatan berikutnya.'}
        </p>
      )}
    </Modal>
  );
}
