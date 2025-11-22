import { MantineTheme, MantineThemeOverride, createTheme } from '@mantine/core';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

const base: MantineThemeOverride = {
  fontFamily: '"Manrope", "Segoe UI", system-ui, -apple-system, sans-serif',
  headings: { fontFamily: '"Space Grotesk", "Manrope", "Segoe UI", sans-serif' },
  defaultRadius: 'md',
  primaryColor: 'indigo',
};

export const themes: Record<ThemeMode, MantineThemeOverride> = {
  light: createTheme({
    ...base,
    primaryColor: 'indigo',
    colors: {
      indigo: ['#edf2ff', '#dbe4ff', '#bac8ff', '#91a7ff', '#748ffc', '#5c7cfa', '#4c6ef5', '#4263eb', '#3b5bdb', '#364fc7'],
    },
    components: {
      Card: {
        styles: (theme: MantineTheme) => ({
          root: {
            backgroundColor: theme.white,
            borderColor: theme.colors.gray[3],
          },
        }),
      },
      Paper: {
        styles: (theme: MantineTheme) => ({
          root: {
            backgroundColor: theme.white,
          },
        }),
      },
    },
  }),
  dark: createTheme({
    ...base,
    primaryColor: 'teal',
    colors: {
      teal: ['#e6fcf5', '#c3fae8', '#96f2d7', '#63e6be', '#38d9a9', '#20c997', '#12b886', '#0ca678', '#099268', '#087f5b'],
    },
    components: {
      Card: {
        styles: (theme: MantineTheme) => ({
          root: {
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderColor: theme.colors.dark[4],
            color: theme.colors.gray[2],
          },
        }),
      },
      Paper: {
        styles: (theme: MantineTheme) => ({
          root: {
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: theme.colors.gray[2],
          },
        }),
      },
      AppShell: {
        styles: {
          header: {
            backgroundColor: 'rgba(8, 15, 30, 0.9)',
          },
          main: {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  }),
  'high-contrast': createTheme({
    ...base,
    primaryColor: 'dark',
    colors: {
      dark: ['#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#868e96', '#495057', '#343a40', '#212529'],
      gray: ['#000000', '#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#999999', '#bbbbbb'],
    },
    components: {
      Card: {
        styles: {
          root: {
            border: '2px solid #000',
            backgroundColor: '#fff',
            color: '#000',
          },
        },
      },
      Button: {
        styles: {
          root: {
            fontWeight: 700,
            letterSpacing: '0.01em',
            backgroundColor: '#000',
            color: '#fff',
            border: '2px solid #000',
            '&:hover': {
              backgroundColor: '#111',
              color: '#fff',
            },
          },
        },
      },
      SegmentedControl: {
        styles: {
          root: {
            border: '2px solid #000',
          },
          label: {
            color: '#000',
          },
        },
      },
      Paper: {
        styles: {
          root: {
            backgroundColor: '#fff',
            color: '#000',
          },
        },
      },
      Stepper: {
        styles: {
          stepLabel: {
            color: '#000',
          },
          stepDescription: {
            color: '#111',
          },
          stepIcon: {
            backgroundColor: '#fff',
            color: '#000',
            border: '2px solid #000',
          },
        },
      },
    },
  }),
};
