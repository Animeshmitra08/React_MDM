// import { AppMDMThemeColors } from "@/src/theme/color";
// import { TableAction, TableColumn } from "@/src/types/TableColumn";
// import React, { useMemo, useState } from "react";
// import { View, ScrollView, StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native";
// import { DataTable, Text, useTheme, Avatar, Button, TextInput } from "react-native-paper";

// interface RDatatableProps<T> {
//   data: T[];
//   columns: TableColumn<T>[];
//   actions?: TableAction<T>[];
//   maxHeight?: number;
//   searchable?: boolean;
//   searchKeys?: (keyof T)[];
//   searchPlaceholder?: string;
//   pagination?: boolean;
//   pageSize?: number;
//   loading?: boolean;
// }

// function getColumnWidth(title: string, data: any[], key: string): number {
//   const titleLength = title ? String(title).length : 0;
//   const maxContentLength = data.reduce((max, item) => {
//     try {
//       const value = item?.[key];
//       const len = value === null || value === undefined ? 0 : String(value).length;
//       return Math.max(max, len);
//     } catch {
//       return max;
//     }
//   }, titleLength);

//   const charPixel = 8; // approximate average pixel width per character
//   const horizontalPadding = 24; // padding for cell
//   const minWidth = 80;
//   const maxWidth = 400;

//   const calculated = Math.min(maxWidth, Math.max(minWidth, maxContentLength * charPixel + horizontalPadding));
//   return calculated;
// }

// function RDatatable<T>({
//   data,
//   columns,
//   actions,
//   maxHeight = 420,
//   searchable = false,
//   searchKeys = [],
//   searchPlaceholder = "Search...",
//   loading = false,
//   pagination = false,
//   pageSize = 5,
// }: RDatatableProps<T>) {
//   const theme = useTheme();
//   const [searchText, setSearchText] = useState("");
//   const [page, setPage] = useState(0);
//   const ACTION_WIDTH = 90;

//   /* ---------------- SEARCH FILTER ---------------- */
//   const filteredData = useMemo(() => {
//     if (!searchable || !searchText.trim() || !searchKeys.length) return data;

//     const query = searchText.toLowerCase();
//     return data.filter((item) =>
//       searchKeys.some((key) => {
//         const value = item[key];
//         return value && String(value).toLowerCase().includes(query);
//       })
//     );
//   }, [data, searchText, searchKeys, searchable]);

//   /* ---------------- PAGINATION ---------------- */
//   const totalPages = Math.ceil(filteredData.length / pageSize);

//   const paginatedData = useMemo(() => {
//     if (!pagination) return filteredData;
//     const start = page * pageSize;
//     return filteredData.slice(start, start + pageSize);
//   }, [filteredData, page, pageSize, pagination]);

//   /* Reset page on search */
//   React.useEffect(() => {
//     setPage(0);
//   }, [searchText]);

//   const computedColumns = useMemo(() => {
//     return columns.map((col) => ({
//       ...col,
//       width: col.width ?? getColumnWidth(col.title, data, String(col.key)),
//     }));
//   }, [columns, data]);

//   return (
//     <View style={styles.container}>
//       {searchable && (
//         <TextInput
//           mode="outlined"
//           placeholder={searchPlaceholder}
//           value={searchText}
//           onChangeText={setSearchText}
//           style={{
//             marginBottom: 8,
//             backgroundColor: AppMDMThemeColors.white,
//             height: 46,
//           }}
//           left={
//             <TextInput.Icon icon="magnify" color={AppMDMThemeColors.primary} />
//           }
//           outlineColor={AppMDMThemeColors.primary}
//         />
//       )}

//       <ScrollView horizontal showsHorizontalScrollIndicator>
//         <View>
//           {/* Header */}
//           <DataTable.Header
//             style={[
//               styles.header,
//               {
//                 backgroundColor: theme.colors.secondary,
//                 borderTopLeftRadius: 16,
//                 borderTopRightRadius: 16,
//               },
//             ]}
//           >
//             {actions?.length ? (
//               <DataTable.Title style={styles.actionCell}>
//                 <Text style={styles.headerText}>Action</Text>
//               </DataTable.Title>
//             ) : null}

//             {computedColumns.map((col) => (
//               <DataTable.Title
//                 key={col.key}
//                 style={[
//                   styles.cell,
//                   {
//                     width: col.width,
//                     flex: 0,
//                   },
//                 ]}
//               >
//                 <Text style={[styles.headerText, {color: "#000000", fontWeight: 800}]}>{col.title}</Text>
//               </DataTable.Title>
//             ))}
//           </DataTable.Header>

//           {paginatedData.length === 0 && !loading && (
//             <Text style={{ padding: 16 }}>No data available.</Text>
//           )}
//           {loading && <Text style={{ padding: 16 }}>Loading...</Text>}

