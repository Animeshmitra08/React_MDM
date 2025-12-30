import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Text, TextInput, useTheme } from "react-native-paper";
import RNInput from "@/Components/RNInput";

interface Props {
  data: any;
}

const SalesInfoCard: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      <Card.Title title="Sales" />
      <Card.Content>
        <View style={styles.row}>
          <Field label="Sales Unit" value={data.saleS_UNIT} />
          <Field label="Tax Classicfication JGST " value={data.taX_CLASSIFICATION_JGST} />
          <Field label="Tax Classicfication JTC1" value={data.taX_CLASSIFICATION_JTC1} />
          <Field label="Material Price Group" value={data.maT_PRICE_GROUP} />
          <Field label="Account Assignment Group" value={data.assignmenT_GROUP} />
          <Field label="Availability Check" value={data.availabilitY_CHECK} />
          <Field label="Instant Group" value={data.instanT_GROUP} />
          <Field label="Transportation Group" value={data.transportatioN_GROUP} />
          <Field label="Loading Group" value={data.loadinG_GROUP} />
          <Field label="Profit Center" value={data.profiT_CENTER} />
          <Field label="Control Code" value={data.controL_CODE} />
          <Field label="Material Group 1" value={data.materiaL_GROUP1} />
          <Field label="Material Group 2" value={data.materiaL_GROUP2} />
          <Field label="Material Group 3" value={data.materiaL_GROUP3} />
          <Field label="Material Group 4" value={data.materiaL_GROUP4} />
          <Field label="Material Group 5" value={data.materiaL_GROUP5} />
        </View>
      </Card.Content>
    </Card>
  );
};

export default SalesInfoCard;

/* 🔹 Reusable field */
const Field = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.col}>
    <RNInput label={label} value={String(value ?? "")} disabled/>
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
  attributeGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  attributeCol: { width: "50%", paddingHorizontal: 6, marginBottom: 10 },
  attributeLabel: { fontSize: 12, color: "#555", marginBottom: 4 },
  attributeInput: { backgroundColor: "#fff", height: 40 },
});