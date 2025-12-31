import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Text, TextInput, useTheme } from "react-native-paper";
import RNInput from "@/Components/RNInput";
import { AttributeData } from "@/src/types/MaterialTransactions";

interface Props {
  data: any;
}

const BasicInfoCard: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();

  const attributes = useMemo<AttributeData>(() => {
    if (Array.isArray(data.attribute_Data)) return data.attribute_Data;
    try {
      return JSON.parse(data.attribute_Data ?? "[]");
    } catch {
      return [];
    }
  }, [data.attribute_Data]);

  const validAttributes = attributes.filter(
    a => a.Value !== null && a.Value !== ""
  );

  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      <Card.Title title="Basic" />
      <Card.Content>
        <View style={styles.row}>
          <Field label="Request Code" value={data.reQ_CODE} />
          <Field label="Material Type" value={data.materialTypeName} />
          <Field label="Industry Sector" value={data.industrY_SECTOR} />
          <Field label="Plant" value={data.plant} />
          <Field label="Storage Location" value={data.storagE_LOCATION} />
          <Field label="Sales Organization" value={data.saleS_ORG} />
          <Field label="Distribution Channel" value={data.distributioN_CHANNEL} />
          <Field label="Old Material Number" value={data.olD_MATERIAL_NUMBER} />
          <Field label="Base Unit of Measure" value={data.uom} />
          <Field label="Division" value={data.division} />
          <Field label="Product Hierarchy" value={data.producT_HIERARCHY} />
          <Field label="General Item Category" value={data.geN_ITEM_CAT_GROUP} />
          <Field label="Basic Material" value={data.basiC_MATERIAL} />
          <Field label="Gross Weight" value={data.grosS_WEIGHT} />
          <Field label="Weight Unit" value={data.weighT_UNIT} />
          <Field label="Net Weight" value={data.neT_WEIGHT} />
          <Field label="Volume" value={data.volume} />
          <Field label="Volume Unit" value={data.volume_Unit} />
          <Field label="Material Packaging Group" value={data.material_Group_Packaging} />
          <Field label="Document Number" value={data.document_Number} />
          <Field label="Department" value={data.departmenT_ID} />
          <Field label="MDM Material Group" value={data.materiaL_GROUP} />
          <Field label="MDM Material Sub Group" value={data.materiaL_SUBGROUP} />
        </View>

        <RNInput label="Material Description" multiline numberOfLines={3} value={data.lonG_TEXT} disabled/>
        <RNInput label="Material Short Description" multiline numberOfLines={3} value={data.materiaL_SHORT_DESCRIPTION} disabled/>
        <RNInput
          label="Material Long Description"
          value={data.materiaL_LONG_DESCRIPTION}
          multiline
          numberOfLines={4}
          disabled
        />

        {validAttributes.length > 0 && (
          <View style={styles.attributeBox}>
            <Chip icon="radioactive" style={styles.chip}>
              Attributes
            </Chip>

            <View style={styles.attributeGrid}>
              {attributes.map((item, i) => (
                <View key={`${item.Attribute}-${i}`} style={styles.attributeCol}>
                  <Text style={styles.attributeLabel}>{item.Attribute}</Text>
                  <TextInput
                    mode="outlined"
                    value={String(item.Value ?? "")}
                    dense
                    multiline
                    numberOfLines={2}
                    editable={false}
                    style={styles.attributeInput}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default BasicInfoCard;

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
    marginBottom: 16
    // marginTop: 4,
  },
  chip: { backgroundColor: "#cfcfcfff", alignSelf: "flex-start" },
  attributeGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  attributeCol: { width: "50%", paddingHorizontal: 6, marginBottom: 10 },
  attributeLabel: { fontSize: 12, color: "#555", marginBottom: 4 },
  attributeInput: { backgroundColor: "#fff", height: 40 },
});