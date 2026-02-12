import { colors } from "@/constants/colors";
import React from "react";
import { ActivityIndicator, Image, Pressable, Text } from "react-native";

interface ButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  text: string;
}

const Button = ({
  onPress,
  isLoading = false,
  disabled = false,
  variant,
  size,
  text,
}: ButtonProps) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "py-2 px-4";
      case "md":
        return "py-4 px-6";
      case "lg":
        return "py-5 px-8";
      default:
        return "py-4 px-6";
    }
  };

  const isDisabled = disabled || isLoading;

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      className={`${getSizeStyles()} bg-primary rounded-xl`}
      style={{ opacity: isDisabled ? 0.5 : 1 }}
    >
      <Text className="text-white text-xl">{text}</Text>
      {isLoading && <ActivityIndicator size="small" color={colors.background} />}
    </Pressable>
  );
};

export default Button;
