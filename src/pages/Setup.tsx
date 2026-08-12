import { useMemo, useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import type { PlayerConfig } from '@/types/game';
import { AVATARS, MAX_PLAYERS, PIECE_COLORS } from '@/game/boardData';
import { createDefaultPlayer } from '@/data/players';
import { validatePlayers } from '@/game/gameRules';
import { Button } from '@/components/ui/Button';
import { ErrorList } from '@/components/ui/Toast';

interface SetupProps {
  initialPlayers: PlayerConfig[];
  onBack: () => void;
  onStart: (players: PlayerConfig[]) => void;
}

/** Menyiapkan daftar pemain sepanjang `count`, mempertahankan data yang sudah diisi. */
function resize(players: PlayerConfig[], count: number): PlayerConfig[] {
  return Array.from({ length: count }, (_, index) => {
    const existing = players[index];
    if (existing) return { ...existing, id: index + 1 };
    const fallback = createDefaultPlayer(index);
    const taken = players.slice(0, index).map((p) => p.colorId);
    const freeColor = PIECE_COLORS.find((color) => !taken.includes(color.id));
    return { ...fallback, colorId: freeColor?.id ?? fallback.colorId };
  });
}

export function Setup({ initialPlayers, onBack, onStart }: SetupProps) {
  const [players, setPlayers] = useState<PlayerConfig[]>(() =>
    resize(initialPlayers, Math.min(Math.max(initialPlayers.length, 1), MAX_PLAYERS)),
  );
  const [showErrors, setShowErrors] = useState(false);

  const errors = useMemo(() => validatePlayers(players), [players]);

  const update = (index: number, patch: Partial<PlayerConfig>) => {
    setPlayers((prev) => prev.map((player, i) => (i === index ? { ...player, ...patch } : player)));
  };

  const handleStart = () => {
    if (errors.length > 0) {
      setShowErrors(true);
      return;
    }
    onStart(players.map((player) => ({ ...player, name: player.name.trim() })));
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Button variant="lembut" size="sm" onClick={onBack} icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}>
        Kembali
      </Button>

      <h1 className="mt-5 font-display text-3xl font-bold text-tinta sm:text-4xl">Siapa yang bermain?</h1>
      <p className="mt-1 font-body text-tinta-soft">
        Pilih jumlah pemain, lalu isi nama, avatar, dan warna bidak masing-masing.
      </p>

      <fieldset className="mt-6">
        <legend className="font-display text-lg font-bold text-tinta">Jumlah pemain</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from({ length: MAX_PLAYERS }, (_, i) => i + 1).map((count) => (
            <button
              key={count}
              type="button"
              aria-pressed={players.length === count}
              onClick={() => setPlayers((prev) => resize(prev, count))}
              className={[
                'rounded-2xl border-2 px-5 py-3 font-display text-lg font-semibold shadow-pop-sm transition',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60',
                players.length === count
                  ? 'border-matahari-deep bg-matahari text-tinta'
                  : 'border-tinta/20 bg-white text-tinta hover:bg-kertas',
              ].join(' ')}
            >
              {count} pemain
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 space-y-4">
        {players.map((player, index) => {
          const takenColors = players.filter((_, i) => i !== index).map((p) => p.colorId);
          const inputId = `nama-pemain-${index}`;

          return (
            <section
              key={index}
              className="rounded-blob border-4 border-tinta/70 bg-kertas p-4 shadow-kartu sm:p-5"
              aria-label={`Pengaturan pemain ${index + 1}`}
            >
              <h2 className="font-display text-lg font-bold text-tinta">Pemain {index + 1}</h2>

              <div className="mt-3">
                <label htmlFor={inputId} className="font-body text-sm font-bold text-tinta-soft">
                  Nama
                </label>
                <input
                  id={inputId}
                  type="text"
                  value={player.name}
                  maxLength={12}
                  onChange={(event) => update(index, { name: event.target.value })}
                  placeholder="Tulis nama"
                  className="mt-1 w-full rounded-2xl border-2 border-tinta/25 bg-white px-4 py-3 font-body text-lg text-tinta placeholder:text-tinta-soft/60 focus:border-langit-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60"
                />
              </div>

              <fieldset className="mt-4">
                <legend className="font-body text-sm font-bold text-tinta-soft">Avatar</legend>
                <div className="mt-1 flex flex-wrap gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      aria-label={`Pilih avatar ${avatar}`}
                      aria-pressed={player.avatar === avatar}
                      onClick={() => update(index, { avatar })}
                      className={[
                        'h-12 w-12 rounded-2xl border-2 text-2xl transition',
                        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60',
                        player.avatar === avatar
                          ? 'border-langit-deep bg-langit-light'
                          : 'border-tinta/20 bg-white hover:bg-kertas',
                      ].join(' ')}
                    >
                      <span aria-hidden="true">{avatar}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-4">
                <legend className="font-body text-sm font-bold text-tinta-soft">Warna bidak</legend>
                <div className="mt-1 flex flex-wrap gap-2">
                  {PIECE_COLORS.map((color) => {
                    const isTaken = takenColors.includes(color.id);
                    const isChosen = player.colorId === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        disabled={isTaken}
                        aria-pressed={isChosen}
                        aria-label={`Warna ${color.label}${isTaken ? ' (sudah dipakai pemain lain)' : ''}`}
                        onClick={() => update(index, { colorId: color.id })}
                        className={[
                          'flex items-center gap-2 rounded-2xl border-2 px-3 py-2 font-body text-sm font-semibold transition',
                          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60',
                          'disabled:cursor-not-allowed disabled:opacity-40',
                          isChosen ? 'border-tinta bg-white' : 'border-tinta/20 bg-white/70 hover:bg-white',
                        ].join(' ')}
                      >
                        <span
                          aria-hidden="true"
                          className="h-6 w-6 rounded-full border-2"
                          style={{ backgroundColor: color.hex, borderColor: color.dark }}
                        />
                        {color.label}
                        {isChosen && <span aria-hidden="true">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </section>
          );
        })}
      </div>

      {showErrors && <div className="mt-5"><ErrorList errors={errors} /></div>}

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={handleStart} icon={<Play aria-hidden="true" className="h-6 w-6" />}>
          Mulai permainan
        </Button>
      </div>
    </div>
  );
}
