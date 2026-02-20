import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF0F7',
          100: '#FFE0EF',
          200: '#FFC2DF',
          300: '#FF8DBF',
          400: '#FF4D9A',
          500: '#E6007E',
          600: '#CC006F',
          700: '#A3005A',
          800: '#800047',
          900: '#5C0033',
          950: '#33001C',
        },
        accent: {
          50: '#FFF0F7',
          100: '#FFE0EF',
          200: '#FFC2DF',
          300: '#FF8DBF',
          400: '#FF4D9A',
          500: '#E6007E',
          600: '#CC006F',
          700: '#A3005A',
          800: '#800047',
          900: '#5C0033',
          950: '#33001C',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        background: '#FAFBFC',
        surface: '#FFFFFF',
        foreground: {
          DEFAULT: '#000000',
          secondary: '#4A4A4A',
          muted: '#8A8A8A',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
          dark: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-xs': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-xl': ['1.25rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'elevated': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        'glow': '0 0 40px rgba(230, 0, 126, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #E6007E 0%, #FF4D9A 50%, #CC006F 100%)',
        'gradient-accent': 'linear-gradient(135deg, #E6007E 0%, #FF4D9A 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(330, 100%, 45%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(330, 80%, 65%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340, 85%, 55%, 0.15) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}

export default config
