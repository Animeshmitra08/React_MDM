import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Divider, Text, TextInput, useTheme } from "react-native-paper";
import RNInput from "@/Components/RNInput";

interface Props {
  data: any;
}

const PlantQuality: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      {/* Custom Centered Title */}
      <View style={styles.titleContainer}>
        <Text variant="titleMedium" style={styles.centeredTitle}>
          Plant & Quality
        </Text>
      </View>

      {/* Divider between title and content */}
      <Divider style={styles.divider} />

      <Card.Content style={styles.content}>
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
  card: { marginBottom: 12, borderRadius: 12, overflow: "hidden" },
  content: {
    paddingTop: 12,
  },
  row: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  col: { width: "50%", paddingHorizontal: 6, marginBottom: 8 },
  titleContainer: {
    paddingVertical: 12,
    alignItems: 'center', // Centers horizontally
    justifyContent: 'center',
  },
  centeredTitle: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginHorizontal: 12, // Optional: makes divider slightly shorter than card width
  }
});

export default PlantQuality;
