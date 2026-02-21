import { colors } from "@/constants/colors";
import { useMessages } from "@/lib/hooks/useMessages";
import { formatDateToMMDDYY } from "@/lib/utils/dateFormatters";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type stackDataType = {
  label: string;
  stacks: Array<{ value: number; color: string }>;
  topLabelComponent?: () => React.ReactNode;
  labelComponent?: () => React.ReactNode;
};

const barColors = {
  text: colors.primary,
  audio: colors.success,
};

const BarChartComponent = () => {
  const { messages } = useMessages();
  const [weekData, setWeekData] = useState<stackDataType[]>([]);
  const [monthData, setMonthData] = useState<stackDataType[]>([]);
  const [yearData, setYearData] = useState<stackDataType[]>([]);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const today = new Date();

    // Build 7 bars: one per day (6 days ago ... today)
    const sevenDays: stackDataType[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = formatDateToMMDDYY(d);

      // Get the month
      const month = dateKey.split("/")[0];

      // Count text and voice logs for this day
      const logsOnDay = messages.filter((m) => {
        const msgDate = new Date(m.created_at);
        return formatDateToMMDDYY(msgDate) === dateKey;
      });

      const textCountWeek = logsOnDay.filter(
        (m) => m.message_type === "text",
      ).length;
      const voiceCount = logsOnDay.filter(
        (m) => m.message_type === "voice",
      ).length;

      const totalCount = textCountWeek + voiceCount;

      sevenDays.push({
        label: dateKey,
        stacks: [
          { value: textCountWeek, color: barColors.text },
          { value: voiceCount, color: barColors.audio },
        ],
        topLabelComponent: () => (
          <Text style={{ fontSize: 12, fontWeight: "600" }}>{totalCount}</Text>
        ),
        labelComponent: () => (
          <View className="items-start w-20 bg-border ">
            <Text
              style={{
                fontSize: 12,
                color: colors.textPrimary,
                transform: [{ rotate: "-90deg" }],
              }}
            >
              {dateKey}
            </Text>
          </View>
        ),
      });
    }

    setWeekData(sevenDays);
  }, [messages]);

  // Y-axis: maxValue = noOfSections * stepValue. Scale to fit data.
  const maxBarTotal =
    weekData.length > 0
      ? Math.max(
          ...weekData.map((d) => d.stacks.reduce((sum, s) => sum + s.value, 0)),
        )
      : 0;
  const maxValue = Math.max(4, maxBarTotal);
  const noOfSections = 4;
  const stepValue = Math.ceil(maxValue / noOfSections);

  return (
    <View
      className="bg-backgroundSecondary rounded-2xl h-[360px] p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      }}
    >
      <View className="w-[80%] self-center bg-background rounded-xl">
        <View className="flex-row justify-around gap-1 p-1">
          <View className={`bg-white flex-1 items-center rounded-lg`}>
            <Pressable>
              <Text className="text-xl">Week</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center">
            <Pressable className="">
              <Text className="text-xl">Month</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center">
            <Pressable className="">
              <Text className="text-xl">Year</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View
        style={{ width: "100%", flex: 1 }}
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        <BarChart
          stackData={weekData}
          maxValue={noOfSections * stepValue}
          noOfSections={noOfSections}
          stepValue={stepValue}
          barBorderRadius={8}
          adjustToWidth={true}
          parentWidth={chartWidth}
          yAxisThickness={0}
          xAxisThickness={1}
          hideRules={true}
          hideYAxisText={true}
          labelsExtraHeight={40}
        />
      </View>
    </View>
  );
};

export default BarChartComponent;
