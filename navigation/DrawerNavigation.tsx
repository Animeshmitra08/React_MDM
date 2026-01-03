import React, { use, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useData } from "@/Services/dataProvider";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { Navigation } from "@/src/types/Navigation";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import RequestApproval1 from "@/app/Screens/Request Approval/Approval1";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import RequestApproval2 from "@/app/Screens/Request Approval/Approval2";
import MaterialExtensionApproval1 from "@/app/Screens/Material Extension/Approval1";
import MaterialExtensionApproval2 from "@/app/Screens/Material Extension/Approval2";
import ChangeRequestApproval1 from "@/app/Screens/Change Request Approval/Approval1";
import ChangeRequestApproval2 from "@/app/Screens/Change Request Approval/Approval2";
import BlockApproval1 from "@/app/Screens/Block Level/Approval1";
import BlockApproval2 from "@/app/Screens/Block Level/Approval2";
import UnblockApproval1 from "@/app/Screens/Unblock/Approval1";
import UnblockApproval2 from "@/app/Screens/Unblock/Approval2";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export type DrawerParamList = {
  Home: undefined;
  [key: string]: undefined;
};

type CustomDrawerProps = DrawerContentComponentProps & {
  groupedNavigation: Record<string, Navigation[]>;
};

const ScreenRegistry: Record<string, React.ComponentType<any>> = {
  requestapproval: RequestApproval1,
  requestapprovalfinal: RequestApproval2,
  materialextensionapproval1: MaterialExtensionApproval1,
  extensionapproval2: MaterialExtensionApproval2,
  changerequestapproval1: ChangeRequestApproval1,
  changerequestfinalapproval: ChangeRequestApproval2,
  materialblocklevel1approval: BlockApproval1,
  materialblockfinalapproval: BlockApproval2,
  unblockapproval: UnblockApproval1,
  unblockfinalapproval: UnblockApproval2,
};

function FallbackScreen() {
  return (
    <View style={demoStyles.container}>
      <Text variant="headlineSmall">Screen not found</Text>
    </View>
  );
}

const normalizeRouteKey = (page: string) =>
  page
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

const normalizeFaIcon = (iconClass?: string): string => {
  if (!iconClass) return "circle";

  // If it's a single word (no spaces), assume it's already an icon name
  if (!iconClass.includes(" ")) {
    return iconClass;
  }

  // Otherwise treat it as a Font Awesome class string
  const icon = iconClass
    .split(" ")
    .find((cls) => cls.startsWith("fa-") && !cls.startsWith("fa-solid") && !cls.startsWith("fa-regular") && !cls.startsWith("fa-light") && !cls.startsWith("fa-thin"));

  return icon ? icon.replace("fa-", "") : "circle";
};

const Drawer = createDrawerNavigator<DrawerParamList>();

// -----------------------------------------
// ⚡ DEMO SCREENS INSIDE THIS FILE
// -----------------------------------------

function HomeScreen({ navigation }: any) {
  const [text, setText] = useState<string>("");
  return (
    <View style={demoStyles.container}>
      <Text variant="headlineMedium">🏠 Home Screen</Text>

      <Button
        mode="contained"
        style={demoStyles.button}
        onPress={() =>
          navigation.navigate("Test", { name: "John Doe", age: 27 })
        }
      >
        Go to Test Screen with Params
      </Button>
    </View>
  );
}

const demoStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  button: { marginTop: 20 },
});

