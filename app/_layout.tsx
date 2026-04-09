import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';

export default function RootLayout() {
  const t = useT();

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: AppColors.background },
          headerTintColor: AppColors.primary,
          contentStyle: { backgroundColor: AppColors.background },
          headerTitleStyle: { fontWeight: '600' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="select-line"
          options={{ title: t('selectLine'), presentation: 'modal' }}
        />
        <Stack.Screen
          name="select-station"
          options={{ title: t('selectStation'), presentation: 'modal' }}
        />
        <Stack.Screen
          name="multi-leg-builder"
          options={{ title: t('multiLeg'), presentation: 'modal' }}
        />
        <Stack.Screen
          name="active-journey"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="active-multi-leg"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="share-journey"
          options={{
            title: t('tabRoute') === 'Маршрут' ? 'Поделиться' : 'Share Route',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="scan-journey"
          options={{
            title: t('tabRoute') === 'Маршрут' ? 'Получить маршрут' : 'Receive Route',
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
