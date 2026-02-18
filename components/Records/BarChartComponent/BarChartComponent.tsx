import { colors } from "@/constants/colors";
import { useMessages } from "@/lib/hooks/useMessages";
import React, { useEffect, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type stackDataType = {
  label: string;
  stacks: [{ value: number; color: string }, { value: number; color: string }];
};

// Labels:
/**
 * weekData = [
 * {label: "01/05", stacks: [{value: 1, color: colors.primary}]}
 * {label: "01/12", stacks: [{value: 1, color: colors.primary}]}
 * {label: "01/18", stacks: [{value: 1, color: colors.primary}], {value: 1, color: colors.success}}
 *
 * ]
 */

const BarChartComponent = () => {
  const { messages } = useMessages();
  const [weekData, setWeekDate] = useState<stackDataType[]>([]);
  const [monthData, setMonthData] = useState<stackDataType[]>([]);
  const [yearData, setYearData] = useState<stackDataType[]>([]);
  const { width, height } = useWindowDimensions();

  const barColor = {
    text: colors.primary,
    audio: colors.success,
  };

  useEffect(() => {
    // Set Date (MM/DD) of the last 7 days: 6 days ago .. today
    let pastSevenDay: Date[] = [];
    let today = new Date();

    console.log(messages[4]);

    // Filter messages to get messages from the last 7 days
    const past7DaysMessages = messages.filter((message) => {
      const messageDate = new Date(message.created_at);
      return messageDate.getDate() > messageDate.getDate() - 7;
    });

    let weekMessages: stackDataType[] = [];
    past7DaysMessages.forEach((message) => {
      const messageDate = new Date(message.created_at);
      const label = messageDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });
      const isText = message.message_type === "text";
      weekMessages.push({
        label: label,
        stacks: [
          { value: isText ? 1 : 0, color: "#4CAF50" }, // Text log
          { value: isText ? 0 : 1, color: "#2196F3" }, // voice log
        ],
      });
    });

    setWeekDate(weekMessages);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      pastSevenDay.push(d);
    }
  }, [messages]);

  return (
    <View>
      <Text>BarChartComponent</Text>
      <BarChart
        stackData={weekData}
        barWidth={24}
        spacing={12}
        maxValue={8}
        noOfSections={4}
        stepValue={2}
        roundedTop={true}
        adjustToWidth={true}
        parentWidth={width - 32}
        xAxisLabelTextStyle={{ fontSize: 12 }}
        // onPress={(item, index) => {
        //   /* optional */
        // }}
      />
    </View>
  );
};

export default BarChartComponent;
