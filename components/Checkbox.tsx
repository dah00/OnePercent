import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface CheckboxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  color?: string;
  disabled?: boolean;
}

const Checkbox = ({
  value,
  onValueChange,
  color = colors.primary,
  disabled = false,
}: CheckboxProps) => {
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        {
          borderColor: value ? color : colors.background,
          backgroundColor: value ? color : "transparent",
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
      hitSlop={8}
    >
      {value && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={16} color={colors.backgroundSecondary} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Checkbox;
