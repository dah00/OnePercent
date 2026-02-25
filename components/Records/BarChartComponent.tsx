import { colors } from "@/constants/colors";
import { MessageResponse } from "@/lib/api";
import { useMessages } from "@/lib/hooks/useMessages";
import {
  getMonthShort,
  isSameMonth,
  toDateKey,
} from "@/lib/utils/dateFormatters";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import Legend from "./Legend";

// ─── Types ─────────────────────────────────────────────────────────────────

type StackSegment = {
  value: number;
  color: string;
  innerBarComponent?: () => React.ReactNode;
};

type StackDataItem = {
  label: string;
  stacks: StackSegment[];
  labelComponent?: () => React.ReactNode;
};

type ChartMode = "week" | "month" | "year";

// ─── Constants ─────────────────────────────────────────────────────────────

const BAR_COLORS = {
  text: colors.primary,
  audio: colors.success,
} as const;

const INNER_LABEL_STYLE = {
  fontSize: 15,
  fontWeight: "600" as const,
  color: colors.backgroundSecondary,
  alignSelf: "center" as const,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Count messages by type for a given filter. */
function countByType(
  messages: MessageResponse[],
  filter: (m: MessageResponse) => boolean,
) {
  const filtered = messages.filter(filter);
  return {
    text: filtered.filter((m) => m.message_type === "text").length,
    audio: filtered.filter((m) => m.message_type === "voice").length,
  };
}

/** Build a single stack segment with optional inner label. */
function buildSegment(
  value: number,
  color: string,
  showLabel: boolean,
): StackSegment {
  return {
    value,
    color,
    innerBarComponent:
      showLabel && value > 0
        ? () => <Text style={INNER_LABEL_STYLE}>{value}</Text>
        : undefined,
  };
}

/** Build one bar's stack data from text/audio counts. */
function buildStackItem(
  label: string,
  textCount: number,
  audioCount: number,
  labelRender: (label: string) => React.ReactNode,
): StackDataItem {
  return {
    label,
    stacks: [
      buildSegment(textCount, BAR_COLORS.text, true),
      buildSegment(audioCount, BAR_COLORS.audio, true),
    ],
    labelComponent: () => labelRender(label),
  };
}

// ─── Component ─────────────────────────────────────────────────────────────

const BarChartComponent = () => {
  const { messages } = useMessages();
  const [mode, setMode] = useState<ChartMode>("week");
  const [chartWidth, setChartWidth] = useState(0);

  // Build week data: 7 bars (6 days ago ... today)
  const weekData = useMemo(() => {
    const today = new Date();
    const result: StackDataItem[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = toDateKey(d);

      const { text, audio } = countByType(messages, (m) => {
        const msgDate = new Date(m.created_at);
        return toDateKey(msgDate) === dateKey;
      });

      result.push(
        buildStackItem(dateKey, text, audio, (lbl) => {
          const [, m, d] = lbl.split("-");
          return (
            <View className="items-center">
              <Text style={{ fontSize: 12, color: colors.textPrimary }}>
                {m}/{d}
              </Text>
            </View>
          );
        }),
      );
    }
    return result;
  }, [messages]);

  // Build month data: 7 bars (6 months ago ... this month)
  const monthData = useMemo(() => {
    const today = new Date();
    const result: StackDataItem[] = [];

    for (let i = 6; i >= 0; i--) {
      const m = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthLabel = getMonthShort(m);

      const { text, audio } = countByType(messages, (msg) => {
        const msgDate = new Date(msg.created_at);
        return isSameMonth(msgDate, m);
      });

      result.push(
        buildStackItem(monthLabel, text, audio, (lbl) => (
          <View className="items-center">
            <Text style={{ fontSize: 14, color: colors.textPrimary }}>
              {lbl}
            </Text>
          </View>
        )),
      );
    }
    return result;
  }, [messages]);

  // Build year data: 7 bars (6 years ago ... this year)
  const yearData = useMemo(() => {
    const today = new Date();
    const result: StackDataItem[] = [];

    for (let i = 6; i >= 0; i--) {
      const y = today.getFullYear() - i;
      const yearLabel = y.toString();

      const { text, audio } = countByType(messages, (msg) => {
        const msgDate = new Date(msg.created_at);
        return msgDate.getFullYear().toString() === yearLabel;
      });

      result.push(
        buildStackItem(yearLabel, text, audio, (lbl) => (
          <View className="items-center">
            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
              {lbl}
            </Text>
          </View>
        )),
      );
    }
    return result;
  }, [messages]);

  const chartData =
    mode === "week" ? weekData : mode === "month" ? monthData : yearData;

  const { maxValue, noOfSections, stepValue } = useMemo(() => {
    const maxBarTotal =
      chartData.length > 0
        ? Math.max(
            ...chartData.map((d) =>
              d.stacks.reduce((sum, s) => sum + s.value, 0),
            ),
          )
        : 0;
    const max = Math.max(4, maxBarTotal);
    const sections = 4;
    const step = Math.ceil(max / sections);
    return {
      maxValue: sections * step,
      noOfSections: sections,
      stepValue: step,
    };
  }, [chartData]);

  const handleLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) =>
      setChartWidth(e.nativeEvent.layout.width),
    [],
  );

  const MODES: { id: ChartMode; label: string }[] = [
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ];

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
      {/* Mode tabs */}
      <View className="w-[80%] self-center bg-background rounded-xl">
        <View className="flex-row justify-around gap-1 p-1">
          {MODES.map(({ id, label }) => (
            <View
              key={id}
              className={`${
                mode === id ? "bg-white" : "bg-background"
              } flex-1 items-center rounded-lg`}
            >
              <Pressable onPress={() => setMode(id)}>
                <Text className="text-xl">{label}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Chart */}
      <View style={{ width: "100%", flex: 1 }} onLayout={handleLayout}>
        <BarChart
          stackData={chartData}
          maxValue={maxValue}
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
        <Legend />
      </View>
    </View>
  );
};

export default BarChartComponent;
