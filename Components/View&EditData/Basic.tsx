import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Divider, Text, TextInput, useTheme } from "react-native-paper";
import RNInput from "@/Components/RNInput";
import { AttributeData } from "@/src/types/MaterialTransactions";
import { useData } from "@/Services/dataProvider";
import LookUpFields from "./Fields";

interface Props {
  data: any;
}

const normalize = (s: string) =>
  s.replace(/\s+/g, "").toLowerCase();

const BasicInfoCard: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  const { lookUpData } = useData();

  const attributes = useMemo<AttributeData>(() => {
    if (Array.isArray(data.attribute_Data)) return data.attribute_Data;
    try {
      return JSON.parse(data.attribute_Data ?? "[]");
    } catch {
      return [];
    }
  }, [data.attribute_Data]);

  const validAttributes = attributes.filter(
    (a) => a.Value !== null && a.Value !== ""
  );

  const lookupMap = useMemo(() => {
    const map = new Map<string, string>();

    lookUpData?.forEach(item => {
      const display =
        item.name
          ? `${item.name} - ${item.description}`
          : item.description;
          
      map.set(
        `${normalize(item.documentName)}|${String(item.id)}`,
        display
      );
    });

    return map;
  }, [lookUpData]);
  

  return (
    <Card style={[styles.card, { backgroundColor: colors.onPrimary }]}>
      {/* Custom Centered Title */}
      <View style={styles.titleContainer}>
        <Text variant="titleMedium" style={styles.centeredTitle}>
          Basic
        </Text>
      </View>

      {/* Divider between title and content */}
      <Divider style={styles.divider} />

      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <LookUpFields label="Reference Number" value={data.reQ_CODE} />
          <LookUpFields label="Material Type" value={data.materialTypeName} />
          <LookUpFields label="Industry Sector" value={data.industrY_SECTOR} lookupMap={lookupMap}/>
          <LookUpFields label="Plant" value={data.plant} lookupMap={lookupMap}/>
          <LookUpFields label="Storage Location" value={data.storagE_LOCATION} lookupMap={lookupMap}/>
          <LookUpFields label="Sales Organisation" value={data.saleS_ORG} lookupMap={lookupMap}/>
          <LookUpFields
            label="Distribution Channel"
            value={data.distributioN_CHANNEL}
            lookupMap={lookupMap}
          />
          <LookUpFields label="Old Material Number" value={data.olD_MATERIAL_NUMBER} />
          <LookUpFields label="Base Unit of Measure" value={data.uom} lookupKey="UOM" lookupMap={lookupMap}/>
          <LookUpFields label="EAL Material Group" value={data.sapMaterialGroup} lookupKey="SAP MATERIALGROUP" lookupMap={lookupMap}/>
          <LookUpFields label="External Material Group" value={data.externaL_MATERIAL_GROUP} lookupMap={lookupMap}/>
          <LookUpFields label="Division" value={data.division} lookupMap={lookupMap}/>
          <LookUpFields label="Product Hierarchy" value={data.producT_HIERARCHY} lookupMap={lookupMap}/>
          <LookUpFields
            label="General Item Category"
            value={data.geN_ITEM_CAT_GROUP}
            lookupMap={lookupMap}
          />
          <LookUpFields label="Basic Material" value={data.basiC_MATERIAL} lookupMap={lookupMap}/>
          <LookUpFields label="Gross Weight" value={data.grosS_WEIGHT} lookupMap={lookupMap}/>
          <LookUpFields label="Weight Unit" value={data.weighT_UNIT} lookupMap={lookupMap}/>
          <LookUpFields label="Net Weight" value={data.neT_WEIGHT} lookupMap={lookupMap}/>
          <LookUpFields label="Volume" value={data.volume} lookupMap={lookupMap}/>
          <LookUpFields label="Volume Unit" value={data.volume_Unit} lookupMap={lookupMap}/>
          <LookUpFields
            label="Material Packaging Group"
            value={data.material_Group_Packaging}
            lookupMap={lookupMap}
            lookupKey="Packaging Materials"
          />
          <LookUpFields label="Document Number" value={data.document_Number} lookupMap={lookupMap}/>
          <LookUpFields label="Department" value={data.departmenT_ID} lookupMap={lookupMap}/>
          <LookUpFields label="MDM Material Group" value={data.materiaL_GROUP} lookupMap={lookupMap} lookupKey="MATERIAL GROUP"/>
          <LookUpFields
            label="MDM Material Sub Group"
            value={data.materiaL_SUBGROUP}
            lookupMap={lookupMap}
            lookupKey="MATERIAL SUB GROUP"
          />
        </View>

        <RNInput
          label="Material Description"
          multiline
          numberOfLines={3}
          value={data.lonG_TEXT}
          disabled
        />
        <RNInput
          label="Material Short Description"
          multiline
          numberOfLines={3}
          value={data.materiaL_SHORT_DESCRIPTION}
          disabled
        />
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
                <View
                  key={`${item.Attribute}-${i}`}
                  style={styles.attributeCol}
                >
                  <Text style={styles.attributeLabel}>{item.Attribute}</Text>
                  <TextInput
                    mode="outlined"
                    value={String(item.Value ?? "")}
                    dense
                    multiline
                    textAlign="left"
                    selection={{ start: 0, end: 0 }}
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
  },

  attributeBox: {
    backgroundColor: "#e2e3ebff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    // marginTop: 4,
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
