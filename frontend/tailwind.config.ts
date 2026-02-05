import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@radix-ui/**/*.{js,ts,jsx,tsx}',
    './node_modules/lucide-react/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@radix-ui/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/lucide-react/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors from spec
        background: {
          DEFAULT: 'hsl(220, 15%, 5%)', // neutral-950
          light: 'hsl(220, 15%, 10%)', // neutral-900
        },
        surface: {
          DEFAULT: 'hsl(220, 15%, 10%)', // neutral-900
          light: 'hsl(220, 15%, 20%)', // neutral-800
        },
        text: {
          primary: 'hsl(220, 15%, 95%)', // neutral-100
          secondary: 'hsl(220, 15%, 40%)', // neutral-400
        },
        accent: {
          ai: 'hsl(240, 100%, 60%)', // indigo-500
        },
        success: {
          DEFAULT: 'hsl(142, 76%, 36%)', // emerald-500
        },
        error: {
          DEFAULT: 'hsl(348, 86%, 61%)', // rose-500
        },
      },
      maxWidth: {
        'chat': '800px', // Max width for chat container per spec
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        // Animation durations from spec (fast: 120-150ms, normal: 180-220ms, slow: 280-320ms)
        'fade-in-fast': 'fadeIn 150ms ease-out',
        'slide-in-right': 'slideInRight 150ms ease-out',
        'slide-in-left': 'slideInLeft 150ms ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)', height: '0' },
          '100%': { opacity: '1', transform: 'translateY(0)', height: 'auto' },
        },
      },
    },
  },
  plugins: [],
};
export default config;