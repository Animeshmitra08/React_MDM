import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

interface RNInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  icon?: string;
  secure?: boolean;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  disabled?: boolean;
}

const RNInput: React.FC<RNInputProps> = ({
  label,
  value,
  onChangeText,
  icon,
  secure = false,
  error,
  autoCapitalize = "none",
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [isFocused, setFocused] = useState(false);

  // 👇 Add password visibility toggle
  const [hidePassword, setHidePassword] = useState(secure);

  const isFloating = isFocused || !!value;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          { borderColor: error ? "#ff5252" : isFocused ? colors.primary : "#ccc" }
        ]}
      >
        {/* Left icon */}
        {icon && (
          <View style={styles.leftIcon}>
            <Icon
              source={icon}
              size={22}
              color={error ? "#ff5252" : colors.primary}
            />
          </View>
        )}

        <Text
          style={[
            styles.floatingLabel,
            {
              color: error
                ? "#ff5252"
                : disabled
                ? "#888"
                : isFocused
                ? colors.primary
                : "#999",
              backgroundColor: disabled ? "#ffffffff" : "#fff",
              top: isFloating ? -8 : 12,
              fontSize: isFloating ? 12 : 16,
              paddingHorizontal: isFloating ? 4 : 0,
              marginLeft: icon ? 36 : 12,
            },
          ]}
        >
          {label}
        </Text>

        {/* TextInput */}
        <TextInput
          value={value}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          secureTextEntry={secure ? hidePassword : false}
          // placeholder={label}
          placeholderTextColor="#999"
          onChangeText={onChangeText}
          onFocus={() => !disabled && setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input,
            { color: disabled ? "#888" : "#000" },
          ]}
        />

        {/* 👁 Right Eye Toggle (Only for secure fields) */}
        {secure && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Icon
              source={hidePassword ? "eye-off" : "eye"}
              size={22}
              color="#777"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 16,
    color: "#000",
    paddingTop: 10,
  },
  errorText: {
    color: "#ff5252",
    marginTop: 4,
    marginLeft: 4,
    fontSize: 13,
  },
  floatingLabel: {
    position: "absolute",
    left: 0,
    zIndex: 10,
  },
});

export default RNInput;