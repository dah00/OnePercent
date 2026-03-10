import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useAuth } from "@/lib/AuthContext";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={[]}>
      <ScrollView>
        {/* Profile Header */}
        <View className=" h-44 rounded-2xl bg-slate-600" />
        <View
          className="absolute z-10 top-40  w-[90px] h-[90px] rounded-full border-2 border-background bg-lightGrey items-center justify-center"
          style={{
            left: "50%",
            marginLeft: -45,
          }}
        >
          {/* <Image/> User's picture*/}
          <Text className="text-4xl">DV</Text>
        </View>

        <View className="pt-24 items-center gap-1 bg-backgroundSecondary rounded-2xl h-44">
          {/* TODO: Replace with */}
          <Text className="text-3xl">Dah Velo</Text>
          user's full name
          <Text className="text-textSecondary text-md">Joined March 2023</Text>
        </View>

        {/* Profile Body */}
        <View className="mt-10 bg-backgroundSecondary h-[240px] rounded-2xl w-[90%] self-center p-4">
          <Text className="text-2xl mb-6">Information</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Image
                source={icons.email}
                className="w-6 h-6"
                style={{ tintColor: colors.textSecondary }}
              />
              <Text className="text-textSecondary text-xl">Email</Text>
            </View>
            <Text className="text-xl">dah.velo@gmail.com</Text>
          </View>

          <View className="h-1 w-[100%] bg-background my-4" />

          <Pressable
            onPress={async () => {
              await signOut();
              router.push("/login");
            }}
            accessibilityLabel="Log out"
          >
            <Text className="text-error text-xl">Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
