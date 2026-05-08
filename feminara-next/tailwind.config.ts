import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        b900: '#0B4F6C',
        b800: '#0D6080',
        b700: '#1A7A9A',
        b600: '#2090AE',
        b500: '#2899B4',
        b400: '#42B5CC',
        b300: '#7CCFDE',
        b200: '#B0E4EF',
        b100: '#D4F1F8',
        b50:  '#EBF8FC',
        b25:  '#F5FBFD',
        fl: {
          DEFAULT: '#1A7A9A',
          light: '#D4F1F8',
          mid: '#7CCFDE',
          dark: '#0B4F6C',
        },
        sp: {
          DEFAULT: '#1565C0',
          light: '#DDEEFF',
          mid: '#90CAF9',
          dark: '#0D47A1',
        },
        gl: {
          DEFAULT: '#00838F',
          light: '#D0F4F7',
          mid: '#80DEEA',
          dark: '#006064',
        },
        bm: {
          DEFAULT: '#5C6BC0',
          light: '#E8EAF6',
          mid: '#9FA8DA',
          dark: '#3949AB',
        },
      },
    },
  },
  plugins: [],
};

export default config;
