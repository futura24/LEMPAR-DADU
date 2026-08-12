import { Home, RotateCcw, ScrollText, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GameControlsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onHome: () => void;
  log: string[];
}

export function GameControls({
  soundEnabled,
  onToggleSound,
  onRestart,
  onHome,
  log,
}: GameControlsProps) {
  return (
    <section
      className="rounded-blob border-4 border-tinta/70 bg-kertas p-4 shadow-kartu"
      aria-label="Kontrol permainan"
    >
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="lembut"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          icon={
            soundEnabled ? (
              <Volume2 aria-hidden="true" className="h-4 w-4" />
            ) : (
              <VolumeX aria-hidden="true" className="h-4 w-4" />
            )
          }
        >
          {soundEnabled ? 'Suara aktif' : 'Suara mati'}
        </Button>
        <Button
          size="sm"
          variant="lembut"
          onClick={onRestart}
          icon={<RotateCcw aria-hidden="true" className="h-4 w-4" />}
        >
          Ulangi
        </Button>
        <Button
          size="sm"
          variant="lembut"
          onClick={onHome}
          icon={<Home aria-hidden="true" className="h-4 w-4" />}
        >
          Beranda
        </Button>
      </div>

      <h2 className="mt-4 flex items-center gap-2 font-display text-base font-bold text-tinta">
        <ScrollText aria-hidden="true" className="h-4 w-4" />
        Catatan permainan
      </h2>
      <ul aria-live="polite" className="mt-2 space-y-1 font-body text-sm text-tinta-soft">
        {log.length === 0 && <li>Belum ada langkah yang tercatat.</li>}
        {log.map((entry, index) => (
          <li key={`${entry}-${index}`} className={index === 0 ? 'font-semibold text-tinta' : ''}>
            {entry}
          </li>
        ))}
      </ul>
    </section>
  );
}
