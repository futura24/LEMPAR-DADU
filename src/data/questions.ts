import type { Question } from '@/types/game';

/**
 * Bank soal contoh. Struktur ini sengaja dibuat datar dan bebas dependensi
 * agar kelak dapat diganti sumbernya menjadi file JSON, database, atau API
 * tanpa mengubah kode permainan (lihat `questionEngine.ts`).
 */
export const QUESTION_BANK: Question[] = [
  { id: 1, question: 'Berapa hasil 7 + 8?', options: ['13', '15', '16', '17'], answer: 1, difficulty: 'easy', competency: 'bilangan' },
  { id: 2, question: 'Berapa hasil 12 − 5?', options: ['5', '6', '7', '8'], answer: 2, difficulty: 'easy', competency: 'bilangan' },
  { id: 3, question: 'Berapa hasil 6 × 4?', options: ['20', '22', '24', '26'], answer: 2, difficulty: 'easy', competency: 'bilangan' },
  { id: 4, question: 'Berapa hasil 36 ÷ 6?', options: ['4', '5', '6', '7'], answer: 2, difficulty: 'easy', competency: 'bilangan' },
  { id: 5, question: 'Bilangan manakah yang lebih besar dari 48?', options: ['39', '45', '47', '52'], answer: 3, difficulty: 'easy', competency: 'bilangan' },
  { id: 6, question: 'Berapa hasil 9 × 7?', options: ['56', '63', '64', '72'], answer: 1, difficulty: 'medium', competency: 'bilangan' },
  { id: 7, question: 'Berapa hasil (−4) + 9?', options: ['−5', '5', '13', '−13'], answer: 1, difficulty: 'medium', competency: 'bilangan bulat' },
  { id: 8, question: 'Berapa hasil 15 − (−6)?', options: ['9', '−21', '21', '−9'], answer: 2, difficulty: 'medium', competency: 'bilangan bulat' },
  { id: 9, question: 'Bentuk sederhana dari pecahan 8/12 adalah …', options: ['2/3', '3/4', '4/5', '1/2'], answer: 0, difficulty: 'medium', competency: 'pecahan' },
  { id: 10, question: 'Berapa hasil 1/2 + 1/4?', options: ['2/6', '1/6', '3/4', '2/4'], answer: 2, difficulty: 'medium', competency: 'pecahan' },
  { id: 11, question: 'Nilai dari 25% × 80 adalah …', options: ['15', '20', '25', '30'], answer: 1, difficulty: 'medium', competency: 'persen' },
  { id: 12, question: 'Keliling persegi dengan sisi 9 cm adalah …', options: ['18 cm', '27 cm', '36 cm', '81 cm'], answer: 2, difficulty: 'easy', competency: 'geometri' },
  { id: 13, question: 'Luas persegi panjang 12 cm × 5 cm adalah …', options: ['17 cm²', '34 cm²', '60 cm²', '70 cm²'], answer: 2, difficulty: 'easy', competency: 'geometri' },
  { id: 14, question: 'Luas segitiga dengan alas 10 cm dan tinggi 6 cm adalah …', options: ['16 cm²', '30 cm²', '60 cm²', '80 cm²'], answer: 1, difficulty: 'medium', competency: 'geometri' },
  { id: 15, question: 'Berapa banyak sisi pada bangun kubus?', options: ['4', '6', '8', '12'], answer: 1, difficulty: 'easy', competency: 'geometri' },
  { id: 16, question: 'Nilai x pada persamaan x + 7 = 15 adalah …', options: ['6', '7', '8', '22'], answer: 2, difficulty: 'medium', competency: 'aljabar' },
  { id: 17, question: 'Nilai y pada persamaan 3y = 21 adalah …', options: ['3', '6', '7', '18'], answer: 2, difficulty: 'medium', competency: 'aljabar' },
  { id: 18, question: 'Bentuk sederhana dari 5a + 3a − 2a adalah …', options: ['4a', '6a', '8a', '10a'], answer: 1, difficulty: 'medium', competency: 'aljabar' },
  { id: 19, question: 'Rata-rata dari 4, 6, 8, dan 10 adalah …', options: ['6', '7', '8', '9'], answer: 1, difficulty: 'medium', competency: 'statistika' },
  { id: 20, question: 'Data: 3, 5, 5, 7, 9. Modus data tersebut adalah …', options: ['3', '5', '7', '9'], answer: 1, difficulty: 'medium', competency: 'statistika' },
  { id: 21, question: 'Sebuah dadu dilempar sekali. Peluang muncul mata dadu 3 adalah …', options: ['1/2', '1/3', '1/6', '3/6'], answer: 2, difficulty: 'hard', competency: 'peluang' },
  { id: 22, question: 'Berapa hasil 2³?', options: ['5', '6', '8', '9'], answer: 2, difficulty: 'medium', competency: 'bilangan berpangkat' },
  { id: 23, question: 'Akar kuadrat dari 144 adalah …', options: ['11', '12', '13', '14'], answer: 1, difficulty: 'medium', competency: 'bilangan berpangkat' },
  { id: 24, question: 'FPB dari 18 dan 24 adalah …', options: ['3', '4', '6', '12'], answer: 2, difficulty: 'hard', competency: 'kpk dan fpb' },
  { id: 25, question: 'KPK dari 4 dan 6 adalah …', options: ['10', '12', '18', '24'], answer: 1, difficulty: 'hard', competency: 'kpk dan fpb' },
  { id: 26, question: 'Ibu membeli 3 kg gula seharga Rp45.000. Harga 1 kg gula adalah …', options: ['Rp12.000', 'Rp15.000', 'Rp18.000', 'Rp20.000'], answer: 1, difficulty: 'medium', competency: 'perbandingan' },
  { id: 27, question: 'Perbandingan 12 : 18 jika disederhanakan menjadi …', options: ['2 : 3', '3 : 4', '4 : 6', '6 : 9'], answer: 0, difficulty: 'medium', competency: 'perbandingan' },
  { id: 28, question: 'Jarak 150 km ditempuh dalam 3 jam. Kecepatan rata-ratanya adalah …', options: ['30 km/jam', '45 km/jam', '50 km/jam', '60 km/jam'], answer: 2, difficulty: 'hard', competency: 'perbandingan' },
  { id: 29, question: 'Suhu mula-mula 5 °C lalu turun 9 °C. Suhu sekarang adalah …', options: ['−4 °C', '4 °C', '−14 °C', '14 °C'], answer: 0, difficulty: 'medium', competency: 'bilangan bulat' },
  { id: 30, question: 'Pola bilangan: 2, 5, 8, 11, … Bilangan berikutnya adalah …', options: ['12', '13', '14', '15'], answer: 2, difficulty: 'medium', competency: 'pola bilangan' },
];
