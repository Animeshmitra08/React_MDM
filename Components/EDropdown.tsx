import { View } from "react-native";
import {
  ActivityIndicator,
  Text,
  useTheme,
  IconButton,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { AppMDMThemeColors } from "@/src/theme/color";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

export default function EDropdown({
  label,
  data,
  value,
  onChange,
  disabled,
  loading,
}: {
  label: string;
  data: { label: string; value: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { colors } = useTheme();
  const [isFocus, setIsFocus] = useState(false);
  const renderRightIcon = () => {
    return isFocus ? (
      <AntDesign name="caret-up" size={18} color={AppMDMThemeColors.primary} />
    ) : (
      <AntDesign
        name="caret-down"
        size={18}
        color={AppMDMThemeColors.primary}
      />
    );
  };

  return (
    <>
      <Text style={{ marginBottom: 4, fontWeight: "700" }}>{label}</Text>

      <View style={{ position: "relative" }}>
        <Dropdown
          style={{
            height: 44,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.outline,
            paddingHorizontal: 8,
            backgroundColor: disabled
              ? colors.outlineVariant
              : colors.onPrimary,
          }}
          containerStyle={{
            borderRadius: 10,
            borderColor: colors.outline,
            borderWidth: 1,
          }}
          placeholderStyle={{
            fontSize: 13,
            color: disabled ? colors.outlineVariant : undefined,
          }}
          selectedTextStyle={{
            fontSize: 13,
            color: colors.onSurface,
          }}
          inputSearchStyle={{
            height: 36,
            fontSize: 13,
            borderRadius: 8,
          }}
          data={data}
          search
          labelField="label"
          valueField="value"
          placeholder={label}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          disable={disabled}
          onChange={(item) => {
            onChange(item.value);
            setIsFocus(false);
          }}
          renderRightIcon={renderRightIcon}
        />

        {/* Clear icon */}
        {value && !disabled && !loading && (
          <IconButton
            icon="close-circle"
            iconColor={AppMDMThemeColors.rejected}
            size={20}
            onPress={() => onChange(null)}
            style={{
              position: "absolute",
              right: 20,
              top: 0,
            }}
          />
        )}

        {/* Loader */}
        {loading && (
          <ActivityIndicator
            size="small"
            style={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          />
        )}
      </View>
    </>
  );
}
