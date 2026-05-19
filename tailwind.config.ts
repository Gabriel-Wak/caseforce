import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './store/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          void: '#050506',
          panel: '#0b0d10',
          metal: '#12161c',
          line: '#2a2f38',
          orange: '#ff8a1d',
          amber: '#ffc44d',
          gold: '#f5b544',
          purple: '#8b5cf6',
          blue: '#29b7ff',
          red: '#8b1414',
          ice: '#f4f7fb',
          silver: '#c4c9d4',
          muted: '#8a93a5'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 36px rgba(255, 138, 29, 0.22)',
        purple: '0 0 30px rgba(139, 92, 246, 0.2)',
        insetLine: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.7)'
      },
      backgroundImage: {
        'radial-forge': 'radial-gradient(circle at 20% 20%, rgba(255,138,29,0.20), transparent 27%), radial-gradient(circle at 78% 12%, rgba(139,92,246,0.16), transparent 24%), linear-gradient(180deg,#0b0d10 0%,#050506 100%)',
        'panel-noise': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 18px), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        'hazard': 'repeating-linear-gradient(-45deg, rgba(255,138,29,0.95) 0 12px, rgba(13,14,18,0.96) 12px 24px)'
      },
      clipPath: {
        chamfer: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
      }
    }
  },
  plugins: []
};

export default config;
