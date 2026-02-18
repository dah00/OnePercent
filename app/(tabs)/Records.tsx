import BarChartComponent from "@/components/Records/BarChartComponent/BarChartComponent";
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
    <SafeAreaView className="flex-1 bg-secondary " edges={[]}>
      {/* Back Button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="my-24 mx-8">
            <BarChartComponent />
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