export default function DrawerNavigator() {
  const { colors } = useTheme();
  const {
    navigationTrigger,
    navigationList,
    navigationConfigList,
    getNavigationConfig,
    currentUser,
  } = useData();

  /* -------------------- Fetch base navigation -------------------- */
  useEffect(() => {
    navigationTrigger();
  }, []);

  /* -------------------- Fetch role config -------------------- */
  useEffect(() => {
    if (currentUser?.roleId) {
      getNavigationConfig(currentUser.roleId);
    }
  }, [currentUser?.roleId]);

  /* -------------------- Build lookup map -------------------- */
  const configMap = useMemo(() => {
    if (!navigationConfigList?.length) return new Map();
    return new Map(navigationConfigList.map((cfg) => [cfg.navigationID, cfg]));
  }, [navigationConfigList]);

  /* -------------------- Filter + sort menu -------------------- */
  const orderedNavigationList = useMemo(() => {
    if (!navigationList?.length || !configMap.size) return [];

    return [...navigationList] // ⚠️ clone before sort
      .filter((nav) => configMap.get(nav.id)?.isGranted)
      .sort((a, b) => {
        const orderA = configMap.get(a.id)?.pageOrder ?? 0;
        const orderB = configMap.get(b.id)?.pageOrder ?? 0;
        return orderA - orderB;
      });
  }, [navigationList, configMap]);

  const uniqueNavigationList = useMemo(() => {
    const seen = new Set<string>();

    return orderedNavigationList.filter((item) => {
      const key = normalizeRouteKey(item.page);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true; // ✅ first occurrence
    });
  }, [orderedNavigationList]);

  // ----------------------- orderedNavigationList derivation -----------------------
  const groupedNavigation = useMemo<Record<string, Navigation[]>>(() => {
    const map: Record<string, Navigation[]> = {};

    orderedNavigationList.forEach((item) => {
      const parentId = item.parentId ?? "root";

      if (!map[parentId]) {
        map[parentId] = [];
      }
      map[parentId].push(item);
    });

    return map;
  }, [orderedNavigationList]);

  /* -------------------- Loading states -------------------- */
  if (!navigationList?.length) {
    return (
      <>
      <StatusBar style="light" />
      <Centered>
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 6}}>Loading menu…</Text>
      </Centered>
      </>
    );
  }

  if (!orderedNavigationList.length) {
    return (
      <>
      <StatusBar style="dark" />
      <Centered>
        <Image
          source={require("@/assets/images/emamilogo1.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>No accessible menus</Text>
      </Centered>
      </>
    );
  }

  /* -------------------- Drawer -------------------- */
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: colors.primary,
          width: width * 0.8,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.onPrimary,
        },
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.onSurface,
      }}
      drawerContent={(props) => (
        <CustomDrawer {...props} groupedNavigation={groupedNavigation} />
      )}
    >
      {uniqueNavigationList
        .filter((item) => !groupedNavigation[item.id])
        .map((item) => {
          const routeKey = normalizeRouteKey(item.page);
          const ScreenComponent = ScreenRegistry[routeKey] ?? FallbackScreen;

          const drawerLabel =
            typeof item.displayName === "string" && item.displayName.trim()
              ? item.displayName
              : item.page;

          return (
            <Drawer.Screen
              key={item.id}
              name={routeKey}
              component={ScreenComponent}
              options={{
                drawerLabel,
                headerTitleStyle: {
                  color: colors.onPrimary,
                },

                headerTintColor: colors.onPrimary,
                headerTitle: item.dashboardName ?? drawerLabel,
                drawerIcon: ({ color, size }) => (
                  <FontAwesome6
                    name={normalizeFaIcon(item.iconClass)}
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          );
        })}
    </Drawer.Navigator>
  );
}

/* -------------------- Small helper -------------------- */
const Centered = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    {children}
  </View>
);

