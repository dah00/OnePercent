import { colors } from "@/constants/colors";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Checkbox({
  value,
  onValueChange,
  color = colors.primary,
  size = 20,
  style,
  disabled = false,
}: CheckboxProps) {
  const boxStyle = [
    styles.box,
    {
      width: size,
      height: size,
      borderRadius: size / 6,
      borderWidth: 1,
      borderColor: value ? color : colors.border,
      backgroundColor: value ? color : colors.button,
    },
  ];

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      disabled={disabled}
    >
      <View style={boxStyle}>
        {value && (
          <Text
            style={[
              styles.checkmark,
              { color: colors.button, fontSize: size * 0.8 },
            ]}
          >
            ✓
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.7,
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontWeight: "bold",
    marginTop: -2,
  },
});