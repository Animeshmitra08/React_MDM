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
import { loadIfNotEmpty, saveIfNotEmpty, storage } from "@/utils/mmkv";

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
  refreshMaterialTrans: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const USER_KEY = "currentUser"; // SecureStore

const MTRNS_KEY = "materialTransData";
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

const saveMaterialTransData = (data: MaterialTransactionsTypes[]) => {
  saveIfNotEmpty(MTRNS_KEY, data);
};

const savePlantData = (data: PlantMaster[]) => {
  saveIfNotEmpty(PLANT_KEY, data);
};

const saveLookUpData = (data: DocumentItem[]) => {
  saveIfNotEmpty(LOOKUP_KEY, data);
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

      if (Array.isArray(res)) {
        setMaterialTransData(res);
        storage.set(MTRNS_KEY, JSON.stringify(res));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getPlantMaster = async () => {
    try {
      const res = await PlantData.GetAll();

      if (Array.isArray(res)) {
        setPlantApiData(res);
        storage.set(PLANT_KEY, JSON.stringify(res));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getLookUp = async () => {
    try {
      const res = await lookUpApi.getAll();

      if (Array.isArray(res)) {
        setLookUpData(res);
        storage.set(LOOKUP_KEY, JSON.stringify(res));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const loadMaterialTransFromStorage = () => {
    const data = loadIfNotEmpty<MaterialTransactionsTypes>(MTRNS_KEY);
    if (data) setMaterialTransData(data);
  };

  const loadPlantDataFromStorage = () => {
    const data = loadIfNotEmpty<PlantMaster>(PLANT_KEY);
    if (data) setPlantApiData(data);
  };

  const loadLookUpFromStorage = () => {
    const data = loadIfNotEmpty<DocumentItem>(LOOKUP_KEY);
    if (data) setLookUpData(data);
  };

  const refreshMaterialTrans = async () => {
    await getMaterialTrans();
  };

  

  // ✅ Logout function
  const logout = async () => {
    setCurrentUser(null);
    await removeUserSecure();

    // storage.remove(MTRNS_KEY);
    // storage.remove(PLANT_KEY);
    // storage.remove(LOOKUP_KEY);
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
    refreshMaterialTrans,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully. In a future SDK version, this call may throw an error.
