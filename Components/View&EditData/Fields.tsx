import { StyleSheet, View } from "react-native";
import RNInput from "../RNInput";
import { DocumentItem } from "@/src/types/LookUp";
import { useMemo } from "react";

const normalize = (s: string) =>
  s.replace(/[\s_/-]+/g, "").toLowerCase();


interface LookupFieldProps {
  label: string;
  lookupKey?: string;
  value: any;
  lookupMap?: Map<string, string>;
}

const LookupField: React.FC<LookupFieldProps> = ({
  label,
  lookupKey,
  value,
  lookupMap,
}) => {
  const displayValue = useMemo(() => {
    if (!lookupMap || value === null || value === undefined) {
        return String(value ?? "");
    }

    // 1️⃣ PRIORITY: lookupKey (backend truth)
    if (lookupKey) {
        const key = `${normalize(lookupKey)}|${String(value)}`;
        const byLookupKey = lookupMap.get(key);
        if (byLookupKey) return byLookupKey;
    }

    // 2️⃣ FALLBACK: label (UI convenience)
    const labelKey = `${normalize(label)}|${String(value)}`;
    const byLabel = lookupMap.get(labelKey);
    if (byLabel) return byLabel;

    // 3️⃣ FINAL fallback
    return String(value);
    }, [label, lookupKey, value, lookupMap]);

  console.log({
  label,
  lookupKey,
  value,
  labelKey: `${normalize(label)}|${String(value)}`,
  lookupKeyKey: lookupKey
    ? `${normalize(lookupKey)}|${String(value)}`
    : null,
  hasLabel: lookupMap?.has(
    `${normalize(label)}|${String(value)}`
  ),
  hasLookupKey: lookupKey
    ? lookupMap?.has(
        `${normalize(lookupKey)}|${String(value)}`
      )
    : false,
});

  

  return (
    <View style={{ width: "50%", paddingHorizontal: 6, marginBottom: 8 }}>
      <RNInput label={label} value={displayValue} disabled />
    </View>
  );
};

export default LookupField;