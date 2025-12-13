import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, useColorScheme, View } from 'react-native';
import { ActivityIndicator, Icon, MD3DarkTheme, MD3LightTheme, PaperProvider, Snackbar, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GunmetalDarkTheme, GunmetalLightTheme } from '@/src/theme/customTheme';
import TestScreen from '../Screens/TestScreen';
import LoginComponent from '@/PageComponents/LoginComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useData } from '@/Services/dataProvider';
import DrawerNavigator from '@/navigation/DrawerNavigation';
import { NavigationContainer } from "@react-navigation/native";

export default function TabsLayout() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? GunmetalDarkTheme : GunmetalLightTheme;
  const { currentUser } = useData();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        {/* <NavigationContainer> */}
          {currentUser?.userID ? (
            <>
              <DrawerNavigator />
              <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            </>
          ) : (
            <LoginComponent showCaptcha={false} />
          )}
        {/* </NavigationContainer> */}
      </PaperProvider>
    </GestureHandlerRootView>
  );
}