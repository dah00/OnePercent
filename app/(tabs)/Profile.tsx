import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { router } from "expo-router";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-background " edges={[]}>
      {/* Back Button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="h-52 rounded-xl bg-lightGrey" />
          <View
            className="absolute z-10 top-52  w-[120px] h-[120px] rounded-full border-2 border-background bg-lightGrey items-center justify-center"
            style={{
              left: "50%",
              marginLeft: -60,
            }}
          >
            {/* <Image/> */}
            <Text className="text-4xl">OV</Text>
          </View>
          <Button
            text="Log Out"
            onPress={async () => {
              await signOut();
              router.push("/login");
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Profile;
