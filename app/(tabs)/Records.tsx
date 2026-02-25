import BarChartComponent from "@/components/Records/BarChartComponent";
import LogsHistory from "@/components/Records/LogsHistory";
import React from "react";
import {
  Keyboard,
  ScrollView,
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
        <View>
          {/* Header */}
          <View className="absolute z-10 h-32 w-[100%] justify-end bg-backgroundSecondary">
            <Text className="text-3xl ml-6 mb-2">Records</Text>
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Bar Chart */}
            <View className="gap-4 px-6 mt-40">
              <BarChartComponent />
              {/* Logs History */}
              <Text className="text-xl">Logs History</Text>
              <LogsHistory />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Records;
