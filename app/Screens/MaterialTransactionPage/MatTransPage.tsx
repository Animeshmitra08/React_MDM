import RNInput from "@/Components/RNInput";
import BasicInfoCard from "@/Components/View&EditData/Basic";
import Finance from "@/Components/View&EditData/MaterialFinance";
import PlanQuality from "@/Components/View&EditData/PlantQuality";
import PurchaseInfoCard from "@/Components/View&EditData/Purchase";
import SalesInfoCard from "@/Components/View&EditData/Sales";
import { useData } from "@/Services/dataProvider";
import {
  AttributeData,
  AttributeDataSource,
} from "@/src/types/MaterialTransactions";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Chip, Text, TextInput, useTheme } from "react-native-paper";

export default function MatTransPage() {
  const { trnsId } = useLocalSearchParams<{ trnsId?: string }>();
  const { materialTransData } = useData();
  const { colors } = useTheme();

  const filteredTransData = useMemo(() => {
    if (!trnsId || !materialTransData?.length) return null;

    return materialTransData.find(
      (item) => String(item.trN_ID) === String(trnsId)
    );
  }, [trnsId, materialTransData]);

  // Handle data not found state
  if (!filteredTransData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFound}>Transaction not found</Text>
      </View>
    );
  }

  const d = filteredTransData;

  return (
    <View style={styles.screenWrapper}>
      <StatusBar style="dark" />

      {/* STICKY HEADER: Placed outside ScrollView */}
      <View style={[styles.stickyHeader, { backgroundColor: colors.surface }]}>
        <Text style={styles.headerTitle}>MDM Request Number</Text>
        <Chip icon="identifier" style={styles.headerChip}>{d.reQ_CODE}</Chip>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Basic Info */}
        <BasicInfoCard data={filteredTransData}/>

        {/* Sales Info */}
        <SalesInfoCard data={filteredTransData} />

        {/* Purchase Info */}
        <PurchaseInfoCard data={filteredTransData}/>

        <PlanQuality data={filteredTransData} />

        <Finance data={filteredTransData} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1, 
    backgroundColor: "#dadadaff"
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Added missing notFound style
  notFound: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  stickyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Adds a slight shadow to look like it's floating
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  headerChip: {
    backgroundColor: '#e0e0e0',
  },
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  // ... other styles
});
