import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { toDateKey } from "@/lib/utils/dateFormatters";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import DatePickerSection from "../Recording/DatePickerSection";

const mockData = [
  {
    id: 1,
    user_id: 1,
    title: "Workout 2hrs",
    message_type: "text",
    created_at: "2025-02-03",
    updated_at: null,
    voice_file_path: null,
  },
  {
    id: 2,
    user_id: 1,
    title: "Read 10 pages",
    message_type: "voice",
    created_at: "2025-03-04",
    updated_at: null,
    voice_file_path: null,
  },
];

const LogsHistory = () => {
  const [afterDate, setAfterDate] = useState<Date | null>();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  return (
    <View
      className="bg-backgroundSecondary rounded-2xl p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      }}
    >
      {/* Filter section */}
      <View className="flex-row justify-end items-center">
        <Text>After: </Text>
        <Pressable
          onPress={() => setShowDatePicker(!showDatePicker)}
          className="flex-row p-2 gap-2 bg-background items-center"
          style={{
            borderColor: colors.background,
            borderRadius: 10,
          }}
        >
          <Image source={icons.calendar} className="h-4 w-4" />
          <Text>{afterDate ? toDateKey(afterDate) : "All time"}</Text>
          {showDatePicker ? (
            <Image source={icons.arrow_up} className="h-6 w-6" />
          ) : (
            <Image source={icons.arrow_down} className="h-6 w-6" />
          )}
        </Pressable>
        {showDatePicker && (
          <DatePickerSection
            scheduledDate={afterDate ?? null}
            onDateChange={(date) => setAfterDate(date)}
          />
        )}
      </View>
    </View>
  );
};

export default LogsHistory;
