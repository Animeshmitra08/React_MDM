import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Text, TextInput, useTheme } from "react-native-paper";
import RNInput from "@/Components/RNInput";

interface Props {
  data: any;
}

const PlanQuality: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      <Card.Title title="Plant And Quality" />
      <Card.Content>
        <View style={styles.row}>
          <Field
            label="Production Scheduler Profile"
            value={data.productioN_SCHEDULAR_PROFILE}
          />
          <Field label="Total Shelf Life" value={data.totaL_SHELF_LIFE} />
          <Field label="Minimum Shelf Life" value={data.minimuM_SHELF_LIFE} />
          <Field label="Rounding Rule" value={data.roundinG_RULE} />
          <Field label="Is Quality Active" value={data.qualitY_ACTIVE} />
          <Field
            label="Post To Inspection Stcok"
            value={data.posttO_INSPECTION_STOCK}
          />
          <Field
            label="Is QM Procurement"
            value={data.qM_PROCUREMENT_ISACTIVE}
          />
          <Field label="QM Control Key" value={data.qM_CONTROL_KEY} />
        </View>
      </Card.Content>
    </Card>
  );
};

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

export default PlanQuality;
