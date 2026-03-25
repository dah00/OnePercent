import EntryFloatingActionButton from "@/components/components/EntryFloatingActionButton";
import { colors } from "@/constants/colors";
import {
  EntryOverlayProvider,
  useEntryOverlay,
} from "@/lib/contexts/EntryOverlayContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

/** Outline = unfocused (thin), filled = focused (bold). Uses Ionicons so we get real weight change. */
type TabIconProps = {
  focused: boolean;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

const TabIcon = ({ focused, title, iconName }: TabIconProps) => {
  const name = focused ? iconName : `${String(iconName)}-outline` as keyof typeof Ionicons.glyphMap;
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Ionicons
        name={name}
        size={24}
        color={focused ? colors.background : colors.button}
      />
      <Text
        style={{
          fontSize: 12,
          color: focused ? "#FFFFFF" : "#A8B5DB",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

/** Renders tabs + overlay + FAB; must be inside EntryOverlayProvider to use focus effect */
const TabsLayoutContent = () => {
  const { showEntryOption, setShowEntryOption } = useEntryOverlay();

  // When we return to tabs (e.g. from WriteEntry/RecordEntry), close the overlay
  useFocusEffect(
    useCallback(() => {
      setShowEntryOption(false);
    }, [setShowEntryOption]),
  );

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            flex: 1,
            height: "100%",
            maxWidth: "33%",
          },
          tabBarIconStyle: {
            width: "100%",
            height: "100%",
          },
          tabBarStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            width: "92%",
            height: 75,
            bottom: 18,
            alignSelf: "center",
            borderRadius: 30,
            borderBlockColor: colors.border,
            paddingBottom: 0,
            paddingHorizontal: 12,
            position: "relative",
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: "space-around",
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} iconName="home" title="Home" />
            ),
          }}
        />
        <Tabs.Screen
          name="Records"
          options={{
            title: "Records",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} iconName="folder" title="Records" />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} iconName="person" title="Profile" />
            ),
          }}
        />
      </Tabs>

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

      {/* Floating Action Button - Integrated Design */}
      <Pressable
        onPress={() => setShowEntryOption(!showEntryOption)}
        className="absolute w-[60px] h-[60px] rounded-full bg-primary items-center justify-center z-10 border-2 border-white/30"
        style={{
          left: "50%",
          bottom: 85,
          marginLeft: -30, // Half of button width (60px / 2)
          elevation: 12,
        }}
      >
        <Ionicons name="add" size={36} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

const _Layout = () => (
  <EntryOverlayProvider>
    <TabsLayoutContent />
  </EntryOverlayProvider>
);

export default _Layout;
