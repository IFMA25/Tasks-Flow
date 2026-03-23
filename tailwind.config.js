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
            authBg: "url('@/shared/assets/bg/bg-1.png')",
            'border-gradient': 'linear-gradient(to right, #3E0DA8, #5F86EF)',
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
        'bgBase': "#F9FAFB",
        'bgSecondary': '#FFFFFF',
        'borderFocus': '#6E67FF',
        'borderAuth': '#476FFF',
        'danger': '#EF4444',
        'dangerHover': '#DC2626',
        'default': '#D3E0FC',
        'disabled': '#CBD5E1',
        'elevated': '#FFFFFF',
        'hover': '#A9BEFE',
        'intro': '#2C345A',
        'muted': '#94A3B8',
        'mutedText': '#6E76A3',
        'negative': '#F08A8A',
        'placeholder': '#6E6E6E',
        'primary': '#0F172A',
        'primaryText': '#A6ADCF',
        'primaryBg': '#6C7CFF',
        'secondaryBg': '#FFFFFF',
        'primaryTextDark': '#E6E9F5',
        'scrollbarBg': '#192132',
        'sidebarOverlay': 'linear-gradient(180deg, #6CA3FF4D 0%, #B58BFF4D 50%, #64FFE24D 100%)',
        'secondary': '#475569',
        'secondaryText': '#A6ADCF',
        'subtle': '#F0F1F3',
        "success": "#22C55E",
        'toggle': '#283F78',
        'themeSwitch': '#D3E0FC',
        'themeThumb': "url('@/shared/assets/bg/thumb-light.png')",
        'surface': '#C6D3F4',
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
        'listsPink': '#EC4899'
      },
      
      dark: {
        'activeBtn': '#4B5BFF',
        'bgGradient': 'linear-gradient(#161C33, #183BC4)',
        'base': '#FFFFFF',
        'bgBase': "#0B0F1A",
        'bgSecondary': '#11162A',
        'borderFocus': '#6E67FF',
        'danger': '#EF4444',
        'dangerHover': '#DC2626',
        'default': '#2B3D8A',
        'disabled': '#767D9B', 
        'elevated': '#1D2645',
        'hover': '#A9BEFE',
        'intro': '#B7C7F8',
        'muted': '#94A3B8',
        'negative': '#F08A8A',
        'placeholder': '#6E6E6E',
        'primary': '#E6E9F5',
        'primaryText': '#6c7dffff',
        'primaryTextDark': '#E6E9F5',
        'secondaryBg': '#11162A',
        'scrollbarBg': '#192132',
        'sidebarOverlay': "linear-gradient(180deg, #6CA3FF4D 0%, #B58BFF4D 50%, #64FFE24D 100%)",
        'secondary': '#A6ADCF',
        'secondaryText': '#A6ADCF',
        'subtle': '#1B2240',
        'themeSwitch': '#4F5B9D',
        'themeThumb': "url('@/shared/assets/bg/thumb-dark.png')",
        'toggle': '#C6D3F4',
        'surface': '#283F78',
        'warning': '#F59E0B',
        'skeletonBase': '#1D2645',
        'skeletonShimmer': '#2E3B63',
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
