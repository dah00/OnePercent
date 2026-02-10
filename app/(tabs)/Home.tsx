import EntryFloatingActionButton from "@/components/components/EntryFloatingActionButton";
import MessageList from "@/components/Home/MessageList";
import Streak from "@/components/Home/Streak";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useEntryOverlay } from "@/lib/contexts/EntryOverlayContext";
import { useMessages } from "@/lib/hooks/useMessages";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [backendMessage, setBackendMessage] = useState<string>("");
  const { showEntryOption, setShowEntryOption } = useEntryOverlay();
  const {
    messages,
    isLoading,
    error,
    reload,
    createMessage,
  } = useMessages();

  return (
    <SafeAreaView className="flex-1 bg-secondary " edges={[]}>
      {/* Back Button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/** Header */}
          <View className="mb-10 bg-textPrimary h-56 rounded-b-[38px]">
            <View className="flex-row justify-between px-6 pt-32 h-full">
              <Text className="color-backgroundSecondary font-instrument text-4xl">
                Hello, <Text className="color-primary"> Rio</Text>
              </Text>
              <Pressable onPress={() => router.push("/Profile")}>
                <Image
                  source={icons.profile}
                  style={{
                    width: 26,
                    height: 26,
                    tintColor: colors.backgroundSecondary,
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
            <Text className="font-semibold text-2xl">Past 7 days Streak</Text>
            <Text className="color-button">
              5 out of 7 streak in the past 7 days
            </Text>
            <Streak />
          </View>

          {/* Messages list (optional - uncomment to show) */}
          {/* <View className="mt-6 mb-10 px-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl">My entries</Text>
              <Pressable onPress={reload}>
                <Text className="text-accent text-sm">Refresh</Text>
              </Pressable>
            </View>

            <View className="bg-primary rounded-lg mt-4">
              {isLoading ? (
                <View className="p-4">
                  <Text>Loading messages…</Text>
                </View>
              ) : error ? (
                <View className="p-4">
                  <Text className="text-red-500">
                    {typeof error === "string" ? error : JSON.stringify(error)}
                  </Text>
                </View>
              ) : (
                <MessageList messages={messages} />
              )}
            </View>
          </View> */}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Home;
