import plugin from 'tailwindcss/plugin';

import { createThemes } from './src/features/theme';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
          maxWidth: {
              'screen-2xl': '1920px',
          },
          fontSize: {
            'fluid-h1': 'clamp(2rem, 3vw + 1.5rem, 4.5rem)',
            'fluid-h2': 'clamp(1.8rem, 2.7vw + 0.9rem, 3rem)',
            'fluid-h3': 'clamp(1.5rem, 1.2vw + 0.5rem, 2rem)',
          },
          padding:{
            'fluid-p': 'clamp(1rem, 1.2vw + 0.6rem, 3rem)'
          },
          fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
              rubik: ['Rubik', 'sans-serif']
          },
          spacing: {
              18: '4.5rem',
              88: '22rem',
          },
          backgroundImage: {
            switch: "var(--color-bgGradient)",
            thumb: "var(--color-themeThumb)",
            sidebarOverlay: "var(--color-sidebarOverlay)",
            'border-gradient': 'linear-gradient(to right, #3E0DA8, #5F86EF)',
            'btn-gradient': 'linear-gradient(#6366F1, #8B5CF6)',
            'btn-disabled': 'linear-gradient(#6366F196, #ab8afa96)',
          },
          boxShadow: {
            dropdown: "0px 1px 6px 0px rgba(0,0,0,0.15)",
            toast: "0px 4px 12px 0px #0000001A",
            btnHover: "0px 0px 5px 0px #3E4FFF",
            tabHover: "0px 0px 7px 0px #1F5AFF",
          },
          textShadow: {
            btnHover: '0 0 7px #1F5AFF',
            tabHover: '0 0 4px #1F5AFF',
          },
           dropShadow: {
            btnHover: '0 0 7px #1F5AFF',
            tabHover: '0 0 4px #1F5AFF',
            glow: [
              '0 0 1.26px currentColor',
              '0 0 2.52px currentColor'
            ],
            'glow-white': [
              '0 0 1.26px rgba(255, 255, 255, 1)',
              '0 0 2.52px rgba(255, 255, 255, 1)'
            ]
          },
          keyframes: {
            shimmer: {
              '0%': { backgroundPosition: '-1000px 0' },
              '100%': { backgroundPosition: '1000px 0' }
            }
          },
          animation: {
            'shimmer-pulse': 'shimmer 3s infinite linear, pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)'
          }
        },
    },
    plugins: [
    createThemes({
      light: {
        'activeBtn': '#4B5BFF',
        'bgGradient': 'linear-gradient(#422CD0, #7592FF)',
        'base': '#FFFFFF',
        'borders': '#a9a9e7ff',
        'bgCards': '#fff',
        'bgBase': '#F8FAFC',
        'borderFocus': '#6E67FF',
        'borderAuth': '#476FFF',
        'danger': '#EF4444',
        'dangerHover': '#DC2626',
        'default': '#D3E0FC',
        'disabled': '#CBD5E1',
        'elevated': '#FFFFFF',
        'hover': '#A9BEFE',
        'intro': '#16161F',
        'loaderColor': '#4843b0ff',
        'muted': '#94A3B8',
        'mutedText': '#11162A',
        'negative': '#B45353',
        'placeholder': '#6E6E6E',
        'primary': '#0F172A',
        'primaryText': '#A6ADCF',
        'primaryBg': '#6C7CFF',
        'secondaryBg': '#FFFFFF',
        'primaryTextDark': '#6366F1',
        'positive': '#3F8F6B',
        'secondary': '#475569',
        'secondaryText': '#CBD5E1',
        'subtle': '#475569',
        "success": "#22C55E",
        'title': '#F8FAFC',
        'text': '#94A3B8',
        'textLight': '#CBD5E1',
        'toggle': '#283F78',
        'themeSwitch': '#D3E0FC',
        'themeThumb': "url('@/shared/assets/bg/thumb-light.png')",
        'surface': '#C6D3F4',
        'sidebarBg': '#FFFFFF',
        'warning': '#F59E0B',
        'skeletonBase': '#E2E8F0',
        'skeletonShimmer': '#F1F5F9',
        'listsBlue': '#3B82F6',
        'listsPurple': '#8B5CF6',
        'listsCyan': '#14B8A6',
        'listsGreen': '#22C55E',
        'listsYellow': '#FACC15',
        'listsOrange': '#FB923C',
        'listsRed': '#EF4444',
        'listsPink': '#EC4899',
        'logoText': '#111118',
        'tableHeader': '#e6eaeeff'
      },
      
      dark: {
        'activeBtn': '#4B5BFF',
        'bgGradient': 'linear-gradient(#161C33, #383850)',
        'base': '#FFFFFF',
        'borders': '#383850',
        'bgCards': '#16161F',
        'bgBase': "#111118",
        'borderFocus': '#6E67FF',
        'danger': '#EF4444',
        'dangerHover': '#DC2626',
        'default': '#50529eff',
        'disabled': '#767D9B', 
        'elevated': '#1D2645',
        'hover': '#A9BEFE',
        'intro': '#16161F',
        'loaderColor': '#c1c5fcff',
        'listsBlue': '#3B82F6',
        'listsPurple': '#8B5CF6',
        'listsGreen': '#22C55E',
        'logoText': '#F8FAFC',
        'muted': '#94A3B8',
        'mutedText': '#dcdeecff',
        'negative': '#B45353',
        'placeholder': '#6E6E6E',
        'primary': '#E6E9F5',
        'primaryBg': '#2B3D8A',
        'primaryText': '#6c7dffff',
        'primaryTextDark': '#6366F1',
        'positive': '#3F8F6B',
        'secondaryBg': '#11162A',
        'sidebarBg': '#16161F',
        'secondary': '#A6ADCF',
        'secondaryText': '#A6ADCF',
        'subtle': '#475569',
        'themeSwitch': '#D3E0FC',
        'title': '#F8FAFC',
        'text': '#94A3B8',
        'textLight': '#CBD5E1',
        'themeThumb': "url('@/shared/assets/bg/thumb-dark.png')",
        'toggle': '#C6D3F4',
        'surface': '#5a5a9a',
        'warning': '#F59E0B',
        'skeletonBase': '#1d1e45ff',
        'skeletonShimmer': '#2E3B63',
        'tableHeader': '#1d1d2b'
      },
    }),
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
