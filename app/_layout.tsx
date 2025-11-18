// PENCATATANKU/app/_layout.tsx

import { Stack } from 'expo-router';
import { ThemeProvider } from '../ThemeContext';

export default function RootLayout() {
  return (
    // Bungkus seluruh navigasi dengan ThemeProvider
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Tambahkan screen lain di sini jika ada */}
      </Stack>
    </ThemeProvider>
  );
}