import EntryFloatingActionButton from "@/components/components/EntryFloatingActionButton"
import DailyInspirationCard from "@/components/Home/DailyInspirationCard"
import Streak from "@/components/Home/Streak"
import { colors } from "@/constants/colors"
import { icons } from "@/constants/icons"
import { useAuth } from "@/lib/AuthContext"
import { useEntryOverlay } from "@/lib/contexts/EntryOverlayContext"
import { useMessages } from "@/lib/hooks/useMessages"
import { router } from "expo-router"
import { BlurView } from "expo-blur"
import React, { useState } from "react"
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

function getFirstName(fullName?: string) {
  const trimmed = fullName?.trim()
  if (trimmed) {
    const firstName = trimmed.split(/\s+/)[0]
    if (firstName) {
      return firstName[0].toUpperCase() + firstName.slice(1).toLowerCase()
    }
  }
  return "there"
}

const Home = () => {
  const [backendMessage, setBackendMessage] = useState<string>("")
  const { showEntryOption, setShowEntryOption } = useEntryOverlay()
  const { messages, isLoading, error, reload, createMessage } = useMessages()
  const { user } = useAuth()
  const firstName = getFirstName(user?.full_name)

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Back Button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/** Header */}
          <View
            className="mb-6 h-24 rounded-b-[30px] overflow-hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            }}
          >
            {/* iOS-like translucent header background */}
            <BlurView
              intensity={70}
              tint="light"
              style={StyleSheet.absoluteFillObject}
            />
            {/* Small overlay to keep text readable over arbitrary backgrounds */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(255, 255, 255, 0.35)",
              }}
            />

            <View className="flex-row justify-between px-6 pt-4 h-full">
              <View>
                <Text className="font-instrument text-2xl" style={{ color: colors.textPrimary }}>
                  Hello{" "}
                  <Text style={{ color: colors.primary }}>{firstName}</Text>
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  What made you 1% better today?
                </Text>
              </View>

              <Pressable onPress={() => router.push("/Profile")}>
                <Image
                  source={icons.profile}
                  style={{
                    width: 26,
                    height: 26,
                    tintColor: colors.textPrimary,
                  }}
                />
              </Pressable>
            </View>
          </View>

          {/** CTA button */}
          <View className="items-center">
            <Pressable
              className="bg-primary px-8 py-6 rounded-2xl"
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
              }}
              onPress={() => setShowEntryOption(!showEntryOption)}
            >
              <Text className="color-backgroundSecondary text-2xl">
                What made you 1% better today?
              </Text>
            </Pressable>
          </View>

          {/* Grayed-out overlay */}
          {showEntryOption && (
            <Pressable
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 5,
              }}
              onPress={() => setShowEntryOption(false)}
            />
          )}

          {/* Entry buttons */}
          {showEntryOption && (
            <EntryFloatingActionButton
              onNavigateToEntry={() => setShowEntryOption(false)}
            />
          )}

          {/** Streak indicator */}
          <View className="mt-8 px-6 gap-2">
            <View className="flex-row justify-between items-center">
              <View className="flex-row gap-2 items-center">
                <Image source={icons.fire} className="w-6 h-6" />
                <Text className="text-2xl">Past 7 days Streak</Text>
              </View>
              <Pressable onPress={() => router.replace("/Records")}>
                <Text className="text-primary font-semibold text-lg">
                  View All{" "}
                </Text>
              </Pressable>
            </View>
            <Streak messageList={messages} />

            <View className="flex-row items-center mt-4 gap-2">
              <Image source={icons.lamp} className="w-6 h-6" />
              <Text className="text-2xl">Today&apos;s idea</Text>
            </View>
            <DailyInspirationCard
              recentMessages={messages}
              onStartEntry={() => setShowEntryOption(true)}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Home
