import { MMKV as MMKVClass } from "react-native-mmkv";

export const storage = new MMKVClass({
  id: "app-storage",
});