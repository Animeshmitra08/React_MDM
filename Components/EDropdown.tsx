import { View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { AppMDMThemeColors } from "@/src/theme/color";

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
  onChange: (v: string) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <>
      <Text
        style={{
          marginBottom: 4,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>

      <View style={{ position: "relative" }}>
        <Dropdown
          style={{
            height: 44,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: AppMDMThemeColors.primary,
            paddingHorizontal: 8,
            backgroundColor: disabled
              ? colors.surfaceDisabled
              : AppMDMThemeColors.white,
          }}
          containerStyle={{
            borderRadius: 10,
            borderColor: AppMDMThemeColors.primary,
            borderWidth: 1,
          }}
          placeholderStyle={{
            fontSize: 13,
            color: disabled ? colors.onSurfaceVariant : "",
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
          disable={disabled}
          onChange={(item) => onChange(item.value)}
        />

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
