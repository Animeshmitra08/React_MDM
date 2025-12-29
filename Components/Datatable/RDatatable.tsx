import { TableAction, TableColumn } from "@/src/types/TableColumn";
import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native";
import { DataTable, Text, useTheme, Avatar, Button, TextInput } from "react-native-paper";

interface RDatatableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  maxHeight?: number;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
}

const COLORS = {
  primary: "#0CA79D",
  secondary: "#EDA700",
  approval: "#008000",
  rejected: "#FF0000",
  white: "#FFFFFF",
};

function RDatatable<T>({
  data,
  columns,
  actions,
  maxHeight = 420,
  searchable = false,
  searchKeys = [],
  searchPlaceholder = "Search...",
  loading = false,
  pagination = false,
  pageSize = 5,
}: RDatatableProps<T>) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const ACTION_WIDTH = 90;

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredData = useMemo(() => {
    if (!searchable || !searchText.trim() || !searchKeys.length) return data;

    const query = searchText.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(query);
      })
    );
  }, [data, searchText, searchKeys, searchable]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize, pagination]);

  /* Reset page on search */
  React.useEffect(() => {
    setPage(0);
  }, [searchText]);

  const computedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      width: col.width ?? getColumnWidth(col.title, data, String(col.key)),
    }));
  }, [columns, data]);

  return (
    <View style={styles.container}>
      {searchable && (
        <TextInput
          mode="outlined"
          placeholder={searchPlaceholder}
          value={searchText}
          onChangeText={setSearchText}
          style={{
            marginBottom: 8,
            backgroundColor: AppMDMThemeColors.white,
            height: 46,
          }}
          left={
            <TextInput.Icon icon="magnify" color={AppMDMThemeColors.primary} />
          }
          outlineColor={AppMDMThemeColors.primary}
        />
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          {/* Header */}
          <DataTable.Header
            style={[
              styles.header,
              {
                backgroundColor: COLORS.secondary,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              },
            ]}
          >
            {actions?.length ? (
              <DataTable.Title style={styles.actionCell}>
                <Text style={styles.headerText}>Action</Text>
              </DataTable.Title>
            ) : null}

            {computedColumns.map((col) => (
              <DataTable.Title
                key={col.key}
                style={[
                  styles.cell,
                  {
                    width: col.width,
                    flex: 0,
                  },
                ]}
              >
                <Text style={styles.headerText}>{col.title}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {paginatedData.length === 0 && !loading && (
            <Text style={{ padding: 16 }}>No data available.</Text>
          )}
          {loading && <Text style={{ padding: 16 }}>Loading...</Text>}

          <ScrollView style={{ maxHeight }}>
            {paginatedData.map((item, index) => (
              <DataTable.Row
                key={index}
                style={[
                  styles.row,
                  // Optional alternating row colors
                  // index % 2 === 0 && { backgroundColor: "#f9f9f9" },
                ]}
              >
                {actions?.length ? (
                  <DataTable.Cell style={styles.actionCell}>
                    <View style={styles.actionGroup}>
                      {actions.map((action) => (
                        <Pressable key={action.key} onPress={() => action.onPress(item)}>
                          {action.render ? (
                            action.render(item)
                          ) : (
                            <Avatar.Text
                              size={28}
                              label={action.label ?? "A"}
                              color={COLORS.white}
                              style={{ backgroundColor: COLORS.primary }}
                            />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </DataTable.Cell>
                ) : null}

                  {computedColumns.map((col) => (
                    <DataTable.Cell
                      key={col.key}
                      style={[
                        styles.cell,
                        {
                          width: col.width,
                          flex: 0, //
                        },
                      ]}
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))}
          </ScrollView>

          {pagination && totalPages > 1 && (
            <View style={styles.pagination}>
              <Text style={styles.pageInfo}>
                Total: {data.length} / Showing: {paginatedData.length}
              </Text>
              <Button
                mode="outlined"
                onPress={() => setPage((p) => p - 1)}
                disabled={page === 0}
                style={styles.pageButton}
                textColor={COLORS.primary}
              >
                Prev
              </Button>

              <Text style={styles.pageInfo}>
                Page {page + 1} / {totalPages}
              </Text>

              <Button
                mode="outlined"
                onPress={() => setPage((p) => p + 1)}
                disabled={page + 1 >= totalPages}
                style={styles.pageButton}
                textColor={COLORS.primary}
              >
                Next
                {/* <TextInput.Icon
                  icon={"arrow-right"}
                  color={AppMDMThemeColors.white}
                /> */}
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default RDatatable;

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  row: ViewStyle;
  cell: ViewStyle;
  actionCell: ViewStyle;
  actionGroup: ViewStyle;
  actionItem: ViewStyle;
  pagination: ViewStyle;
  pageInfo: TextStyle;
  pageButton: ViewStyle;
  disabledButton: ViewStyle;
}>({
  container: {
    backgroundColor: "#f4f4f4",
    padding: 8,
    borderRadius: 8,
  },
  header: {
    elevation: 2,
  },
  headerText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 13,
  },
  row: {
    minHeight: 48,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.secondary,
  },
  cell: {
    paddingHorizontal: 12,
    justifyContent: "center",
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
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    gap: 12,
  },
  pageInfo: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
  },
  pageButton: {
    borderRadius: 20,
    minWidth: 36,
    height: 36,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
});