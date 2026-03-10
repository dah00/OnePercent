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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header - banner */}
        <View className="h-44 rounded-b-3xl bg-primary px-6" />
        <View
          className="absolute z-10 top-40 w-[90px] h-[90px] rounded-full border-4 border-backgroundSecondary bg-lightGrey items-center justify-center"
          style={{
            left: "50%",
            marginLeft: -45,
          }}
        >
          {/* TODO: Replace with user's profile image */}
          <Text className="text-4xl font-instrument text-textSecondary">
            DV
          </Text>
        </View>

        {/* Name & join date - TODO: Replace with user data from AuthContext */}
        <View className="pt-24 px-6 pb-2 items-center gap-2 bg-backgroundSecondary rounded-2xl mx-4 min-h-32">
          <Text className="text-3xl font-instrument text-textPrimary">
            Dah Velo
          </Text>
          <Text className="text-textSecondary text-base">
            Joined March 2023
          </Text>
        </View>

        {/* Profile Body */}
        <View className="mt-6 mx-4 bg-backgroundSecondary rounded-2xl p-5 min-h-[200px]">
          <Text className="text-2xl font-semibold mb-6 text-textPrimary">
            Information
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Image
                source={icons.email}
                className="w-6 h-6"
                style={{ tintColor: colors.textSecondary }}
              />
              <Text className="text-textSecondary text-lg">Email</Text>
            </View>
            <Text
              className="text-lg text-textPrimary max-w-[60%]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              dah.velo@gmail.com
            </Text>
          </View>

          <View className="h-px w-full bg-lightGrey my-5" />

          <Pressable
            onPress={async () => {
              await signOut();
              router.push("/login");
            }}
            accessibilityLabel="Log out"
            accessibilityRole="button"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-error text-lg font-medium">Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
