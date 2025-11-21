import { MantineThemeOverride, createTheme } from '@mantine/core';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

const base: MantineThemeOverride = {
  fontFamily: '"Manrope", "Segoe UI", system-ui, -apple-system, sans-serif',
  headings: { fontFamily: '"Space Grotesk", "Manrope", "Segoe UI", sans-serif' },
  defaultRadius: 'md',
};

export const themes: Record<ThemeMode, MantineThemeOverride> = {
  light: createTheme({
    ...base,
    primaryColor: 'indigo',
    colors: {
      indigo: ['#edf2ff', '#dbe4ff', '#bac8ff', '#91a7ff', '#748ffc', '#5c7cfa', '#4c6ef5', '#4263eb', '#3b5bdb', '#364fc7'],
    },
  }),
  dark: createTheme({
    ...base,
    primaryColor: 'teal',
    colors: {
      teal: ['#e6fcf5', '#c3fae8', '#96f2d7', '#63e6be', '#38d9a9', '#20c997', '#12b886', '#0ca678', '#099268', '#087f5b'],
    },
  }),
  'high-contrast': createTheme({
    ...base,
    primaryColor: 'yellow',
    colors: {
      yellow: ['#fff9db', '#fff3bf', '#ffec99', '#ffe066', '#ffd43b', '#fcc419', '#fab005', '#f59f00', '#f08c00', '#e67700'],
      gray: ['#111111', '#1c1c1c', '#2b2b2b', '#353535', '#3f3f3f', '#555555', '#6f6f6f', '#888888', '#b0b0b0', '#d9d9d9'],
    },
    components: {
      Card: {
        styles: {
          root: {
            border: '2px solid #000',
          },
        },
      },
      Button: {
        styles: {
          root: {
            fontWeight: 700,
            letterSpacing: '0.01em',
          },
        },
      },
    },
  }),
};
