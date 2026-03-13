import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import TextField from "@/components/TextField";
import { colors } from "@/constants/colors";
import { useAuth } from "@/lib/AuthContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * TODO:
 * - Remove permanent caps icon above eye icon of the password text field
 *   (This is a system keyboard feature, may require custom keyboard implementation)
 */

const SignUp = () => {
  const { register } = useAuth();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const handleSignUp = async () => {
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate required fields
    if (!trimmedFullName || !trimmedEmail || !trimmedPassword) {
      setShowError(true);
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (trimmedPassword.length < 8) {
      setShowError(true);
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (!isChecked) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }

    setShowError(false);
    setIsLoading(true);

    try {
      await register(trimmedEmail, trimmedPassword, trimmedFullName);
      router.replace("/(tabs)/Home");
    } catch (error) {
      Alert.alert(
        "Sign Up Failed",
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1">
      {/* Back Button */}
      <BackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6 gap-12"
        >
          {/* Header */}
          <View>
            <Text className="text-5xl font-medium text-center">Sign Up</Text>
          </View>

          {/* Text Field */}
          <View className="gap-3">
            <TextField
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              isRequired={true}
              showError={showError && !fullName.trim()}
            />
            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              isRequired={true}
              showError={showError && !email.trim()}
            />
            <TextField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry={true}
              isRequired={true}
              showError={showError && (!password.trim() || password.length < 8)}
            />
          </View>

          {/* Terms and Condition */}
          <View>
            <View className="flex-row items-center gap-4">
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={colors.primary}
              />
              <Text>I agree to the terms & conditions</Text>
            </View>
          </View>

          {/* Sign Up Button */}
          <View className="items-center">
            <Button
              text={isLoading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignUp}
              size="lg"
              disabled={!isChecked || isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignUp;
