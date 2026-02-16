import { MessageResponse } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

/** Format a Date to YYYY-MM-DD for comparison. */
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface DayLog {
  day: string;
  logged: boolean;
}

const Streak = ({ messageList }: { messageList: MessageResponse[] }) => {
  const [pastSevenDayStreak, setPastSevenDayStreak] = useState<DayLog[]>([]);
  const [logCount, setLogCount] = useState<number>();

  const getDayName = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[date.getDay()];
  };

  const renderDayItem = ({ item }: { item: DayLog }) => {
    const dayStr = getDayName(item.day);
    return (
      <View className="flex-col items-center mx-[8px]">
        <View
          className={`w-8 h-4 ${
            item.logged ? "bg-primary" : "bg-border"
          } rounded-full`}
        />
        <Text className="text-sm mt-2">{dayStr}</Text>
      </View>
    );
  };

  useEffect(() => {
    const today = new Date();
    // Build last 7 days: [6 days ago, 5 days ago, ..., today] (left to right = past to present)
    const sevenDays: DayLog[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      sevenDays.push({ day: toDateKey(d), logged: false });
    }

    // Set of calendar dates (YYYY-MM-DD) that have at least one log
    const loggedDates = new Set(
      messageList.map((m) => toDateKey(new Date(m.created_at))),
    );

    let count = 0;
    const withLogged = sevenDays.map((entry) => {
      let isLogged: boolean = false;
      if (loggedDates.has(entry.day)) {
        isLogged = true;
        count++;
      }
      return {
        ...entry,
        logged: isLogged,
      };
    });
    setLogCount(count);
    setPastSevenDayStreak(withLogged);
  }, [messageList]);

  return (
    <View>
      <Text className="color-darkGrey text-xl">{`${logCount} out of 7 streak in the past 7 days`}</Text>
      <View className="px-6 gap-2 items-center justify-between">
        <FlatList
          data={pastSevenDayStreak}
          keyExtractor={(item) => item.day}
          renderItem={renderDayItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>
    </View>
  );
};

export default Streak;
