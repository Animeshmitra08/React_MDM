import RNInput from "@/Components/RNInput";
import { useData } from "@/Services/dataProvider";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

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
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor : colors.outlineVariant}]}>
      <StatusBar style="dark" />

      {/* Basic */}
        <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
        <Card.Title title="Basic" />
        <Card.Content>
            <View style={styles.row}>
            <View style={styles.col}>
                <RNInput label="Request Code" value={d.reQ_CODE} />
            </View>
            <View style={styles.col}>
                <RNInput label="Material Type" value={d.materialTypeName} />
            </View>

            <View style={styles.col}>
                <RNInput label="Industry Sector" value={d.industrY_SECTOR} />
            </View>
            <View style={styles.col}>
                <RNInput label="Plant" value={d.plant} />
            </View>

            <View style={styles.col}>
                <RNInput label="Storage Location" value={d.storagE_LOCATION} />
            </View>
            <View style={styles.col}>
                <RNInput label="Sales Organization" value={d.saleS_ORG} />
            </View>

            <View style={styles.col}>
                <RNInput label="Distribution Channel" value={d.distributioN_CHANNEL} />
            </View>

            <View style={styles.col}>
                <RNInput label="Old Material Number" value={d.olD_MATERIAL_NUMBER} />
            </View>

            <View style={styles.col}>
                <RNInput label="Base Unit of Measure" value={d.uom} />
            </View>

            <View style={styles.col}>
                <RNInput label="EAL Material Group" value={d.sapMaterialGroup} />
            </View>

            <View style={styles.col}>
                <RNInput label="External Material Group" value={d.externaL_MATERIAL_GROUP} />
            </View>

            <View style={styles.col}>
                <RNInput label="Division" value={d.division} />
            </View>

            <View style={styles.col}>
                <RNInput label="Product Hierarchy" value={d.producT_HIERARCHY} />
            </View>

            <View style={styles.col}>
                <RNInput label="General Item Category" value={d.geN_ITEM_CAT_GROUP} />
            </View>

            <View style={styles.col}>
                <RNInput label="Basic Material" value={d.basiC_MATERIAL} />
            </View>

            <View style={styles.col}>
                <RNInput label="Gross Weight" value={d.grosS_WEIGHT} />
            </View>
            </View>
        </Card.Content>
        </Card>

      {/* Plant & Storage */}
      <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
        <Card.Title title="Plant & Storage" />
        <Card.Content>
            <View style={styles.row}>
            <View style={styles.col}>
                <RNInput label="Plant Code" value={d.plant_code} />
            </View>
            <View style={styles.col}>
                <RNInput label="Plant Name" value={d.plant} />
            </View>

            <View style={styles.col}>
                <RNInput label="Storage Code" value={d.storage_Code} />
            </View>
            <View style={styles.col}>
                <RNInput label="Storage Name" value={d.storage} />
            </View>
            </View>
        </Card.Content>
        </Card>

      
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
});
