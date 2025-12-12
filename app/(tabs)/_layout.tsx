import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, useColorScheme, View } from 'react-native';
import { ActivityIndicator, Icon, MD3DarkTheme, MD3LightTheme, PaperProvider, Snackbar, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../Screens/HomeScreen';
import { StatusBar } from 'expo-status-bar';
import { GunmetalDarkTheme, GunmetalLightTheme } from '@/src/theme/customTheme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? GunmetalDarkTheme : GunmetalLightTheme;


  return (
    <>
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1}}>  
          <HomeScreen />
          {/* <TestScreen/> */}
          <StatusBar style={theme.dark ? "light" : "dark"} />
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
    </>
  );
}