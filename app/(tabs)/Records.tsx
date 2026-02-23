import BarChartComponent from "@/components/Records/BarChartComponent";
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

const Records = () => {
  return (
    <SafeAreaView className="flex-1 bg-background " edges={[]}>
      {/* Back Button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="bg-backgroundSecondary pt-24 pb-6 pl-6 mb-4">
            <Text className="text-3xl">Records</Text>
          </View>

          {/* Bar Chart */}
          <View className="gap-4 px-6">
            {/* <View> */}
            <BarChartComponent />
            {/* </View> */}
            <View>
              <Text>Logs History</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Records;
