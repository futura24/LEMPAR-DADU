import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

/**
 * Menahan error render agar aplikasi tidak pernah menampilkan layar kosong.
 * Pemain selalu mendapat jalan keluar: memuat ulang permainan.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Terjadi kesalahan pada permainan:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-blob border-4 border-stroberi-deep bg-white p-7 text-center shadow-kartu">
          <p className="text-5xl" aria-hidden="true">🧩</p>
          <h1 className="mt-3 font-display text-2xl font-bold text-tinta">Permainan berhenti sejenak</h1>
          <p className="mt-2 font-body text-tinta-soft">
            Ada bagian permainan yang gagal dimuat. Muat ulang halaman untuk mulai lagi dari beranda.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-5 rounded-2xl border-2 border-matahari-deep bg-matahari px-6 py-3 font-display text-lg font-semibold text-tinta shadow-pop focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60"
          >
            Muat ulang permainan
          </button>
        </div>
      </div>
    );
  }
}
