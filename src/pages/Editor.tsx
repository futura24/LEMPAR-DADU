import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import type { BoardConfig, Difficulty, Jump, Question } from '@/types/game';
import { BOARD_PRESETS, DEFAULT_BOARD } from '@/game/boardData';
import { validateBoard } from '@/game/gameRules';
import { isValidQuestion } from '@/game/questionEngine';
import { QUESTION_BANK } from '@/data/questions';
import { Button } from '@/components/ui/Button';
import { ErrorList } from '@/components/ui/Toast';

interface EditorProps {
  board: BoardConfig;
  questions: Question[];
  onSave: (board: BoardConfig, questions: Question[]) => void;
  onBack: () => void;
}

const KESULITAN: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Mudah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'hard', label: 'Menantang' },
];

const FIELD =
  'w-full rounded-xl border-2 border-tinta/25 bg-white px-3 py-2 font-body text-tinta focus:border-langit-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60';

const KOSONG: Question = {
  id: 0,
  question: '',
  options: ['', '', '', ''],
  answer: 0,
  difficulty: 'easy',
  competency: 'bilangan',
};

function JumpEditor({
  title,
  hint,
  jumps,
  onChange,
}: {
  title: string;
  hint: string;
  jumps: Jump[];
  onChange: (jumps: Jump[]) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-lg font-bold text-tinta">{title}</legend>
      <p className="font-body text-sm text-tinta-soft">{hint}</p>

      <ul className="mt-2 space-y-2">
        {jumps.map((jump, index) => (
          <li key={index} className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`${title}-dari-${index}`}>
              {title} nomor {index + 1}, kotak awal
            </label>
            <input
              id={`${title}-dari-${index}`}
              type="number"
              inputMode="numeric"
              value={jump.from}
              onChange={(event) =>
                onChange(
                  jumps.map((item, i) =>
                    i === index ? { ...item, from: Number(event.target.value) } : item,
                  ),
                )
              }
              className={`${FIELD} w-24`}
            />
            <span aria-hidden="true" className="font-display text-lg">
              →
            </span>
            <label className="sr-only" htmlFor={`${title}-ke-${index}`}>
              {title} nomor {index + 1}, kotak tujuan
            </label>
            <input
              id={`${title}-ke-${index}`}
              type="number"
              inputMode="numeric"
              value={jump.to}
              onChange={(event) =>
                onChange(
                  jumps.map((item, i) => (i === index ? { ...item, to: Number(event.target.value) } : item)),
                )
              }
              className={`${FIELD} w-24`}
            />
            <button
              type="button"
              aria-label={`Hapus ${title.toLowerCase()} ${jump.from} ke ${jump.to}`}
              onClick={() => onChange(jumps.filter((_, i) => i !== index))}
              className="rounded-xl border-2 border-stroberi-deep bg-stroberi-light p-2 text-stroberi-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <Button
        size="sm"
        variant="lembut"
        className="mt-3"
        onClick={() => onChange([...jumps, { from: 2, to: 3 }])}
        icon={<Plus aria-hidden="true" className="h-4 w-4" />}
      >
        Tambah
      </Button>
    </fieldset>
  );
}

export function Editor({ board, questions, onSave, onBack }: EditorProps) {
  const [draft, setDraft] = useState<BoardConfig>(board);
  const [bank, setBank] = useState<Question[]>(questions);
  const [newQuestion, setNewQuestion] = useState<Question>(KOSONG);
  const [message, setMessage] = useState<string | null>(null);

  const boardErrors = useMemo(() => validateBoard(draft), [draft]);
  const questionValid = isValidQuestion(newQuestion) && newQuestion.options.every((o) => o.trim());

  const handleSave = () => {
    if (boardErrors.length > 0) {
      setMessage(null);
      return;
    }
    onSave(draft, bank);
    setMessage('Konfigurasi tersimpan di perangkat ini.');
  };

  const addQuestion = () => {
    if (!questionValid) return;
    const nextId = Math.max(0, ...bank.map((q) => q.id)) + 1;
    setBank([...bank, { ...newQuestion, id: nextId }]);
    setNewQuestion(KOSONG);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Button variant="lembut" size="sm" onClick={onBack} icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}>
        Kembali
      </Button>

      <h1 className="mt-5 font-display text-3xl font-bold text-tinta sm:text-4xl">Editor papan &amp; soal</h1>
      <p className="mt-1 font-body text-tinta-soft">
        Sesuaikan papan dengan materi yang sedang diajarkan. Perubahan tersimpan di perangkat ini saja.
      </p>

      <section className="mt-6 rounded-blob border-4 border-tinta/70 bg-kertas p-5 shadow-kartu">
        <h2 className="font-display text-xl font-bold text-tinta">Ukuran papan</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {BOARD_PRESETS.map((preset) => (
            <button
              key={preset.size}
              type="button"
              aria-pressed={draft.size === preset.size}
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  size: preset.size,
                  cols: preset.cols,
                  ladders: prev.ladders.filter((j) => j.from <= preset.size && j.to <= preset.size),
                  snakes: prev.snakes.filter((j) => j.from <= preset.size && j.to <= preset.size),
                  questionCells: prev.questionCells.filter((cell) => cell <= preset.size),
                }))
              }
              className={[
                'rounded-2xl border-2 px-4 py-2 font-display font-semibold shadow-pop-sm transition',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60',
                draft.size === preset.size
                  ? 'border-matahari-deep bg-matahari text-tinta'
                  : 'border-tinta/20 bg-white text-tinta hover:bg-white/70',
              ].join(' ')}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <JumpEditor
            title="Tangga"
            hint="Kotak awal harus lebih kecil dari kotak tujuan."
            jumps={draft.ladders}
            onChange={(ladders) => setDraft((prev) => ({ ...prev, ladders }))}
          />
          <JumpEditor
            title="Rintangan"
            hint="Kotak awal harus lebih besar dari kotak tujuan."
            jumps={draft.snakes}
            onChange={(snakes) => setDraft((prev) => ({ ...prev, snakes }))}
          />
        </div>

        <div className="mt-6">
          <label htmlFor="kotak-soal" className="font-display text-lg font-bold text-tinta">
            Kotak berisi soal
          </label>
          <p className="font-body text-sm text-tinta-soft">Tulis nomor kotak, pisahkan dengan koma.</p>
          <input
            id="kotak-soal"
            type="text"
            inputMode="numeric"
            value={draft.questionCells.join(', ')}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                questionCells: event.target.value
                  .split(',')
                  .map((part) => Number(part.trim()))
                  .filter((n) => Number.isInteger(n) && n > 0),
              }))
            }
            className={`${FIELD} mt-2`}
          />
        </div>

        {boardErrors.length > 0 && (
          <div className="mt-5">
            <ErrorList errors={boardErrors} />
          </div>
        )}
      </section>

      <section className="mt-6 rounded-blob border-4 border-tinta/70 bg-kertas p-5 shadow-kartu">
        <h2 className="font-display text-xl font-bold text-tinta">Bank soal ({bank.length})</h2>

        <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
          {bank.map((question) => (
            <li
              key={question.id}
              className="flex items-start gap-3 rounded-xl border-2 border-tinta/15 bg-white px-3 py-2"
            >
              <span className="flex-1 font-body text-sm text-tinta">
                {question.question}
                <span className="block text-xs text-tinta-soft">
                  Jawaban: {question.options[question.answer]} · {question.competency}
                </span>
              </span>
              <button
                type="button"
                aria-label={`Hapus soal: ${question.question}`}
                onClick={() => setBank(bank.filter((q) => q.id !== question.id))}
                className="rounded-xl border-2 border-stroberi-deep bg-stroberi-light p-2 text-stroberi-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        <h3 className="mt-5 font-display text-lg font-bold text-tinta">Tambah soal baru</h3>
        <div className="mt-2 space-y-3">
          <div>
            <label htmlFor="soal-baru" className="font-body text-sm font-bold text-tinta-soft">
              Pertanyaan
            </label>
            <input
              id="soal-baru"
              type="text"
              value={newQuestion.question}
              onChange={(event) => setNewQuestion({ ...newQuestion, question: event.target.value })}
              className={`${FIELD} mt-1`}
            />
          </div>

          <fieldset>
            <legend className="font-body text-sm font-bold text-tinta-soft">
              Pilihan jawaban (tandai yang benar)
            </legend>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="jawaban-benar"
                    className="h-5 w-5 accent-rumput-deep"
                    checked={newQuestion.answer === index}
                    onChange={() => setNewQuestion({ ...newQuestion, answer: index })}
                    aria-label={`Tandai pilihan ${index + 1} sebagai jawaban benar`}
                  />
                  <label className="sr-only" htmlFor={`pilihan-${index}`}>
                    Pilihan {index + 1}
                  </label>
                  <input
                    id={`pilihan-${index}`}
                    type="text"
                    value={option}
                    onChange={(event) =>
                      setNewQuestion({
                        ...newQuestion,
                        options: newQuestion.options.map((o, i) => (i === index ? event.target.value : o)),
                      })
                    }
                    className={FIELD}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="kesulitan" className="font-body text-sm font-bold text-tinta-soft">
                Tingkat kesulitan
              </label>
              <select
                id="kesulitan"
                value={newQuestion.difficulty}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, difficulty: event.target.value as Difficulty })
                }
                className={`${FIELD} mt-1`}
              >
                {KESULITAN.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="kompetensi" className="font-body text-sm font-bold text-tinta-soft">
                Kompetensi
              </label>
              <input
                id="kompetensi"
                type="text"
                value={newQuestion.competency}
                onChange={(event) => setNewQuestion({ ...newQuestion, competency: event.target.value })}
                className={`${FIELD} mt-1`}
              />
            </div>
          </div>

          <Button
            variant="kedua"
            onClick={addQuestion}
            disabled={!questionValid}
            icon={<Plus aria-hidden="true" className="h-5 w-5" />}
          >
            Tambahkan ke bank soal
          </Button>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        {message && (
          <p aria-live="polite" className="font-body text-rumput-deep">
            {message}
          </p>
        )}
        <Button
          variant="lembut"
          onClick={() => {
            setDraft(DEFAULT_BOARD);
            setBank(QUESTION_BANK);
            setMessage('Konfigurasi dikembalikan ke bawaan. Tekan Simpan untuk menerapkannya.');
          }}
          icon={<RotateCcw aria-hidden="true" className="h-5 w-5" />}
        >
          Kembalikan bawaan
        </Button>
        <Button
          onClick={handleSave}
          disabled={boardErrors.length > 0}
          icon={<Save aria-hidden="true" className="h-5 w-5" />}
        >
          Simpan konfigurasi
        </Button>
      </div>
    </div>
  );
}
