import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { AuthProvider } from "@/lib/AuthContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { Image, StatusBar, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, {
  ErrorToast,
  SuccessToast,
  type ToastConfigParams,
} from "react-native-toast-message";
import "./global.css";

// Apply default font family globally before first render
(Text as any).defaultProps = (Text as any).defaultProps || {};
{
  const existing = (Text as any).defaultProps.style;
  const arr = Array.isArray(existing) ? existing : existing ? [existing] : [];
  (Text as any).defaultProps.style = [{ fontFamily: "InstrumentSans" }, ...arr];
}

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
{
  const existing = (TextInput as any).defaultProps.style;
  const arr = Array.isArray(existing) ? existing : existing ? [existing] : [];
  (TextInput as any).defaultProps.style = [
    { fontFamily: "InstrumentSans" },
    ...arr,
  ];
}

// Strong override: ensure InstrumentSans is appended last so it wins over NativeWind class styles
{
  const originalTextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = originalTextRender?.apply(this, args);
    const originStyle = origin?.props?.style;
    const styleArray = Array.isArray(originStyle)
      ? originStyle
      : originStyle
        ? [originStyle]
        : [];
    return React.cloneElement(origin, {
      style: [...styleArray, { fontFamily: "InstrumentSans" }],
    });
  };

  const originalInputRender = (TextInput as any).render;
  (TextInput as any).render = function (...args: any[]) {
    const origin = originalInputRender?.apply(this, args);
    const originStyle = origin?.props?.style;
    const styleArray = Array.isArray(originStyle)
      ? originStyle
      : originStyle
        ? [originStyle]
        : [];
    return React.cloneElement(origin, {
      style: [...styleArray, { fontFamily: "InstrumentSans" }],
    });
  };
}

// Toast configuration for success and failed events
const toastConfig = {
  success: (props: ToastConfigParams<object>) => (
    <SuccessToast
      {...props}
      style={{ borderLeftColor: colors.success, borderLeftWidth: 6 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignSelf: "center",
        alignItems: "center",
      }}
      text1Style={{
        fontSize: 22,
        fontWeight: "600",
        color: colors.success,
        textAlign: "center",
      }}
      text2Style={{
        fontSize: 15,
        color: colors.textPrimary,
        textAlign: "center",
      }}
      renderLeadingIcon={() => (
        <View className="justify-center pl-8">
          <Image source={icons.successful_check} className="w-10 h-10" />
        </View>
      )}
    />
  ),
  error: (props: ToastConfigParams<object>) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: colors.error, borderLeftWidth: 6 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignSelf: "center",
        alignItems: "center",
      }}
      text1Style={{
        fontSize: 22,
        fontWeight: "600",
        color: colors.error,
        textAlign: "center",
      }}
      text2Style={{
        fontSize: 15,
        color: colors.textPrimary,
        textAlign: "center",
      }}
      renderLeadingIcon={() => (
        <View className="justify-center px-6">
          <Image source={icons.failed_cross} className="w-12 h-12" />
        </View>
      )}
    />
  ),
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InstrumentSans: require("../assets/fonts/Instrument_Sans/InstrumentSans-VariableFont_wdth,wght.ttf"),
    "InstrumentSans-Italic": require("../assets/fonts/Instrument_Sans/InstrumentSans-Italic-VariableFont_wdth,wght.ttf"),
  });

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar hidden={true} />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          <Stack.Screen name="(entries)" options={{ headerShown: false }} />
        </Stack>
        {/* TODO: Fix: Toast doesn't dismiss after 5 second */}
        <Toast config={toastConfig} topOffset={60} autoHide={true} visibilityTime={5000} swipeable={true}/>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
