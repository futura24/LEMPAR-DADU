/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        langit: { light: '#E0F2FE', DEFAULT: '#38BDF8', deep: '#0284C7' },
        matahari: { light: '#FDE68A', DEFAULT: '#FBBF24', deep: '#D97706' },
        rumput: { light: '#BBF7D0', DEFAULT: '#4ADE80', deep: '#16A34A' },
        kayu: { light: '#E7B77A', DEFAULT: '#C97B2C', deep: '#8A4B14' },
        stroberi: { light: '#FECDD3', DEFAULT: '#FB7185', deep: '#BE123C' },
        anggur: { light: '#DDD6FE', DEFAULT: '#A78BFA', deep: '#6D28D9' },
        tinta: { DEFAULT: '#2F2A25', soft: '#6B6259' },
        kertas: '#FFFBF2',
      },
      fontFamily: {
        display: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '0 4px 0 0 rgba(47,42,37,0.28)',
        'pop-sm': '0 3px 0 0 rgba(47,42,37,0.25)',
        'pop-lg': '0 7px 0 0 rgba(47,42,37,0.3)',
        kartu: '0 6px 0 0 rgba(47,42,37,0.14), 0 12px 26px -12px rgba(47,42,37,0.4)',
      },
      borderRadius: { blob: '1.75rem' },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.82) translateY(14px)', opacity: '0' },
          '70%': { transform: 'scale(1.03) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        mengambang: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        goyang: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'dadu-guling': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(-18deg) scale(1.08)' },
          '50%': { transform: 'rotate(14deg) scale(0.94)' },
          '75%': { transform: 'rotate(-10deg) scale(1.06)' },
          '100%': { transform: 'rotate(0deg) scale(1)' },
        },
        denyut: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(251,191,36,0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(251,191,36,0)' },
        },
        konfeti: {
          '0%': { transform: 'translateY(-12vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(105vh) rotate(720deg)', opacity: '0' },
        },
        awan: {
          '0%': { transform: 'translateX(-18%)' },
          '100%': { transform: 'translateX(118%)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 260ms cubic-bezier(0.2,0.9,0.3,1.4) both',
        'fade-in': 'fade-in 200ms ease-out both',
        mengambang: 'mengambang 3.2s ease-in-out infinite',
        goyang: 'goyang 2.4s ease-in-out infinite',
        'dadu-guling': 'dadu-guling 480ms ease-in-out infinite',
        denyut: 'denyut 1.8s ease-out infinite',
        awan: 'awan linear infinite',
      },
    },
  },
  plugins: [],
};
