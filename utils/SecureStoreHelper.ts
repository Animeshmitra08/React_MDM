import * as SecureStore from "expo-secure-store";

/**
 * Save any JSON-serializable data
 */
export const saveSecure = async <T>(key: string, data: T): Promise<void> => {
  await SecureStore.setItemAsync(key, JSON.stringify(data));
};

/**
 * Load typed data safely
 */
export const loadSecure = async <T>(key: string): Promise<T | null> => {
  const stored = await SecureStore.getItemAsync(key);
  return stored ? (JSON.parse(stored) as T) : null;
};

/**
 * Remove data
 */
export const removeSecure = async (key: string): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};