import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';
import * as Device from "expo-device";
import * as Network from "expo-network";
import { Alert } from "react-native";
import { LoginApi, NavigationApi, NavigationConfig } from "@/src/services/Api";
import { LoginPayload, LoginResponse } from "@/src/types/Login";
import { Navigation, NavigationConfigType } from "@/src/types/Navigation";


interface DataContextType {
  currentUser: LoginResponse | null;
  onLogin: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  navigationTrigger: () => Promise<void>;
  navigationList: Navigation[];
  getNavigationConfig: (roleId: string) => Promise<void>;
  navigationConfigList: NavigationConfigType[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

const Base_Api = process.env.EXPO_PUBLIC_API_URL;
const AppId = process.env.EXPO_PUBLIC_APP_ID;

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<LoginResponse | null>(null);
  const [ipAdd, setIpAdd] = useState("");
  const [navigationList, setNavigationList] = useState<Navigation[]>([]);
  const [navigationConfigList, setNavigationConfigList] = useState<NavigationConfigType[]>([])

  // ✅ Get device ID consistently
  const MobileDeviceId =
    Device.osInternalBuildId ??
    Constants.installationId ??
    Device.osBuildId ??
    "unknown";

  const getIp = async () =>{
    const ip = await Network.getIpAddressAsync();
    setIpAdd(ip);
  }

  

  // ✅ Login function
  const onLogin = async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    const payload: LoginPayload = {
      ApplicationId: AppId || '',
      Username: username,
      Password: password,
      IdentityCode: MobileDeviceId,
      IpAddress: ipAdd,
      MACAddress: "",
    };

    try {
      const response = await LoginApi.post(payload);
      const data: LoginResponse = response;
      if (response) {
        setCurrentUser(response);
      }
      return data;
    } catch (err) {
      console.error("❌ Login error:", err);
      throw err;
    }
  };

  const navigationTrigger = async (): Promise<void> => {
    try {
      const res = await NavigationApi.getAll();
      setNavigationList(res);
    } catch (error) {
      console.log("navigation list error", error);
      throw error;
    }
  };

  const getNavigationConfig = async (roleId: string): Promise<void> =>{
    try {
      const res = await NavigationConfig.getAll(roleId);
      setNavigationConfigList(res);
    } catch (error) {
      console.log("navigation config list error", error);
      throw error;
    }
  }

  // Validate user from API with localStorage
  // const validateStoredUser = async () => {
  //   try {
  //     const stored = await AsyncStorage.getItem("currentUser");
  //     if (!stored) return;

  //     const localUser: UserData = JSON.parse(stored);

  //     const res = await axios.get(`${Base_Api}/User/Contact?contactNo=${localUser.contact}`, {
  //       headers: { Accept: "application/json" }
  //     });

  //     if (!res.data || res.data.length === 0) {
  //       console.log("User removed or not found → logging out");
  //       await logout();
  //       return;
  //     }

  //     const freshUser = res.data[0];

  //     if (freshUser.id !== localUser.id) {
  //       console.log("User ID mismatch → logging out");
  //       await logout();
  //       return;
  //     }

  //     if (freshUser.estatus === 1) {
  //       console.log("User account deactivated → logging out");
  //       Alert.alert("User account deactivated → logging out");
  //       await logout();
  //       return;
  //     }

  //     if (JSON.stringify(freshUser) !== JSON.stringify(localUser)) {
  //       console.log("🔄 User updated → refreshing AsyncStorage");
  //       setCurrentUser(freshUser);
  //       await AsyncStorage.setItem("currentUser", JSON.stringify(freshUser));
  //     }

  //   } catch (err) {
  //     console.log("Validation error:", err);
  //   }
  // };

  // ✅ Logout function
  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  // 🧠 Load current user from storage and validate
  // useEffect(() => {
  //   const loadUserAndValidate = async () => {
  //     const stored = await AsyncStorage.getItem("currentUser");
  //     if (stored) {
  //       setCurrentUser(JSON.parse(stored));
  //       await validateStoredUser();
  //     }
  //   };

  //   loadUserAndValidate();
  // }, []);

  // Periodic user validation
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     validateStoredUser();
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, []);

  // 🔄 Initial data load
  useEffect(() => {
    getIp();
  }, []);

  const value: DataContextType = {
    currentUser,
    onLogin,
    logout,
    navigationTrigger,
    navigationList,
    getNavigationConfig,
    navigationConfigList
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};