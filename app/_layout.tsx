import { AlertProvider } from '@/Services/AlertContext';
import { DataProvider } from '@/Services/dataProvider';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {

  return (
    <>
    <AlertProvider>
    <DataProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="Screens/MaterialTransactionPage/MatTransPage"
            options={{ title: "Material Transaction" }}
          />
        </Stack>
      </ThemeProvider>
    </DataProvider>
    </AlertProvider>
    </>
  );
}
