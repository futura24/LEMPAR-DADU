import { useCallback, useEffect, useRef, useState } from 'react';

const PREFIX = 'anak-tangga:';

/** Membaca LocalStorage tanpa pernah melempar error (mode privat, kuota penuh, JSON rusak). */
export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Data tersimpan "${key}" tidak dapat dibaca, memakai nilai bawaan.`, error);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Data "${key}" gagal disimpan.`, error);
    return false;
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* diabaikan: penyimpanan tidak tersedia */
  }
}

/**
 * State React yang otomatis tersimpan di LocalStorage.
 * `validate` dipakai untuk menolak data lama yang bentuknya sudah tidak cocok.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = readStorage<T>(key, initialValue);
    if (validate && !validate(stored)) return initialValue;
    return stored;
  });

  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    writeStorage(keyRef.current, value);
  }, [value]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === 'function' ? (next as (p: T) => T)(prev) : next));
  }, []);

  return [value, update];
}

export const STORAGE_KEYS = {
  settings: 'pengaturan',
  players: 'pemain-terakhir',
  board: 'konfigurasi-papan',
  highScores: 'skor-tertinggi',
  questions: 'bank-soal',
} as const;
