import React, { useEffect, useMemo } from "react";
import { Alert, Dimensions, StyleSheet, useColorScheme, View } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Avatar, Button, Divider, Text, useTheme } from "react-native-paper";
import { useData } from "@/Services/dataProvider";
import { FontAwesome6 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export type DrawerParamList = {
  Home: undefined;
  [key: string]: undefined;
};

const ScreenRegistry: Record<string, React.ComponentType<any>> = {
  documentstats: HomeScreen,
  approveddocuments: HomeScreen,
  chart: HomeScreen,
  amsconfiguration: HomeScreen,
  documentdeletelog: HomeScreen,
  dashboard: HomeScreen,
  sharedforme: HomeScreen,
  documentupload: HomeScreen,
  masterdata: HomeScreen,
  alldocumentlist: HomeScreen,
  documentapproval: HomeScreen,
  newmenu: HomeScreen,
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

  // Split by spaces → find the fa- icon → remove fa-
  const icon = iconClass
    .split(" ")
    .find(cls => cls.startsWith("fa-") && cls !== "fa-solid");

  return icon ? icon.replace("fa-", "") : "circle";
};



const Drawer = createDrawerNavigator<DrawerParamList>();

// -----------------------------------------
// ⚡ DEMO SCREENS INSIDE THIS FILE
// -----------------------------------------

function HomeScreen({ navigation }: any) {
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
    return new Map(
      navigationConfigList.map(cfg => [cfg.navigationID, cfg])
    );
  }, [navigationConfigList]);

  /* -------------------- Filter + sort menu -------------------- */
  const orderedNavigationList = useMemo(() => {
    if (!navigationList?.length || !configMap.size) return [];

    return [...navigationList] // ⚠️ clone before sort
      .filter(nav => configMap.get(nav.id)?.isGranted)
      .sort((a, b) => {
        const orderA = configMap.get(a.id)?.pageOrder ?? 0;
        const orderB = configMap.get(b.id)?.pageOrder ?? 0;
        return orderA - orderB;
      });
  }, [navigationList, configMap]);

  /* -------------------- Loading states -------------------- */
  if (!navigationList?.length) {
    return (
      <Centered>
        <Text>Loading menu…</Text>
      </Centered>
    );
  }

  if (!orderedNavigationList.length) {
    return (
      <Centered>
        <Text>No accessible menus</Text>
      </Centered>
    );
  }

  /* -------------------- Drawer -------------------- */
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: colors.surface,
          width: width * 0.75,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.onSurface,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.onSurface,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {orderedNavigationList.map(item => {
        const routeKey = normalizeRouteKey(item.page);
        const ScreenComponent =
          ScreenRegistry[routeKey] ?? FallbackScreen;

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


function CustomDrawer(props: any) {
  const { colors } = useTheme();

  const { currentUser, logout } = useData();

  const onLogout = async () =>{
    await logout();
  }

  const getInitials = (email: string) => (email ? email.substring(0, 1).toUpperCase() : "U");

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Avatar.Text
          label={getInitials(currentUser?.email || "")}
          size={64}
          style={{ backgroundColor: colors.primary }}
        />
        <View style={{ marginLeft: 12 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {currentUser?.name}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {currentUser?.email}
          </Text>
        </View>
      </View>

      <Divider style={{ marginVertical: 12 }} />

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      <Divider style={{ marginVertical: 16 }} />

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
      <Text style={[styles.footerText, { color: colors.primary }]}>
        © {new Date().getFullYear()} <Text style={{ fontWeight: "bold" }}>AON DIGICON LLP</Text>
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
});