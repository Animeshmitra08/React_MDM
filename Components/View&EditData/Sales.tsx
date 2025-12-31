import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Chip, Divider, Text, TextInput, useTheme } from "react-native-paper";
import RNInput from "@/Components/RNInput";
import { useData } from "@/Services/dataProvider";
import LookupField from "./Fields";

interface Props {
  data: any;
}

const normalize = (s: string) =>
  s.replace(/\s+/g, "").toLowerCase();

const SalesInfoCard: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  const { lookUpData } = useData();

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
          Sales
        </Text>
      </View>

      {/* Divider between title and content */}
      <Divider style={styles.divider} />

      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <LookupField label="Sales Unit" value={data.saleS_UNIT} lookupMap={lookupMap} />
          <LookupField
            label="Tax Classicfication JGST "
            value={data.taX_CLASSIFICATION_JGST}
            lookupMap={lookupMap}
            lookupKey="TAX CLASSIFICATION JGST"
          />
          <LookupField
            label="Tax Classicfication JTC1"
            value={data.taX_CLASSIFICATION_JTC1}
            lookupMap={lookupMap}
            lookupKey="TAX CLASSIFICATION JTC1"
          />
          <LookupField label="Material Price Group" value={data.maT_PRICE_GROUP} lookupMap={lookupMap} lookupKey="MATERIAL PRICING GRP"/>
          <LookupField
            label="Account Assignment Group"
            value={data.assignmenT_GROUP}
            lookupMap={lookupMap}
            lookupKey="ACCOUNT ASSG GRP"
          />
          <LookupField label="Availability Check" value={data.availabilitY_CHECK} lookupMap={lookupMap}/>
          <LookupField label="Instant Group" value={data.instanT_GROUP} lookupMap={lookupMap}/>
          <LookupField
            label="Transportation Group"
            value={data.transportatioN_GROUP}
            lookupMap={lookupMap}
          />
          <LookupField label="Loading Group" value={data.loadinG_GROUP} lookupMap={lookupMap}/>
          <LookupField label="Profit Center" value={data.profiT_CENTER} lookupMap={lookupMap}/>
          <LookupField label="Control Code" value={data.controL_CODE} lookupMap={lookupMap}/>
          <LookupField label="Material Group 1" value={data.materiaL_GROUP1} lookupMap={lookupMap}/>
          <LookupField label="Material Group 2" value={data.materiaL_GROUP2} lookupMap={lookupMap}/>
          <LookupField label="Material Group 3" value={data.materiaL_GROUP3} lookupMap={lookupMap} />
          <LookupField label="Material Group 4" value={data.materiaL_GROUP4} lookupMap={lookupMap}/>
          <LookupField label="Material Group 5" value={data.materiaL_GROUP5} lookupMap={lookupMap}/>
        </View>
      </Card.Content>
    </Card>
  );
};

export default SalesInfoCard;

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
});
