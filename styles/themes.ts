// PENCATATANKU/styles/themes.ts

import { ColorSchemeName } from 'react-native';

export type ThemeName = 'light' | 'dark';

export interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  cardBackground: string;
  text: string;
  subText: string;
  income: string;
  expense: string;
  shadow: string;
}

export const lightColors: ColorScheme = {
  primary: '#007bff',        // Biru untuk tombol utama
  secondary: '#6c757d',      // Abu-abu
  background: '#f5f5f5',     // Latar belakang utama (sangat terang)
  cardBackground: '#ffffff', // Latar belakang kartu/input (putih bersih)
  text: '#333333',          // Teks utama (hitam gelap)
  subText: '#888888',        // Teks sekunder
  income: '#28a745',         // Hijau
  expense: '#dc3545',        // Merah
  shadow: 'rgba(0,0,0,0.1)', // Bayangan lembut
};

export const darkColors: ColorScheme = {
  primary: '#4da6ff',        // Biru lebih terang
  secondary: '#aaaaaa',
  background: '#121212',     // Latar belakang utama (gelap)
  cardBackground: '#1f1f1f', // Latar belakang kartu/input (sedikit lebih terang dari background)
  text: '#ffffff',           // Teks utama (putih)
  subText: '#bbbbbb',        // Teks sekunder
  income: '#38b755',         // Hijau
  expense: '#ff6347',        // Merah
  shadow: 'rgba(255,255,255,0.1)', // Bayangan lembut
};

export const themes = {
  light: lightColors,
  dark: darkColors,
};

// Fungsi helper untuk mendapatkan warna berdasarkan tema
export const getThemeColors = (theme: ThemeName): ColorScheme => {
  return themes[theme];
};