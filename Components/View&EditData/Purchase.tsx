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

const PurchaseInfoCard: React.FC<Props> = ({ data }) => {
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
          Purchase & MRP
        </Text>
      </View>

      {/* Divider between title and content */}
      <Divider style={styles.divider} />

      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <LookupField label="Purchase Group" value={data.purchasE_GROUP} lookupMap={lookupMap}/>
          <LookupField label="Tax Indicator" value={data.taX_INDICATOR} lookupMap={lookupMap}/>
          <LookupField label="MRP Type" value={data.mrP_TYPE} lookupMap={lookupMap}/>
          <LookupField label="MRP Controller" value={data.mrP_CONTROLLER} lookupMap={lookupMap} />
          <LookupField label="Lot Size" value={data.loT_SIZE} lookupMap={lookupMap} />
          <LookupField label="Procurement Type" value={data.procuremenT_TYPE} lookupMap={lookupMap} />
          <LookupField
            label="Inhouse Production Time"
            value={data.inhousE_PROD_TIME}
            lookupMap={lookupMap}
          />
          <LookupField
            label="Planned Delivery Time(day's)"
            value={data.planneD_DELIVERY_TIME}
            lookupMap={lookupMap}
          />
          <LookupField
            label="GR Processing Time(day's)"
            value={data.gR_PROCESSING_TIME}
            lookupMap={lookupMap}
          />
          <LookupField
            label="Scheduling Margin Key"
            value={data.schedulinG_MARGIN_KEY}
            lookupMap={lookupMap}
          />
          <LookupField
            label="Period Indicator"
            value={data.perioD_INDICATOR_SHELF_LIFE}
            lookupMap={lookupMap}
          />
          <LookupField
            label="Planing Strategy Group"
            value={data.plaN_STRATEGY_GROUP}
            lookupMap={lookupMap}
            lookupKey="PLANNING STRATEGY GRP "
          />
          <LookupField
            label="Dependent Requirements"
            value={data.dependenT_REQUIREMENTS}
            lookupMap={lookupMap}
            lookupKey="DEPENDENT REQ"
          />
          <LookupField
            label="Production Scheduler"
            value={data.productioN_SCHEDULER}
            lookupMap={lookupMap}
            lookupKey="Production SCH"
          />
          <LookupField label="Forecast Model" value={data.foreCast_Model} lookupMap={lookupMap} lookupKey="ForeCast_Model"/>
          <LookupField label="Safety Stock" value={data.safetY_STOCK} lookupMap={lookupMap} />
          <LookupField
            label="Minimum Safety Stock"
            value={data.minimuM_SAFETY_STOCK}
            lookupMap={lookupMap}
          />
          <LookupField
            label="Maximum Safety Stock"
            value={data.maximuM_SAFETY_STOCK}
            lookupMap={lookupMap}
          />
          <LookupField label="Reorder Point" value={data.rE_ORDER_POINT} lookupMap={lookupMap} />
          <LookupField
            label="Production Storage Location"
            value={data.production_STLO}
            lookupMap={lookupMap}
          />
          <LookupField label="Costing Lot Size" value={data.costing_Lot_Size} lookupMap={lookupMap}/>
        </View>
      </Card.Content>
    </Card>
  );
};

export default PurchaseInfoCard;

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
