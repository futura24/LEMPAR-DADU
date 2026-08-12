# Petualangan Anak Tangga

Permainan papan edukatif bertema ular tangga untuk anak. Dibangun dengan **React + TypeScript + Vite + Tailwind CSS**, tanpa backend, dan seluruh konfigurasi tersimpan di perangkat pemain melalui LocalStorage.

---

## Menjalankan aplikasi

Prasyarat: **Node.js 18 atau lebih baru**.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Aplikasi langsung dapat dimainkan tanpa langkah tambahan.

Perintah lain:

```bash
npm run typecheck   # memeriksa tipe tanpa membangun
npm run build       # membangun versi produksi ke folder dist/
npm run preview     # menjalankan hasil build secara lokal
```

---

## Struktur proyek

```
src/
├── components/
│   ├── Board/          Board.tsx, BoardOverlay.tsx (tangga & rintangan SVG)
│   ├── Cell/           satu kotak papan
│   ├── PlayerPiece/    bidak yang bergerak
│   ├── Dice/           dadu interaktif
│   ├── PlayerPanel/    giliran, dadu, statistik pemain aktif
│   ├── ScoreBoard/     peringkat semua pemain
│   ├── QuestionModal/  soal pilihan ganda
│   ├── EventModal/     pesan tangga & rintangan
│   ├── WinnerModal/    layar juara
│   ├── GameControls/   suara, ulangi, beranda, catatan permainan
│   └── ui/             Button, Modal, Confetti, ErrorBoundary, ErrorList
│
├── pages/
│   ├── Home.tsx        beranda + menu + cara bermain/pengaturan/tentang
│   ├── Setup.tsx       pengaturan pemain
│   ├── Game.tsx        papan + panel + seluruh modal
│   └── Editor.tsx      editor papan & bank soal
│
├── game/
│   ├── boardData.ts    konfigurasi papan, tangga, rintangan, warna, aturan poin
│   ├── gameRules.ts    fungsi murni: geometri papan, dadu, validasi
│   ├── gameEngine.ts   reducer permainan (tanpa React, tanpa DOM)
│   └── questionEngine.ts  pemilihan soal + adapter sumber data
│
├── data/
│   ├── questions.ts    bank soal contoh (30 butir)
│   └── players.ts      pemain bawaan & validasi data tersimpan
│
├── hooks/
│   ├── useGame.ts          menyambungkan engine dengan timer & animasi
│   ├── useSound.ts         efek suara Web Audio (tanpa berkas audio)
│   └── useLocalStorage.ts  penyimpanan yang aman dari error
│
├── types/game.ts       seluruh tipe data
├── App.tsx             navigasi antar halaman
├── main.tsx            titik masuk + ErrorBoundary
└── index.css           Tailwind + utilitas dasar
```

Pemisahan penting: **`src/game/` tidak mengimpor React sama sekali.** Aturan permainan dapat diuji atau dipakai ulang di luar UI.

---

## Aturan permainan

| Kejadian | Poin |
| --- | --- |
| Menginjak kotak baru | +1 |
| Naik tangga | +10 |
| Terkena rintangan | −5 |
| Menjawab soal dengan benar | +5 |
| Memenangkan permainan | +50 |

Langkah yang melewati kotak terakhir dibatalkan: di kotak 97 dan mendapat 4, bidak tetap di 97. Pemain pertama yang tepat mencapai kotak 100 menjadi juara.

---

## Menyesuaikan isi permainan

### Lewat aplikasi

Beranda → **Editor papan & soal**. Di sana posisi tangga, posisi rintangan, kotak bersoal, ukuran papan (6×6, 8×8, 10×10), dan bank soal dapat diubah. Konfigurasi yang tidak lolos validasi tidak dapat disimpan.

### Lewat kode

Ubah `src/game/boardData.ts`:

```ts
export const DEFAULT_BOARD: BoardConfig = {
  size: 100,
  cols: 10,
  ladders: [{ from: 3, to: 22 }, /* … */],
  snakes: [{ from: 17, to: 5 }, /* … */],
  questionCells: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
};
```

### Mengganti sumber bank soal

`questionEngine.ts` membungkus sumber soal di balik satu antarmuka, sehingga JSON, database, atau API dapat dipasang tanpa mengubah kode permainan:

```ts
import { createStaticSource, createQuestionEngine } from '@/game/questionEngine';

const response = await fetch('/api/soal');
const engine = createQuestionEngine(createStaticSource(await response.json()));
```

Bentuk satu butir soal:

```ts
{
  id: 1,
  question: 'Berapa hasil 7 + 8?',
  options: ['13', '15', '16', '17'],
  answer: 1,             // indeks jawaban benar
  difficulty: 'easy',    // easy | medium | hard
  competency: 'bilangan',
}
```

Soal yang tidak lengkap (tanpa jawaban, pilihan kurang dari dua) otomatis disaring agar modal soal tidak pernah tampil kosong.

---

## Data yang disimpan

Kunci LocalStorage diawali `anak-tangga:` — pengaturan suara & mode edukatif, pemain terakhir, konfigurasi papan, bank soal, dan lima skor tertinggi. Tidak ada data pribadi yang disimpan atau dikirim ke mana pun. Semua pembacaan dibungkus `try/catch`; bila data rusak, aplikasi kembali memakai nilai bawaan.

---

## Aksesibilitas

- Seluruh tombol dapat dijangkau keyboard dengan cincin fokus yang jelas.
- Setiap ikon memiliki `aria-hidden` atau `aria-label`; papan memakai peran `grid`/`gridcell`.
- Bidak dibedakan oleh warna **dan** motif (polos, titik, garis, kotak) serta avatar.
- Perubahan giliran dan hasil jawaban diumumkan lewat `aria-live`.
- `prefers-reduced-motion` dihormati: animasi dan konfeti dinonaktifkan.
- Suara tidak pernah berbunyi otomatis saat halaman dibuka.

---

## Deploy

### Vercel

```bash
npm i -g vercel
vercel
```

Framework preset: **Vite**. Build command `npm run build`, output directory `dist`. Atau hubungkan repositori GitHub di dashboard Vercel — pengaturan terdeteksi otomatis.

### GitHub Pages

`vite.config.ts` sudah memakai `base: './'`, sehingga hasil build berfungsi dari sub-folder mana pun.

```bash
npm run build
npx gh-pages -d dist
```

Lalu aktifkan GitHub Pages pada branch `gh-pages` di **Settings → Pages**.

Alternatif lewat GitHub Actions — simpan sebagai `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### Netlify

Build command `npm run build`, publish directory `dist`.
