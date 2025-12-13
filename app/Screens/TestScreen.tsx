import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { dashboardAPI } from "@/src/services/Api";
import { useData } from "@/Services/dataProvider";

const TestScreen = () => {
  const theme = useTheme();

  const { currentUser } = useData();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <ScrollView style={{flex:1}}>
        <Text>
          {currentUser?.name}
        </Text>
      </ScrollView>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 22,
  },
});