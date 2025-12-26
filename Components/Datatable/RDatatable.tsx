import { TableAction, TableColumn } from "@/src/types/TableColumn";
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  DataTable,
  Text,
  useTheme,
  Avatar,
} from "react-native-paper";

interface RDatatableProps<T> {
  data: T[];
  columns: TableColumn<T>[];

  actions?: TableAction<T>[];
  maxHeight?: number;
}


function RDatatable<T>({
  data,
  columns,
  actions,
  maxHeight = 420,
}: RDatatableProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          <DataTable.Header
            style={[
              styles.header,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            {actions?.length ? (
              <DataTable.Title style={styles.actionCell}>
                <Text style={styles.headerText}>Action</Text>
              </DataTable.Title>
            ) : null}

            {columns.map(col => (
              <DataTable.Title
                key={col.key}
                style={[
                  styles.cell,
                  col.width != null && { minWidth: col.width },
                ]}
              >
                <Text style={styles.headerText}>{col.title}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>

          <ScrollView style={{ maxHeight }}>
            {data.map((item, index) => (
              <DataTable.Row
                key={index}
                style={[
                  styles.row,
                  index % 2 === 0 && {
                    backgroundColor: theme.colors.surfaceVariant,
                  },
                ]}
              >
                {actions?.length ? (
                  <DataTable.Cell style={styles.actionCell}>
                    <View style={styles.actionGroup}>
                      {actions.map(action => (
                        <Pressable
                          key={action.key}
                          onPress={() => action.onPress(item)}
                        >
                          {action.render
                            ? action.render(item)
                            : (
                              <Avatar.Text
                                size={28}
                                label={action.label ?? "A"}
                                color="#fff"
                                style={{
                                  backgroundColor:
                                    theme.colors.primary,
                                }}
                              />
                            )}
                        </Pressable>
                      ))}
                    </View>
                  </DataTable.Cell>
                ) : null}

                {columns.map(col => (
                  <DataTable.Cell
                    key={col.key}
                    style={[
                      styles.cell,
                      col.width != null && { minWidth: col.width },
                    ]}
                  >
                    {col.render
                      ? col.render(item)
                      : (item as any)[col.key]}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

export default RDatatable;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    padding: 8,
    borderRadius: 8,
  },
  header: {
    elevation: 2,
  },
  headerText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  row: {
    minHeight: 48,
  },
  cell: {
    minWidth: 120,
  },
  actionCell: {
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  actionGroup: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},
actionItem: {
  justifyContent: "center",
  alignItems: "center",
},

});