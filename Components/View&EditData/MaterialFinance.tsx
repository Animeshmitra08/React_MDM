import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Card,
  Chip,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import RNInput from "@/Components/RNInput";
import { AppMDMThemeColors } from "@/src/theme/color";

interface Props {
  data: any;
}

const Finance: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      <Card.Title title="Finance" />
      <Card.Content>
        <View style={styles.row}>
          <Field label="Valuation Class" value={data.valuatioN_CLASS} />
          <Field label="Price Control" value={data.pricE_CONTROL} />
          <Field label="Price Unit" value={data.pricE_UNIT} />
          <Field label="Moving AvgPrice" value={data.movinG_AVG_PRICE} />
          <Field label="Price" value={data.price} />
          <Field label="Do Not Cost" value={""} />
          <Field label="Is Costed By Quality Structure" value={""} />
          <Field label="Overhead Group" value={data.overheaD_GROUP} />
          <Field label="Variance Key" value={data.variancE_KEY} />
          <Field label="Material Origin" value={data.matericaL_ORIGIN} />
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
  button: {
    marginTop: 8,
    backgroundColor: AppMDMThemeColors.primary,
    color: AppMDMThemeColors.white,
  },
});

export default Finance;
