import { ColorSchemeScript, MantineProvider } from '@mantine/core';
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

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle }}>
      <ColorSchemeScript defaultColorScheme={colorScheme} />
      <MantineProvider
        defaultColorScheme={colorScheme}
        theme={theme}
        withCssVariables
      >
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
