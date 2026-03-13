import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useAuth } from "@/lib/AuthContext";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getInitials(fullName?: string, email?: string): string {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  if (email?.trim()) {
    const local = email.split("@")[0];
    return local.slice(0, 2).toUpperCase();
  }
  return "?";
}

function formatJoinedDate(createdAt?: string): string {
  if (!createdAt) return "";
  try {
    const date = new Date(createdAt);
    return `Joined ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  } catch {
    return "";
  }
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const initials = getInitials(user?.full_name, user?.email);
  const joinedDate = formatJoinedDate(user?.created_at);

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
          <Text className="text-4xl font-instrument text-textSecondary">
            {initials}
          </Text>
        </View>

        {/* Name & join date */}
        <View className="pt-24 px-6 pb-2 items-center gap-2 bg-backgroundSecondary rounded-2xl mx-4 min-h-32">
          <Text className="text-3xl font-instrument text-textPrimary">
            {user?.full_name ?? "User"}
          </Text>
          {joinedDate ? (
            <Text className="text-textSecondary text-base">{joinedDate}</Text>
          ) : null}
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
              {user?.email ?? ""}
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
