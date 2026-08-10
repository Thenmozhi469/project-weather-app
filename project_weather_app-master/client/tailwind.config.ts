import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        glass: {
          light:  'rgba(255,255,255,0.15)',
          medium: 'rgba(255,255,255,0.10)',
          dark:   'rgba(0,0,0,0.20)',
        },
      },
      backdropBlur: {
        xs:    '2px',
        glass: '24px',
      },
      borderRadius: {
        glass: '24px',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glass:       '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.10)',
        'glass-lg':  '0 24px 80px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glass-hover':'0 16px 56px rgba(0,0,0,0.22)',
        glow:        '0 0 40px rgba(255,255,255,0.10)',
        'glow-blue': '0 0 40px rgba(96,165,250,0.28)',
        'glow-purple':'0 0 40px rgba(167,139,250,0.28)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'rain':         'rain 0.9s linear infinite',
        'snow':         'snow 5s linear infinite',
        'lightning':    'lightning 0.2s ease-in-out',
        'twinkle':      'twinkle 3s ease-in-out infinite',
        'cloud-move':   'cloudMove 45s linear infinite',
        'shimmer':      'shimmer 1.8s ease-in-out infinite',
        'fade-up':      'fadeUp 0.5s ease-out',
        'scale-in':     'scaleIn 0.3s ease-out',
        'slide-down':   'slideDown 0.25s ease-out',
      },
      keyframes: {
        float:      { '0%,100%': { transform: 'translateY(0)'   }, '50%': { transform: 'translateY(-18px)' } },
        rain:       { '0%':   { transform: 'translateY(-100vh)', opacity: '1' }, '100%': { transform: 'translateY(100vh)', opacity: '0.3' } },
        snow:       { '0%':   { transform: 'translateY(-10vh) rotate(0deg)',   opacity: '1' }, '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0.3' } },
        lightning:  { '0%,100%': { opacity: '0' }, '50%': { opacity: '1' } },
        twinkle:    { '0%,100%': { opacity: '0.3', transform: 'scale(0.8)' }, '50%': { opacity: '1', transform: 'scale(1.2)' } },
        cloudMove:  { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100vw)' } },
        shimmer:    { '0%': { backgroundPosition: '100% 0' }, '100%': { backgroundPosition: '-100% 0' } },
        fadeUp:     { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:    { '0%': { opacity: '0', transform: 'scale(0.9)'       }, '100%': { opacity: '1', transform: 'scale(1)'   } },
        slideDown:  { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
