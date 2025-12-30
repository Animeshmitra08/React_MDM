import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, useColorScheme, View } from 'react-native';
import { ActivityIndicator, Icon, MD3DarkTheme, MD3LightTheme, PaperProvider, Snackbar, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppLightTheme } from '@/src/theme/customTheme';
import TestScreen from '../Screens/TestScreen';
import LoginComponent from '@/PageComponents/LoginComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useData } from '@/Services/dataProvider';
import DrawerNavigator from '@/navigation/DrawerNavigation';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const { currentUser } = useData();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={AppLightTheme}>
          {currentUser?.userID ? (
            <>
              <DrawerNavigator />
              <StatusBar style="light" />
            </>
          ) : (
            <LoginComponent showCaptcha={false} LogoSource={require("../../assets/images/emamilogo1.jpeg")} />
          )}
      </PaperProvider>
    </GestureHandlerRootView>
  );
}