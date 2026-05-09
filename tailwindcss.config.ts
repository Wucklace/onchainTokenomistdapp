import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#15c6e6c0',
        neonOrange: '#fa7e09cb',
        deepBlack: '#1A1A1A',
        charcoal: '#0A0A0A',
        darkBlack: '#000000',
        neonBlueTone: 'rgba(21, 198, 230, 0.15)',
        neonOrangeTone: 'rgba(250, 126, 9, 0.09)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;