import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Network from "expo-network";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { LoginApi, NavigationApi, NavigationConfig } from "@/src/services/Api";
import { LoginPayload, LoginResponse } from "@/src/types/Login";
import { Navigation, NavigationConfigType } from "@/src/types/Navigation";
import { extractMessages } from "@/utils/errorHandler";
import { useAlert } from "./AlertContext";
import { MaterialTransApi } from "@/src/services/MaterialTransaction";
import { MaterialTransactionsTypes } from "@/src/types/MaterialTransactions";
import { PlantMaster } from "@/src/types/ApprovalType";
import { lookUpApi, PlantData } from "@/src/services/MdmAPPApi";
import { DocumentItem } from "@/src/types/LookUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "@/utils/mmkv";

interface DataContextType {
  currentUser: LoginResponse | null;
  onLogin: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  navigationTrigger: () => Promise<void>;
  navigationList: Navigation[];
  getNavigationConfig: (roleId: string) => Promise<void>;
  navigationConfigList: NavigationConfigType[];
  materialTransData: MaterialTransactionsTypes[];
  plantApiData: PlantMaster[];
  lookUpData: DocumentItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const USER_KEY = "currentUser"; // SecureStore

const MTRNS_KEY = "materialTransData"; // AsyncStorage
const PLANT_KEY = "plantData";
const LOOKUP_KEY = "lookUpData";

export const saveUserSecure = async (user: LoginResponse) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUserSecure = async (): Promise<LoginResponse | null> => {
  const stored = await SecureStore.getItemAsync(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const removeUserSecure = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

const saveMaterialTransData = async (data: MaterialTransactionsTypes[]) => {
  await AsyncStorage.setItem(MTRNS_KEY, JSON.stringify(data));
};

const savePlantData = async (data: PlantMaster[]) => {
  await AsyncStorage.setItem(PLANT_KEY, JSON.stringify(data));
};

const saveLookUpData = async (data: DocumentItem[]) => {
  await AsyncStorage.setItem(LOOKUP_KEY, JSON.stringify(data));
};


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
  const [navigationConfigList, setNavigationConfigList] = useState<
    NavigationConfigType[]
  >([]);
  const [materialTransData, setMaterialTransData] = useState<
    MaterialTransactionsTypes[]
  >([]);
  const [plantApiData, setPlantApiData] = useState<PlantMaster[]>([]);
  const [lookUpData, setLookUpData] = useState<DocumentItem[]>([]);

  const { showAlert } = useAlert();

  // ✅ Get device ID consistently
  const MobileDeviceId =
    Device.osInternalBuildId ??
    Constants.installationId ??
    Device.osBuildId ??
    "unknown";

    storage.set("mmkv_test", "ok");
    console.log(storage.getString("mmkv_test"));


  const getIp = async () => {
    const ip = await Network.getIpAddressAsync();
    setIpAdd(ip);
  };

  const handleApiError = (error: any) => {
    const messages = extractMessages(error);
    messages.forEach((msg) => showAlert(msg, "error"));
  };

  // ✅ Login function
  const onLogin = async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    const payload: LoginPayload = {
      applicationId: AppId || "",
      username: username,
      password: password,
      identityCode: MobileDeviceId,
      ipAddress: ipAdd,
      macAddress: "",
    };
    try {
      const response = await LoginApi.post(payload);
      const data: LoginResponse = response;
      if (response) {
        setCurrentUser(response);
        await saveUserSecure(response);
      }
      return data;
    } catch (err: any) {
      // console.error("❌ Login error:", err);
      handleApiError(err);
      throw err;
    }
  };

  const navigationTrigger = async (): Promise<void> => {
    try {
      const res = await NavigationApi.getMobileAll();
      setNavigationList(res);
    } catch (error: any) {
      console.log("navigation list error", error);
      handleApiError(error);
      throw error;
    }
  };

  const getNavigationConfig = async (roleId: string): Promise<void> => {
    try {
      const res = await NavigationConfig.getAll(roleId);
      setNavigationConfigList(res);
    } catch (error: any) {
      console.log("navigation config list error", error);
      handleApiError(error);
      throw error;
    }
  };

  const getMaterialTrans = async () => {
    try {
      const res = await MaterialTransApi.getAll();
      setMaterialTransData(res);
      await saveMaterialTransData(res);
    } catch (error: any) {
      handleApiError(error);
      console.log(error);
    }
  };

  const getPlantMaster = async () => {
    try {
      const res = await PlantData.GetAll();
      setPlantApiData(res);
      await savePlantData(res);
    } catch (error) {
      handleApiError(error);
      console.log(error);
    }
  };

  const getLookUp = async () => {
    try {
      const res = await lookUpApi.getAll();
      setLookUpData(res);
      await saveLookUpData(res);
    } catch (error) {
      handleApiError(error);
      console.log(error);
    }
  };

  const loadMaterialTransFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(MTRNS_KEY);
      if (stored) {
        setMaterialTransData(JSON.parse(stored));
      }
    } catch (e) {
      console.log("AsyncStorage material load error", e);
    }
  };

  const loadPlantDataFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(PLANT_KEY);
      if (stored) {
        setPlantApiData(JSON.parse(stored));
      }
    } catch (e) {
      console.log("AsyncStorage plant load error", e);
    }
  };

  const loadLookUpFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOOKUP_KEY);
      if (stored) {
        setLookUpData(JSON.parse(stored));
      }
    } catch (e) {
      console.log("AsyncStorage lookup load error", e);
    }
  };

  

  // ✅ Logout function
  const logout = async () => {
    setCurrentUser(null);
    await removeUserSecure();
  };

  // 🔄 Initial data load
  useEffect(() => {
    getIp();
  }, []);

  useEffect(() => {
    loadMaterialTransFromStorage();
    loadPlantDataFromStorage();
    loadLookUpFromStorage();

    getMaterialTrans();
    getPlantMaster();
    getLookUp();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserSecure();
      if (user) {
        setCurrentUser(user);
      }
    };
    loadUser();
  }, []);

  const value: DataContextType = {
    currentUser,
    onLogin,
    logout,
    navigationTrigger,
    navigationList,
    getNavigationConfig,
    navigationConfigList,
    materialTransData,
    plantApiData,
    lookUpData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully. In a future SDK version, this call may throw an error.
