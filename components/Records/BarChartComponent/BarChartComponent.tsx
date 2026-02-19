import { colors } from "@/constants/colors";
import { useMessages } from "@/lib/hooks/useMessages";
import { formatDateToMMDDYY } from "@/lib/utils/dateFormatters";
import React, { useEffect, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
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
  const { width } = useWindowDimensions();

  useEffect(() => {
    const today = new Date();

    // Build 7 bars: one per day (6 days ago ... today)
    const sevenDays: stackDataType[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = formatDateToMMDDYY(d);

      // Count text and voice logs for this day
      const logsOnDay = messages.filter((m) => {
        const msgDate = new Date(m.created_at);
        return formatDateToMMDDYY(msgDate) === dateKey;
      });

      const textCount = logsOnDay.filter((m) => m.message_type === "text").length;
      const voiceCount = logsOnDay.filter(
        (m) => m.message_type === "voice"
      ).length;

      const totalCount = textCount + voiceCount;

      sevenDays.push({
        label: dateKey,
        stacks: [
          { value: textCount, color: barColors.text },
          { value: voiceCount, color: barColors.audio },
        ],
        topLabelComponent: () => (
          <Text style={{ fontSize: 12, fontWeight: "600" }}>
            {totalCount}
          </Text>
        ),
        labelComponent: () => (
          <View style={{ alignItems: "center", width: 60 }}>
            <Text
              style={{
                fontSize: 10,
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
          ...weekData.map((d) =>
            d.stacks.reduce((sum, s) => sum + s.value, 0)
          )
        )
      : 0;
  const maxValue = Math.max(4, maxBarTotal);
  const noOfSections = 4;
  const stepValue = Math.ceil(maxValue / noOfSections);

  return (
    <View>
      <Text>BarChartComponent</Text>
      <BarChart
        stackData={weekData}
        barWidth={24}
        spacing={12}
        maxValue={noOfSections * stepValue}
        noOfSections={noOfSections}
        stepValue={stepValue}
        roundedTop={true}
        adjustToWidth={true}
        parentWidth={width - 32}
        yAxisThickness={0}
        xAxisThickness={1}
        hideRules={true}
        hideYAxisText={true}
        labelsExtraHeight={40}
      />
    </View>
  );
};

export default BarChartComponent;
