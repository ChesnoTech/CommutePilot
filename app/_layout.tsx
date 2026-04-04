import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppColors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: AppColors.background },
          headerTintColor: AppColors.text,
          contentStyle: { backgroundColor: AppColors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="select-line"
          options={{ title: 'Select Line', presentation: 'modal' }}
        />
        <Stack.Screen
          name="select-station"
          options={{ title: 'Select Station', presentation: 'modal' }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
