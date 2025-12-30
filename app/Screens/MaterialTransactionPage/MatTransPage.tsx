import RNInput from "@/Components/RNInput";
import BasicInfoCard from "@/Components/View&EditData/Basic";
import PurchaseInfoCard from "@/Components/View&EditData/Purchase";
import SalesInfoCard from "@/Components/View&EditData/Sales";
import { useData } from "@/Services/dataProvider";
import { AttributeData, AttributeDataSource } from "@/src/types/MaterialTransactions";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Chip, Text, TextInput, useTheme } from "react-native-paper";

function MatTransPage() {
  const { trnsId } = useLocalSearchParams<{ trnsId?: string }>();
  const { materialTransData } = useData();
  const { colors } = useTheme();

  const filteredTransData = useMemo(() => {
    if (!trnsId || !materialTransData?.length) return null;

    return materialTransData.find(
      (item) => String(item.trN_ID) === String(trnsId)
    );
  }, [trnsId, materialTransData]);

  if (!filteredTransData) {
    return <Text style={styles.notFound}>Transaction not found</Text>;
  }

  const d = filteredTransData;

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor : "#dadadaff"}]}>
      <StatusBar style="dark" />

      {/* Basic */}
        <BasicInfoCard data={filteredTransData}/>

      {/* sales */}
      <SalesInfoCard data={filteredTransData} />

      {/* purchase */}
      <PurchaseInfoCard data={filteredTransData}/>

      
    </ScrollView>
  );
}

export default MatTransPage;


const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  notFound: {
    padding: 16,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6, // balance padding
  },
  col: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
  attributeRow: {
    marginTop: 10,
  },
  attributeLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  attributeInput: {
    backgroundColor: "#fff",
    height: 40,
  },
  attributeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6, // balance padding
  },

  attributeCol: {
    width: "50%", // 🔹 2-column grid
    paddingHorizontal: 6,
    marginBottom: 10,
  },
});
