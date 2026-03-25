import Button from "@/components/Button"
import TextField from "@/components/TextField"
import { useAuth } from "@/lib/AuthContext"
import { Link, router } from "expo-router"
import React, { useState } from "react"
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Login = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const handleLogIn = async () => {
    // Trim whitespace and validate
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setShowErrors(true)
      return
    }

    setShowErrors(false)
    setIsLoading(true)

    try {
      await login(trimmedEmail, trimmedPassword)

      // Navigate immediately - success alert is optional
      router.replace("/")
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Something went wrong",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 ">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6 gap-12"
        >
          {/*Header*/}
          <View>
            <Text className="text-5xl font-medium text-center">Login</Text>
          </View>

          {/* Text Fields */}
          <View className="gap-3">
            <TextField
              placeholder="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
              }}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              isRequired={true}
              showError={showErrors && !email.trim()}
            />
            <TextField
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text)
              }}
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry={true}
              isRequired={true}
              showError={showErrors && !password.trim()}
            />
            <View className="flex items-end">
              <Link href="/forgot-password" className="text-accent underline">
                Forgot Password
              </Link>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View className="">
            <Text>
              Don't have an account,{" "}
              <Link href="/sign-up" className="text-accent underline">
                sign up
              </Link>{" "}
              now
            </Text>
          </View>

          {/* Sign In button */}
          <View className="items-center">
            <Button
              text={isLoading ? "Logging In..." : "Log In"}
              onPress={handleLogIn}
              size="lg"
              disabled={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Login
