import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: 'var(--space)',
        panel: 'var(--panel)',
        raised: 'var(--raised)',
        starlight: 'var(--starlight)',
        forged: 'var(--forged)',
        nebula: 'var(--nebula)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
