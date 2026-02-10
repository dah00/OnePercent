import { icons } from "@/constants/icons";
import { MessageResponse } from "@/lib/api";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";

type MessageListProps = {
  messages: MessageResponse[];
};

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "No date";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

const MessageList = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <View className="p-4">
        <Text>No entries yet</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="rounded-lg p-4">
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="bg-blue-400 rounded-full p-2">
                <Image
                  source={
                    item.message_type === "text" ? icons.comment : icons.voice
                  }
                  className="w-6 h-6"
                />
              </View>
              <View className="ml-3">
                <Text className="font-semibold">{item.title ?? 'No title'}</Text>
                {item.content ? (
                  <Text className="text-xs text-gray-400">{item.content}</Text>
                ) : null}
              </View>
            </View>
            <Text className="text-xs text-gray-400">
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
      )}
      ItemSeparatorComponent={() => (
        <View className="bg-secondary h-1 w-full" />
      )}
    />
  );
};

export default MessageList;
