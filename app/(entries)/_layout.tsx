import BackButton from "@/components/BackButton";
import SaveModal from "@/components/components/SaveModal";
import { SaveEntryProvider } from "@/lib/contexts/SaveEntryContext";

import { Slot } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EntriesLayout = () => {
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  return (
    <SaveEntryProvider>
      <SafeAreaView className="flex-1 bg-white">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={12}
            className="flex-1"
          >
            {/* Back and Save Buttons */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 24,
                right: 24,
                zIndex: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BackButton useAbsolute={false} />
              <Pressable
                className="px-6 py-3 rounded-full bg-accent items-center justify-center"
                onPress={() => {
                  setShowSaveModal(true);
                }}
              >
                <Text className="text-white font-bold text-lg">Save</Text>
              </Pressable>
            </View>

            {/* Title Section */}
            <View className="mt-16 px-6 mb-6 items-center">
              <Text className="font-instrument text-3xl mb-1">Today's 1%</Text>
              <Text className="text-base text-gray-600">
                Even one small thing is enough
              </Text>
            </View>

            <SaveModal
              showSaveModal={showSaveModal}
              setShowSaveModal={setShowSaveModal}
            />

            {/* Child Route Content (WriteEntry or RecordEntry) */}
            <View className="flex-1" style={{ paddingBottom: 5 }}>
              <Slot />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SaveEntryProvider>
  );
};

export default EntriesLayout;
