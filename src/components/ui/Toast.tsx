import { AlertCircle } from 'lucide-react';

/** Daftar pesan kesalahan validasi yang tampil di atas form. */
export function ErrorList({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-2xl border-2 border-stroberi-deep bg-stroberi-light/70 p-4 font-body text-tinta"
    >
      <p className="flex items-center gap-2 font-display font-semibold">
        <AlertCircle aria-hidden="true" className="h-5 w-5" />
        Periksa kembali sebelum melanjutkan
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm sm:text-base">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