//           <ScrollView style={{ maxHeight }}>
//             {paginatedData.map((item, index) => (
//               <DataTable.Row
//                 key={index}
//                 style={[
//                   styles.row,
//                   // Optional alternating row colors
//                   // index % 2 === 0 && { backgroundColor: "#f9f9f9" },
//                 ]}
//               >
//                 {actions?.length ? (
//                   <DataTable.Cell style={styles.actionCell}>
//                     <View style={styles.actionGroup}>
//                       {actions.map((action) => (
//                         <Pressable key={action.key} onPress={() => action.onPress(item)}>
//                           {action.render ? (
//                             action.render(item)
//                           ) : (
//                             <Avatar.Text
//                               size={28}
//                               label={action.label ?? "A"}
//                             />
//                           )}
//                         </Pressable>
//                       ))}
//                     </View>
//                   </DataTable.Cell>
//                 ) : null}

//                   {computedColumns.map((col) => (
//                     <DataTable.Cell
//                       key={col.key}
//                       style={[
//                         styles.cell,
//                         {
//                           width: col.width,
//                           flex: 0,
//                           alignItems: "center", // important
//                           justifyContent: "center"
//                         },
//                       ]}
//                     >
//                       <Text
//                         style={{ flexWrap: "wrap" }}
//                         numberOfLines={undefined}   // remove truncation
//                       >
//                         {col.render ? col.render(item) : String((item as any)[col.key] ?? "")}
//                       </Text>
//                     </DataTable.Cell>
//                   ))}
//                 </DataTable.Row>
//               ))}
//           </ScrollView>

//           {pagination && totalPages > 1 && (
//             <View style={styles.pagination}>
//               <Text style={styles.pageInfo}>
//                 Total: {data.length} / Showing: {paginatedData.length}
//               </Text>
//               <Button
//                 mode="outlined"
//                 onPress={() => setPage((p) => p - 1)}
//                 disabled={page === 0}
//                 style={styles.pageButton}
//               >
//                 Prev
//               </Button>

//               <Text style={styles.pageInfo}>
//                 Page {page + 1} / {totalPages}
//               </Text>

//               <Button
//                 mode="outlined"
//                 onPress={() => setPage((p) => p + 1)}
//                 disabled={page + 1 >= totalPages}
//                 style={styles.pageButton}
//               >
//                 Next
//                 {/* <TextInput.Icon
//                   icon={"arrow-right"}
//                   color={AppMDMThemeColors.white}
//                 /> */}
//               </Button>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// export default RDatatable;

// const styles = StyleSheet.create<{
//   container: ViewStyle;
//   header: ViewStyle;
//   headerText: TextStyle;
//   row: ViewStyle;
//   cell: ViewStyle;
//   actionCell: ViewStyle;
//   actionGroup: ViewStyle;
//   actionItem: ViewStyle;
//   pagination: ViewStyle;
//   pageInfo: TextStyle;
//   pageButton: ViewStyle;
//   disabledButton: ViewStyle;
// }>({
//   container: {
//     backgroundColor: "#f4f4f4",
//     padding: 8,
//     borderRadius: 8,
//   },
//   header: {
//     elevation: 2,
//   },
//   headerText: {
//     fontWeight: "600",
//     fontSize: 13,
//   },
//   row: {
//     minHeight: 48,
//     borderLeftWidth: 2,
//     borderRightWidth: 2,
//     borderBottomWidth: 2,
//   },
//   cell: {
//     paddingHorizontal: 12,
//     justifyContent: "center",
//   },
//   actionCell: {
//     minWidth: 80,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   actionGroup: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   actionItem: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   pagination: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderTopWidth: 1,
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//     gap: 12,
//   },
//   pageInfo: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#374151",
//   },
//   pageButton: {
//     borderRadius: 20,
//     minWidth: 36,
//     height: 36,
//     justifyContent: "center",
//   },
//   disabledButton: {
//     opacity: 0.4,
//   },
// });

import { AppMDMThemeColors } from "@/src/theme/color";
import { TableAction, TableColumn } from "@/src/types/TableColumn";
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
  Animated,
} from "react-native";
import {
  DataTable,
  Text,
  useTheme,
  Avatar,
  Button,
  TextInput,
  Surface,
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

/**
 * Loading Skeleton Component
 * Mimics the table rows to prevent layout shift
 */
const TableSkeleton = ({
  rows,
  columns,
  hasActions,
}: {
  rows: number;
  columns: any[];
  hasActions: boolean;
}) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <DataTable.Row key={`skeleton-row-${i}`} style={styles.row}>
          {hasActions && (
            <DataTable.Cell style={styles.actionHeaderCell}>
              <Animated.View style={[styles.skeletonCircle, { opacity }]} />
            </DataTable.Cell>
          )}
          {columns.map((col, j) => (
            <DataTable.Cell
              key={`skeleton-col-${j}`}
              style={[styles.cell, { width: col.width, flex: 0 }]}
            >
              <Animated.View
                style={[styles.skeletonBar, { width: "80%", opacity }]}
              />
            </DataTable.Cell>
          ))}
        </DataTable.Row>
      ))}
    </>
  );
};

