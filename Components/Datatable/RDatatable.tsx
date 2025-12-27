import { AppMDMThemeColors } from "@/src/theme/color";
import { TableAction, TableColumn } from "@/src/types/TableColumn";
import { replace } from "expo-router/build/global-state/routing";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import {
  DataTable,
  Text,
  useTheme,
  Avatar,
  Button,
  TextInput,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const ACTION_WIDTH = 90;

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
          {paginatedData.length === 0 && !loading && <NoDataComponent />}
          {loading && <LoadingComponent />}

          <ScrollView style={{ maxHeight }}>
            {!loading &&
              paginatedData?.map((item, index) => (
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
          {!loading && pagination && totalPages > 1 && (
            <View style={styles.pagination}>
              {/* <Text style={styles.pageInfo}>
                Total/Pagination : {data?.length}/{paginatedData?.length}
              </Text> */}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "800",
                  borderRadius: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: AppMDMThemeColors.second,
                }}
              >
                {" "}
                {paginatedData?.length}/{data?.length}
              </Text>
              <Button
                mode="contained"
                disabled={page === 0}
                onPress={() => setPage((p) => p - 1)}
                icon="arrow-left"
                // style={[
                //   styles.navBtn,
                //   {
                //     backgroundColor:
                //       page === 0
                //         ? AppMDMThemeColors.Grey
                //         : AppMDMThemeColors.approval,
                //   },
                // ]}
                // contentStyle={styles.navBtnContent}
                // labelStyle={styles.navBtnLabel}
                style={{
                  marginLeft: 12,
                }}
              >
                Prev
              </Button>

              <Text style={[styles.pageInfo, { marginHorizontal: 6 }]}>
                Page {page + 1} / {totalPages}
              </Text>

              <Button
                mode="contained"
                disabled={page + 1 >= totalPages}
                onPress={() => setPage((p) => p + 1)}
                icon={"arrow-right"}
                contentStyle={{
                  flexDirection: "row-reverse", // 👈 icon right side
                }}
                // style={[
                //   styles.navBtn,
                //   {
                //     backgroundColor:
                //       page + 1 >= totalPages
                //         ? AppMDMThemeColors.Grey
                //         : AppMDMThemeColors.approval,
                //   },
                // ]}
                // contentStyle={styles.navBtnContent}
                // labelStyle={styles.navBtnLabel}
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
    justifyContent: "space-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    // borderTopWidth: 1,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderColor: AppMDMThemeColors.second,
    borderWidth: 2,
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
  navBtn: {
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  navBtnContent: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: "center",
  },
  navBtnLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: AppMDMThemeColors.white,
  },
});

const RotatingLoader = ({ color = "#16A34A", size = 20 }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <MaterialCommunityIcons name="loading" size={size} color={color} />
    </Animated.View>
  );
};

const getColumnWidth = (
  title: string,
  data: any[],
  key: string,
  min = 80,
  max = 300
) => {
  const maxTextLength = Math.max(
    title.length,
    ...data.map((item) => String(item[key] ?? "").length)
  );

  const estimatedWidth = maxTextLength * 8 + 1000; // 8px per char
  return Math.min(Math.max(estimatedWidth, min), max);
};
//

export const LoadingComponent = ({
  text = "Loading...",
}: {
  text?: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export const NoDataComponent = ({
  text = "No data found",
}: {
  text?: string;
}) => {
  return (
    <View style={stylesOtherComponent.container}>
      <MaterialCommunityIcons
        name="database-off-outline"
        size={36}
        color={AppMDMThemeColors.second}
      />
      <Text style={stylesOtherComponent.text}>{text}</Text>
    </View>
  );
};

const stylesOtherComponent = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: AppMDMThemeColors.white,
    borderWidth: 1,
    borderColor: AppMDMThemeColors.second,
    alignItems: "center",
    justifyContent: "start",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: "700",
    color: AppMDMThemeColors.primary,
  },
});
