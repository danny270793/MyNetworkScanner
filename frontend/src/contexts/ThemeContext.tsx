import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  console.log('🎯 useTheme called, context:', context ? 'found' : 'undefined');
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  console.log('🚀 ThemeProvider initialized with theme:', theme, 'resolvedTheme:', resolvedTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    console.log('📱 Loading theme from localStorage...');
    const savedTheme = localStorage.getItem('theme') as Theme;
    console.log('💾 Saved theme:', savedTheme);
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      console.log('✅ Setting saved theme:', savedTheme);
      setTheme(savedTheme);
    } else {
      console.log('🔄 Using default theme: system');
    }
  }, []);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Set initial resolved theme
    if (theme === 'system') {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update resolved theme when theme changes
  useEffect(() => {
    console.log('🔄 Theme resolution:', { theme });
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      console.log('🖥️ System theme detected:', { systemPrefersDark: mediaQuery.matches, resolvedTo: systemTheme });
      setResolvedTheme(systemTheme);
    } else {
      console.log('🎯 Direct theme set:', theme);
      setResolvedTheme(theme);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    console.log('🎨 Theme change:', { theme, resolvedTheme });
    console.log('📄 Document classes before:', root.classList.toString());
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      console.log('✅ Added dark class to document');
    } else {
      root.classList.remove('dark');
      console.log('❌ Removed dark class from document');
    }
    
    console.log('📄 Document classes after:', root.classList.toString());
    console.log('🔍 Dark class present:', root.classList.contains('dark'));
    console.log('🔍 HTML element:', root);
  }, [resolvedTheme]);

  // Save theme to localStorage
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
