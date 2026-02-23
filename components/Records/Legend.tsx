import { colors } from "@/constants/colors";
import React from "react";
import { Text, View } from "react-native";

type legendType = {
    color: string,
    text: string
}

const legendList: legendType[] = [
  { color: colors.success, text: "Voice Log" },
  { color: colors.primary, text: "Text Log" },
];

const LegendRenderItem = ({ item }: { item: legendType }) => {
  return (
    <View className="flex-row items-center gap-2">
      <View
        className="w-8 h-2 rounded-xl"
        style={{ backgroundColor: item.color }}
      />
      <Text>{item.text}</Text>
    </View>
  );
};

const Legend = () => {
  return (
    <View className="flex-row gap-4">
      {legendList.map((item, index) => (
        <LegendRenderItem key={index} item={item} />
      ))}
    </View>
  );
};

export default Legend;
