import { colors } from "@/constants/colors"
import { icons } from "@/constants/icons"
import { MessageResponse } from "@/lib/api"
import DateTimePicker from "@react-native-community/datetimepicker"
import React, { useState } from "react"
import { Image, Pressable, Text, View } from "react-native"
import Dropdown from "../Dropdown"

// Filter section only (card with date picker). Used inside Records FlatList header.
export interface LogsHistoryFilterSectionProps {
  afterDate: Date | null
  onAfterDateChange: (date: Date | null) => void
  typeFilter: "all" | "voice" | "text"
  onTypeFilterChange: (filter: "all" | "voice" | "text") => void
  /** When true, no card wrapper (use when inside another white container) */
  inline?: boolean
}

export function LogsHistoryFilterSection({
  typeFilter,
  afterDate,
  onAfterDateChange,
  inline = false,
}: LogsHistoryFilterSectionProps) {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false)

  const content = (
    <View className="flex-column items-end gap-2">
      <View
        className="flex-row items-center"
        style={{ zIndex: isTypeDropdownOpen ? 10 : undefined }}
      >
        <Text className="text-lg">Message Type: </Text>
        <Pressable style={{ zIndex: isTypeDropdownOpen ? 10 : undefined }}>
          <Dropdown
            placeholder={typeFilter}
            options={[
              { label: "All", value: "All" },
              { label: "Text", value: "Text" },
              { label: "Voice", value: "Voice" },
            ]}
            onOpenChange={setIsTypeDropdownOpen}
          />
        </Pressable>
      </View>

      <View className="flex-row items-center">
        <Text className="text-lg">After: </Text>
        <Pressable
          className="flex-row items-center"
          style={{
            borderColor: colors.background,
            borderRadius: 10,
          }}
        >
          <View style={{ transform: [{ scale: 0.9 }], padding: 0, margin: 0 }}>
            <DateTimePicker
              value={afterDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                onAfterDateChange(selectedDate ?? null)
              }}
            />
          </View>
        </Pressable>
      </View>
    </View>
  )

  if (inline) {
    return <View className="p-4">{content}</View>
  }

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
      {content}
    </View>
  )
}

// Single log row. Used as FlatList renderItem.
export interface LogsHistoryItemProps {
  item: MessageResponse
}

export function LogsHistoryItem({ item }: LogsHistoryItemProps) {
  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center gap-4">
        <View
          className={`w-10 h-10 rounded-full ${item.message_type === "text" ? "bg-primary" : "bg-success"} items-center justify-center opacity-75`}
        >
          <Image
            source={item.message_type === "text" ? icons.comment : icons.voice}
            className="w-6 h-6"
          />
        </View>
        <View>
          <Text className="text-lg">{item.title}</Text>
          <Text className="text-sm text-textSecondary">
            {item.created_at.split("T")[0]}
          </Text>
        </View>
      </View>
    </View>
  )
}
