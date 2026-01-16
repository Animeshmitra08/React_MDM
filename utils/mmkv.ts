import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "app-storage",
});


export const saveIfNotEmpty = <T>(key: string, data: T[]) => {
  if (Array.isArray(data) && data.length > 0) {
    storage.set(key, JSON.stringify(data));
  }
};

export const loadIfNotEmpty = <T>(key: string): T[] | null => {
  const stored = storage.getString(key);
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
};

export const syncCache = <T>(
  key: string,
  data: T[],
  setter: React.Dispatch<React.SetStateAction<T[]>>
) => {
  setter(data);
  storage.set(key, JSON.stringify(data));
};