import { AppMDMThemeColors } from "@/src/theme/color";
import { TableAction, TableColumn } from "@/src/types/TableColumn";
import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  DataTable,
  Text,
  useTheme,
  Avatar,
  Button,
  TextInput,
} from "react-native-paper";

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

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredData = useMemo(() => {
    if (!searchable || !searchText.trim() || !searchKeys.length) {
      return data;
    }

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

  return (
    <View style={styles.container}>
      {searchable && (
        <TextInput
          mode="outlined"
          placeholder={searchPlaceholder}
          value={searchText}
          onChangeText={setSearchText}
          style={{ marginBottom: 8 }}
          left={<TextInput.Icon icon="magnify" />}
        />
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          <DataTable.Header
            style={[
              styles.header,
              {
                backgroundColor: AppMDMThemeColors.second,
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

            {columns.map((col) => (
              <DataTable.Title
                key={col.key}
                style={[
                  styles.cell,
                  col.width != null && { minWidth: col.width },
                  col.marginLeft != null && { marginLeft: col.marginLeft },
                ]}
              >
                <Text style={styles.headerText}>{col.title}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>
          {paginatedData.length === 0 && (
            <Text style={{ padding: 16 }}>No data available.</Text>
          )}
          {loading && <Text style={{ padding: 16 }}>Loading...</Text>}
          <ScrollView style={{ maxHeight }}>
            {paginatedData?.map((item, index) => (
              <DataTable.Row
                key={index}
                style={[
                  styles.row,
                  // index % 2 === 0 && {
                  //   backgroundColor: theme.colors.surfaceVariant,
                  // },
                ]}
              >
                {actions?.length ? (
                  <DataTable.Cell style={styles.actionCell}>
                    <View style={styles.actionGroup}>
                      {actions.map((action) => (
                        <Pressable
                          key={action.key}
                          onPress={() => action.onPress(item)}
                        >
                          {action.render ? (
                            action.render(item)
                          ) : (
                            <Avatar.Text
                              size={28}
                              label={action.label ?? "A"}
                              color="#fff"
                              style={{
                                backgroundColor: theme.colors.primary,
                              }}
                            />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </DataTable.Cell>
                ) : null}

                {columns.map((col) => (
                  <DataTable.Cell
                    key={col.key}
                    style={[
                      styles.cell,
                      col.width != null && { minWidth: col.width },
                      col.marginLeft != null && { marginLeft: col.marginLeft },
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
              <Text>
                Total : {data?.length}/ Pagination : {paginatedData?.length}
              </Text>
              <Button
                disabled={page === 0}
                onPress={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              <Text>
                Page {page + 1} / {totalPages}
              </Text>

              <Button
                disabled={page + 1 >= totalPages}
                onPress={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </View>
          )}
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
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: AppMDMThemeColors.second,
    borderBottomColor: AppMDMThemeColors.second,
    borderBottomWidth: 2,
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
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  pageInfo: {
    fontSize: 13,
    fontWeight: "600",
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
