import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../db/sqlite';

export default function RootLayout() {
  useEffect(() => {
    try {
      initDatabase();
    } catch (e) {
      console.error('Failed to init DB', e);
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="alert/[id]" />
    </Stack>
  );
}
