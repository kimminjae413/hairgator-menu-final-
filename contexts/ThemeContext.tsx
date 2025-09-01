
import React, { createContext, useState, useEffect, useMemo, useContext, ReactNode } from 'react';
import { themes, Theme } from '../themes';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themes: Record<string, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string' && themes[storedPrefs]) {
      return storedPrefs;
    }
  }
  // 기본 테마 (첫 번째 테마)
  return Object.keys(themes)[0];
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // 기존 테마 클래스 모두 제거
    Object.values(themes).forEach(t => root.classList.remove(t.id));
    
    // 현재 테마 클래스 추가
    if (themes[theme]) {
        root.classList.add(themes[theme].id);
        localStorage.setItem('theme', theme);
    }

  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    themes
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
