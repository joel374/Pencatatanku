// PENCATATANKU/ThemeContext.tsx

import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeName, themes, ColorScheme } from './styles/themes';

const THEME_STORAGE_KEY = 'user_theme_preference';

interface ThemeContextProps {
  themeName: ThemeName;
  colors: ColorScheme;
  toggleTheme: () => void;
  setTheme: (name: ThemeName) => void;
}

// 1. Buat Context dengan nilai default Light Mode
const defaultColors = themes.light;
export const ThemeContext = createContext<ThemeContextProps>({
  themeName: 'light',
  colors: defaultColors,
  toggleTheme: () => {},
  setTheme: () => {},
});

// 2. Provider yang akan membungkus seluruh aplikasi
export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' atau 'dark' dari OS
  const [themeName, setThemeName] = useState<ThemeName>(systemColorScheme || 'light');

  // Muat preferensi tema dari AsyncStorage saat aplikasi dimulai
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
        if (storedTheme) {
          setThemeName(storedTheme);
        } else if (systemColorScheme) {
          // Jika belum ada di storage, gunakan preferensi sistem
          setThemeName(systemColorScheme);
        }
      } catch (e) {
        console.error("Gagal memuat tema:", e);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  // Fungsi untuk mengubah tema dan menyimpannya ke AsyncStorage
  const saveAndSetTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  // Toggle antara light dan dark
  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    saveAndSetTheme(newTheme);
  };

  const currentColors = useMemo(() => themes[themeName], [themeName]);

  const contextValue = {
    themeName,
    colors: currentColors,
    toggleTheme,
    setTheme: saveAndSetTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};