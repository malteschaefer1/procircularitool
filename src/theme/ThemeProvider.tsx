import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Global } from '@emotion/react';
import { Notifications } from '@mantine/notifications';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeMode, themes } from './theme';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: (mode?: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const toggle = (next?: ThemeMode) => {
    if (next) {
      setMode(next);
      return;
    }
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => themes[mode], [mode]);
  const colorScheme = mode === 'high-contrast' ? 'light' : mode;
  const backgrounds: Record<ThemeMode, { bg: string; fg: string }> = {
    light: {
      bg: 'radial-gradient(circle at 20% 20%, rgba(100, 116, 255, 0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.08), transparent 25%), linear-gradient(180deg, #f8fafc 0%, #f3f4f6 40%, #f8fafc 100%)',
      fg: '#0f172a',
    },
    dark: {
      bg: 'radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.15), transparent 25%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.12), transparent 25%), linear-gradient(180deg, #0b1220 0%, #0f172a 40%, #0b1220 100%)',
      fg: '#e2e8f0',
    },
    'high-contrast': {
      bg: '#ffffff',
      fg: '#000000',
    },
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle }}>
      <ColorSchemeScript defaultColorScheme={colorScheme} />
      <MantineProvider
        defaultColorScheme={colorScheme}
        theme={theme}
        withCssVariables
      >
        <Global
          styles={{
            ':root': {
              '--app-background': backgrounds[mode].bg,
              '--app-foreground': backgrounds[mode].fg,
            },
            'body, .mantine-AppShell-root': {
              background: backgrounds[mode].bg,
              color: backgrounds[mode].fg,
            },
            '.mantine-AppShell-header': {
              backdropFilter: 'blur(8px)',
              background:
                mode === 'dark'
                  ? 'rgba(10, 14, 26, 0.85)'
                  : mode === 'high-contrast'
                    ? '#000'
                    : 'rgba(255,255,255,0.75)',
              color: mode === 'high-contrast' ? '#fff' : 'inherit',
            },
            '.mantine-Stepper-stepLabel': {
              color: mode === 'high-contrast' ? '#000' : backgrounds[mode].fg,
            },
            '.mantine-Card-root': {
              color: backgrounds[mode].fg,
            },
          }}
        />
        <Notifications position="top-right" limit={3} />
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return ctx;
};
