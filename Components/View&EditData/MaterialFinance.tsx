import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import RNInput from "@/Components/RNInput";
import { AppMDMThemeColors } from "@/src/theme/color";
import LookupField from "./Fields";
import { useData } from "@/Services/dataProvider";

interface Props {
  data: any;
}

const normalize = (s: string) => s.replace(/\s+/g, "").toLowerCase();
const Finance: React.FC<Props> = ({ data }) => {
  const { lookUpData } = useData();
  const lookupMap = useMemo(() => {
    const map = new Map<string, string>();
    lookUpData?.forEach((item) => {
      const display = item.name
        ? `${item.name} - ${item.description}`
        : item.description;

      map.set(`${normalize(item.documentName)}|${String(item.id)}`, display);
    });

    return map;
  }, [lookUpData]);

  const { colors } = useTheme();
  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      {/* Custom Centered Title */}
      <View style={styles.titleContainer}>
        <Text variant="titleMedium" style={styles.centeredTitle}>
          Finance
        </Text>
      </View>

      {/* Divider between title and content */}
      <Divider style={styles.divider} />

      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <LookupField
            label="Valuation Class"
            value={data.valuatioN_CLASS}
            lookupMap={lookupMap}
            lookupKey="VALUATION CLASS"
          />
          <LookupField
            label="Price Control"
            value={data.pricE_CONTROL}
            lookupMap={lookupMap}
          />
          <Field label="Price Unit" value={data.pricE_UNIT} />
          <Field label="Moving AvgPrice" value={data.movinG_AVG_PRICE} />
          <Field label="Price" value={data.price} />
          <Field label="Do Not Cost" value={""} />
          <Field label="Is Costed By Quality Structure" value={""} />
          <LookupField
            label="Overhead Group"
            value={data.overheaD_GROUP}
            lookupMap={lookupMap}
            lookupKey="OVERHEAD GROUP"
          />
          <LookupField
            label="Variance Key"
            value={data.variancE_KEY}
            lookupMap={lookupMap}
            lookupKey="VARIATION KEY"
          />
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
  card: { marginBottom: 12, borderRadius: 12, overflow: "hidden" },
  content: {
    paddingTop: 12,
  },
  row: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  col: { width: "50%", paddingHorizontal: 6, marginBottom: 8 },
  titleContainer: {
    paddingVertical: 12,
    alignItems: "center", // Centers horizontally
    justifyContent: "center",
  },
  centeredTitle: {
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginHorizontal: 12, // Optional: makes divider slightly shorter than card width
  },
});

export default Finance;
