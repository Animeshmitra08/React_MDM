import React, { useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppMDMThemeColors } from "@/src/theme/color";

const formatDateDMY = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// const formatTimeHM = (date: Date) => {
//   const hh = String(date.getHours()).padStart(2, "0");
//   const mm = String(date.getMinutes()).padStart(2, "0");
//   return `${hh}:${mm}`;
// };

type DateComponentProps = {
  label?: string;
  date: Date | null;
  setDate: (d: Date) => void;
  disabled?: boolean;
  style?: any;
  mode?: any;
  type?: "date" | "time";
  timeFormat?: "12h" | "24h";
  minimumDate?: Date;
  maximumDate?: Date;
};

const DateTimeComponent = ({
  label = "Select",
  date,
  setDate,
  disabled,
  style,
  mode = "outlined",
  type = "date",
  timeFormat = "24h",
  minimumDate,
  maximumDate,
}: DateComponentProps) => {
  const [open, setOpen] = useState(false);

  // Default → today / now
  useEffect(() => {
    if (!date) {
      setDate(new Date());
    }
  }, []);

  const valueDate = date ?? new Date();

  const formatTime24 = (date: Date) => {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const formatTime12 = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const displayValue =
    type === "date"
      ? formatDateDMY(valueDate)
      : timeFormat === "12h"
      ? formatTime12(valueDate)
      : formatTime24(valueDate);

  return (
    <View>
      <Text
        style={{
          marginBottom: 4,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{ opacity: disabled ? 0.6 : 1 }}
      >
        <View pointerEvents="none">
          <TextInput
            style={[
              style,
              {
                backgroundColor: AppMDMThemeColors.white,
              },
            ]}
            left={
              <TextInput.Icon
                icon={type === "date" ? "calendar" : "clock"}
                color={AppMDMThemeColors.primary}
              />
            }
            editable={false}
            disabled={disabled}
            mode={mode}
            value={displayValue}
            placeholder={label}
            activeOutlineColor={AppMDMThemeColors.primary}
            outlineColor={AppMDMThemeColors.primary}
          />
        </View>
      </Pressable>

      {open && (
        <DateTimePicker
          value={valueDate}
          mode={type} // 👈 "date" or "time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            if (Platform.OS === "android") {
              setOpen(false);
            }

            if (event.type === "set" && selectedDate) {
              setDate(selectedDate);
            }
          }}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DateTimeComponent;
