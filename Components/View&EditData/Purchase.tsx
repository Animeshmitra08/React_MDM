import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Text, TextInput, useTheme } from "react-native-paper";
import RNInput from "@/Components/RNInput";

interface Props {
  data: any;
}

const PurchaseInfoCard: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      <Card.Title title="Purchase & MRP" />
      <Card.Content>
        <View style={styles.row}>
          <Field label="Purchase Group" value={data.purchasE_GROUP} />
          <Field label="Tax Indicator" value={data.taX_INDICATOR} />
          <Field label="MRP Type" value={data.mrP_TYPE} />
          <Field label="MRP Controller" value={data.mrP_CONTROLLER} />
          <Field label="Lot Size" value={data.loT_SIZE} />
          <Field label="Procurement Type" value={data.procuremenT_TYPE} />
          <Field
            label="Inhouse Production Time"
            value={data.inhousE_PROD_TIME}
          />
          <Field
            label="Planned Delivery Time(day's)"
            value={data.planneD_DELIVERY_TIME}
          />
          <Field
            label="GR Processing Time(day's)"
            value={data.gR_PROCESSING_TIME}
          />
          <Field
            label="Scheduling Margin Key"
            value={data.schedulinG_MARGIN_KEY}
          />
          <Field
            label="Period Indicator"
            value={data.perioD_INDICATOR_SHELF_LIFE}
          />
          <Field
            label="Planing Strategy Group"
            value={data.plaN_STRATEGY_GROUP}
          />
          <Field
            label="Dependent Requirements"
            value={data.dependenT_REQUIREMENTS}
          />
          <Field
            label="Production Scheduler"
            value={data.productioN_SCHEDULER}
          />
          <Field label="Forecast Model" value={data.foreCast_Model} />
          <Field label="Safety Stock" value={data.safetY_STOCK} />
          <Field
            label="Minimum Safety Stock"
            value={data.minimuM_SAFETY_STOCK}
          />
          <Field
            label="Maximum Safety Stock"
            value={data.maximuM_SAFETY_STOCK}
          />
          <Field label="Reorder Point" value={data.rE_ORDER_POINT} />
          <Field
            label="Production Storage Location"
            value={data.production_STLO}
          />
          <Field label="Costing Lot Size" value={data.costing_Lot_Size} />
        </View>
      </Card.Content>
    </Card>
  );
};

export default PurchaseInfoCard;

/* 🔹 Reusable field */
const Field = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.col}>
    <RNInput label={label} value={String(value ?? "")} disabled />
  </View>
);

const styles = StyleSheet.create({
  card: { marginBottom: 12, borderRadius: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  col: { width: "50%", paddingHorizontal: 6, marginBottom: 8 },

  attributeBox: {
    backgroundColor: "#e2e3ebff",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  chip: { backgroundColor: "#cfcfcfff", alignSelf: "flex-start" },
  attributeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  attributeCol: { width: "50%", paddingHorizontal: 6, marginBottom: 10 },
  attributeLabel: { fontSize: 12, color: "#555", marginBottom: 4 },
  attributeInput: { backgroundColor: "#fff", height: 40 },
});