function CustomDrawer(props: CustomDrawerProps) {
  const { groupedNavigation } = props;
  const [expandedParents, setExpandedParents] = React.useState<
    Record<string, boolean>
  >({});

  const route = props.state.routes[props.state.index];
  const activeRouteName = route?.name;

  React.useEffect(() => {
    Object.entries(groupedNavigation).forEach(([parentId, children]) => {
      if (
        children?.some(
          (child) => normalizeRouteKey(child.page) === activeRouteName
        )
      ) {
        setExpandedParents((prev) => ({ ...prev, [parentId]: true }));
      }
    });
  }, [activeRouteName]);

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
  }

  const toggleParent = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { colors } = useTheme();
  const { currentUser, logout } = useData();

  const onLogout = async () => {
    await logout();
  };

  const getInitials = (email: string) =>
    email ? email.substring(0, 1).toUpperCase() : "U";

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.profileContainer}>
        {/* <Avatar.Text
          label={getInitials(currentUser?.email || "")}
          size={64}
          style={{ backgroundColor: colors.onPrimary }}
        /> */}
        <Avatar.Image
          size={64}
          source={require("@/assets/images/emamilogo1.jpeg")}
          style={{ backgroundColor: colors.onPrimary }}
        />
        <View style={{ marginLeft: 12 }}>
          <Text
            variant="titleMedium"
            style={{ fontWeight: "700", color: colors.onPrimary }}
          >
            {currentUser?.name}
          </Text>
          {/* <Text variant="bodySmall" style={{ color: colors.onPrimary }}>
            {currentUser?.email}
          </Text> */}
          <Text variant="bodySmall" style={{ color: colors.onPrimary, fontSize: 10, marginTop:4 }}>
            {currentUser?.roleName}
          </Text>
        </View>
      </View>

      <Divider
        style={{
          marginVertical: 12,
          borderColor: colors.onPrimary,
          borderWidth: 0.5,
        }}
      />

      {/* Drawer Items */}
      {groupedNavigation["root"]?.length > 0 ? (
        groupedNavigation["root"].map((parent: Navigation) => {
          const children = groupedNavigation[parent.id] || [];
          const isExpanded = expandedParents[parent.id];
          const hasChildren = children.length > 0;

          const parentRouteKey = normalizeRouteKey(parent.page);
          const isParentActive = parentRouteKey === activeRouteName;

          // ✅ Use fallback values to ensure display
          const parentDisplayName =
            parent.displayName?.trim() || parent.page || "Menu";
          const parentIcon = parent.iconClass
            ? normalizeFaIcon(parent.iconClass)
            : normalizeFaIcon(parent.icon);

          return (
            <View key={parent.id}>
              {/* Parent Item */}
              <Pressable
                onPress={() => {
                  if (hasChildren) {
                    toggleParent(parent.id);
                  } else {
                    props.navigation.navigate(parentRouteKey);
                  }
                }}
                style={[styles.parentItem, isParentActive && styles.activeItem]}
              >
                <View style={styles.parentLeft}>
                  {isParentActive && <View style={styles.activeIndicator} />}

                  <FontAwesome6
                    name={parentIcon}
                    size={16}
                    color={colors.onPrimary}
                  />
                  <Text
                    style={[
                      styles.parentText,
                      { color: colors.onPrimary },
                      isParentActive && styles.activeText,
                    ]}
                  >
                    {parentDisplayName}
                  </Text>
                </View>

                {hasChildren && (
                  <FontAwesome6
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={colors.onPrimary}
                  />
                )}
              </Pressable>

              {/* Children */}
              {isExpanded &&
                children.map((child: Navigation) => {
                  const isChildActive =
                    normalizeRouteKey(child.page) === activeRouteName;
                  const childRouteKey = normalizeRouteKey(child.page);
                  const childDisplayName =
                    child.displayName?.trim() || child.page || "Item";

                  return (
                    <Pressable
                      key={child.id}
                      onPress={() => props.navigation.navigate(childRouteKey)}
                      style={[
                        styles.childItem,
                        isChildActive && styles.activeItem,
                      ]}
                    >
                      {isChildActive && <View style={styles.activeIndicator} />}

                      <FontAwesome6
                        name={
                          child.iconClass
                            ? normalizeFaIcon(child.iconClass)
                            : normalizeFaIcon(child.icon)
                        }
                        size={14}
                        color={colors.onPrimary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          { color: colors.onPrimary },
                          isChildActive && styles.activeText,
                        ]}
                      >
                        {childDisplayName}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          );
        })
      ) : (
        <Text style={{ color: colors.onPrimary, textAlign: "center" }}>
          No menu items available
        </Text>
      )}

      <Divider
        style={{
          marginVertical: 16,
          borderColor: colors.onPrimary,
          borderWidth: 0.5,
        }}
      />

      {/* Logout */}
      <Button
        icon="logout"
        mode="contained"
        onPress={onLogout}
        buttonColor={"#e53935"}
        textColor="#fff"
        style={styles.logoutButton}
      >
        Logout
      </Button>

      {/* Footer */}
      <Text style={[styles.footerText, { color: colors.onPrimary }]}>
        © {new Date().getFullYear()}{" "}
        <Text style={{ fontWeight: "bold", color: colors.onPrimary }}>
          AON DIGICON LLP
        </Text>
      </Text>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 20,
  },
  parentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  parentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  parentText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
  },
  childItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  activeItem: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  activeText: {
    fontWeight: "700",
  },
  activeIndicator: {
    width: 4,
    height: "100%",
    backgroundColor: "#FFD54F",
    borderRadius: 2,
    marginRight: 8,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
