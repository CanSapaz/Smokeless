import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeType, Theme, lightTheme, darkTheme } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_type');
      if (savedTheme) {
        setThemeType(savedTheme as ThemeType);
      } else {
        setThemeType(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newTheme);
    try {
      await AsyncStorage.setItem('@theme_type', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = themeType === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark: themeType === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