function RDatatable<T>({
  data,
  columns,
  actions,
  maxHeight = 450,
  searchable = false,
  searchKeys = [],
  searchPlaceholder = "Search records...",
  loading = false,
  pagination = true,
  pageSize = 10,
}: RDatatableProps<T>) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    if (!searchable || !searchText.trim() || !searchKeys.length) return data;
    const query = searchText.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [data, searchText, searchKeys, searchable]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    return filteredData.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredData, page, pageSize, pagination]);

  useEffect(() => setPage(0), [searchText]);

  const computedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      width: col.width ?? 190, // Fallback width
    }));
  }, [columns]);

  return (
    <Surface style={styles.surface} elevation={1}>
      {searchable && (
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder={searchPlaceholder}
            value={searchText}
            onChangeText={setSearchText}
            dense
            style={styles.searchInput}
            left={
              <TextInput.Icon
                icon="magnify"
                size={20}
                color={theme.colors.primary}
              />
            }
            outlineStyle={{ borderRadius: 8 }}
          />
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableMinWidth}>
          <DataTable.Header
            style={[
              styles.header,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            {actions?.length ? (
              <DataTable.Title style={styles.actionHeaderCell}>
                <Text style={styles.headerText}>ACTIONS</Text>
              </DataTable.Title>
            ) : null}

            {computedColumns.map((col) => (
              <DataTable.Title
                key={String(col.key)}
                style={[styles.cell, { width: col.width, flex: 0 }]}
              >
                <Text style={styles.headerText} numberOfLines={3}>
                  {col.title.toUpperCase()}
                </Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>

          <ScrollView style={{ maxHeight }}>
            {loading ? (
              <TableSkeleton
                rows={pageSize}
                columns={computedColumns}
                hasActions={!!actions?.length}
              />
            ) : paginatedData.length === 0 ? (
              <View style={styles.statusContainer}>
                <Text variant="bodyMedium">No records found</Text>
              </View>
            ) : (
              paginatedData.map((item, index) => (
                <DataTable.Row key={index} style={styles.row}>
                  {actions?.length ? (
                    <DataTable.Cell style={styles.actionHeaderCell}>
                      <View style={styles.actionGroup}>
                        {actions.map((action) => (
                          <Pressable
                            key={action.key}
                            onPress={() => action.onPress(item)}
                            hitSlop={8}
                          >
                            {action.render ? (
                              action.render(item)
                            ) : (
                              <Avatar.Icon
                                size={28}
                                icon="dots-vertical"
                                style={{ backgroundColor: "transparent" }}
                              />
                            )}
                          </Pressable>
                        ))}
                      </View>
                    </DataTable.Cell>
                  ) : null}

                  {computedColumns.map((col) => (
                    <DataTable.Cell
                      key={String(col.key)}
                      style={[styles.cell, { width: col.width, flex: 0 }]}
                    >
                      <Text variant="bodyMedium" numberOfLines={3}>
                        {col.render
                          ? col.render(item)
                          : String(item[col.key as keyof T] ?? "-")}
                      </Text>
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {pagination && !loading && totalPages > 0 && (
        <View style={styles.paginationFooter}>
          <Text style={styles.footerInfo}>{filteredData.length} total</Text>
          <View style={styles.pageControls}>
            <Button
              compact
              mode="text"
              disabled={page === 0}
              onPress={() => setPage((p) => p - 1)}
              icon="chevron-left"
            >
              Prev
            </Button>
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {page + 1} / {totalPages}
              </Text>
            </View>
            <Button
              compact
              mode="text"
              contentStyle={{ flexDirection: "row-reverse" }}
              disabled={page + 1 >= totalPages}
              onPress={() => setPage((p) => p + 1)}
              icon="chevron-right"
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginVertical: 8,
    marginHorizontal: 6,
  },
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: { height: 40, backgroundColor: "#fff" },
  tableMinWidth: { minWidth: "100%" },
  header: { height: 52, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  headerText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#666",
  },
  row: { borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0", minHeight: 60 },
  cell: { paddingHorizontal: 16 },
  actionHeaderCell: { width: 90, flex: 0, marginRight: 5 },
  actionGroup: { flexDirection: "row", gap: 8 },
  statusContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerInfo: { fontSize: 12, color: "#888" },
  pageControls: { flexDirection: "row", alignItems: "center" },
  pageIndicator: {
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    height: 28,
    justifyContent: "center",
  },
  pageText: { fontSize: 12, fontWeight: "600" },
  // Skeleton Styles
  skeletonBar: { height: 12, backgroundColor: "#E1E9EE", borderRadius: 4 },
  skeletonCircle: {
    height: 24,
    width: 24,
    backgroundColor: "#E1E9EE",
    borderRadius: 12,
  },
});

export default RDatatable;
