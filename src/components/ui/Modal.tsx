import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose?: () => void;
  /** Menyembunyikan tombol tutup untuk modal yang wajib diselesaikan. */
  hideClose?: boolean;
  tone?: 'netral' | 'gembira' | 'hati-hati' | 'juara';
  footer?: ReactNode;
}

const TONES: Record<NonNullable<ModalProps['tone']>, string> = {
  netral: 'bg-langit-light border-langit-deep',
  gembira: 'bg-rumput-light border-rumput-deep',
  'hati-hati': 'bg-stroberi-light border-stroberi-deep',
  juara: 'bg-matahari-light border-matahari-deep',
};

export function Modal({
  open,
  title,
  children,
  onClose,
  hideClose = false,
  tone = 'netral',
  footer,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose && !hideClose) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose, hideClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/50 p-4 animate-fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && onClose && !hideClose) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-modal"
        tabIndex={-1}
        className={[
          'w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-blob border-4 p-5 sm:p-7',
          'shadow-kartu outline-none animate-pop-in',
          TONES[tone],
        ].join(' ')}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="judul-modal" className="font-display text-2xl font-bold text-tinta sm:text-3xl">
            {title}
          </h2>
          {!hideClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela"
              className="rounded-full border-2 border-tinta/25 bg-white/80 p-2 text-tinta transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="font-body text-base text-tinta sm:text-lg">{children}</div>

        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
