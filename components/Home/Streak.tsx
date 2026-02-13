import { MessageResponse } from "@/lib/api";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";

/**
 * TODO:
 * - fix: show all 7 days and not just 5
 * - fix display days from right to left for the past 7 days
 */

interface DayLog {
  day: string;
  logged: boolean;
}

const pastSevenDayLogs: DayLog[] = [
  { day: "2025-12-22", logged: true },
  { day: "2025-12-23", logged: false },
  { day: "2025-12-24", logged: true },
  { day: "2025-12-25", logged: true },
  { day: "2025-12-26", logged: false },
  { day: "2025-12-27", logged: false },
  { day: "2025-12-28", logged: true },
];

const Streak = ( {messageList}: {messageList: MessageResponse[]}) => {
  const getDayName = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    // console.log(date)
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

  // TODO: Finish get the last 7 logs 
  useEffect(() => {
    // Get the logs within the past 7 days
    const today = new Date();
    let pastSevenDayLogs = [
      {day: today.getDate(), logged: false},
      {day: today.getDate()-1, logged: false},
      {day: today.getDate()-2, logged: false},
      {day: today.getDate()-3, logged: false},
      {day: today.getDate()-4, logged: false},
      {day: today.getDate()-5, logged: false},
      {day: today.getDate()-6, logged: false},
    ]

    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(today.getDate() - 8);
    let logsInPastSevenDays: Date[] = []
    messageList.forEach((message: MessageResponse) => {
      const logDate = new Date(message.created_at)
      if(logDate >= eightDaysAgo){
        logsInPastSevenDays.push(new Date(message.created_at))
      }
    })

    // pastSevenDayLogs.forEach((log) => {
    //   if(logsInPastSevenDays.includes(log)){
        
    //   }
    // })
    // console.log(eightDaysAgo);
  }, []);

  return (
    <View className="px-6 gap-2 items-center justify-between">
      <FlatList
        data={pastSevenDayLogs}
        keyExtractor={(item) => item.day}
        renderItem={renderDayItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
};

export default Streak;
