import React from "react";
import { View, StyleSheet } from "react-native";
import DateTimeComponent from "../DateTimeComponent";
import EDropdown from "../EDropdown";
import { Button } from "react-native-paper";

type Filter1Props = {
  fromDate: Date | null;
  toDate: Date | null;
  today: Date;

  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;

  plant: string;
  onPlantChange: (value: string) => void;

  onApply: () => void;
};

function Filter1({
  fromDate,
  toDate,
  today,
  onFromDateChange,
  onToDateChange,
  plant,
  onPlantChange,
  onApply,
}: Filter1Props) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.cell}>
          <DateTimeComponent
            label="From Date"
            date={fromDate}
            type="date"
            setDate={onFromDateChange}
            maximumDate={today}
          />
        </View>

        <View style={styles.cell}>
          <DateTimeComponent
            label="To Date"
            date={toDate}
            type="date"
            setDate={onToDateChange}
            disabled={!fromDate}
            minimumDate={fromDate ?? undefined}
            maximumDate={today}
          />
        </View>

        <View style={styles.cell}>
          <EDropdown
            label="Plant"
            data={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
            value={plant}
            onChange={onPlantChange}
          />
        </View>
      </View>

      <Button
        mode="contained"
        onPress={onApply}
        disabled={!fromDate || !toDate}
        style={styles.button}
      >
        Filter
      </Button>
    </View>
  );
}

export default Filter1;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  cell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});