import { colors } from "@/constants/colors"
import { icons } from "@/constants/icons"
import { MessageResponse } from "@/lib/api"
import DateTimePicker from "@react-native-community/datetimepicker"
import React, { useState } from "react"
import { Image, Modal, Platform, Pressable, Text, View } from "react-native"
import Dropdown from "../Dropdown"

// Filter section only (card with date picker). Used inside Records FlatList header.
export interface LogsHistoryFilterSectionProps {
  afterDate: Date | null
  onAfterDateChange: (date: Date | null) => void
  typeFilter: "all" | "voice" | "text"
  onTypeFilterChange: (filter: "all" | "voice" | "text") => void
  inline?: boolean
}

export function LogsHistoryFilterSection({
  typeFilter,
  afterDate,
  onAfterDateChange,
  onTypeFilterChange,
  inline = false,
}: LogsHistoryFilterSectionProps) {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const openDatePicker = () => setShowDatePicker(true)
  const closeDatePicker = () => setShowDatePicker(false)

  const onDateChange = (event: { type: string }, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      closeDatePicker()
      return
    }
    if (event.type === "set" && selectedDate) {
      onAfterDateChange(selectedDate)
      if (Platform.OS === "android") {
        closeDatePicker()
      }
    }
  }

  const pickerValue = afterDate ?? new Date()

  const dropdownValue =
    typeFilter === "all"
      ? "All"
      : typeFilter === "text"
        ? "Text"
        : "Voice"

  const content = (
    <View className="flex-column items-end gap-2">
      <View
        className="flex-row items-center justify-between w-full"
        style={{ zIndex: isTypeDropdownOpen ? 10 : undefined }}
      >
        <View>
          <Pressable
            hitSlop={12}
            onPress={() => {
              onAfterDateChange(null)
              onTypeFilterChange("all")
            }}
          >
            <Text className="text-base text-accent font-semibold">
              Clear Filter
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center">
          <Text className="text-lg mr-2">Message Type:</Text>
          <Pressable style={{ zIndex: isTypeDropdownOpen ? 10 : undefined }}>
            <Dropdown
              placeholder={dropdownValue}
              options={[
                { label: "All", value: "All" },
                { label: "Text", value: "Text" },
                { label: "Voice", value: "Voice" },
              ]}
              value={dropdownValue}
              onOpenChange={setIsTypeDropdownOpen}
              onValueChange={(selectedValue) => {
                if (selectedValue === "All") onTypeFilterChange("all")
                else if (selectedValue === "Text") onTypeFilterChange("text")
                else onTypeFilterChange("voice")
              }}
            />
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center">
        <Text className="text-lg">After: </Text>
        <Pressable
          onPress={openDatePicker}
          className="flex-row items-center min-h-8 justify-center px-4"
          style={{
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text
            className={`text-lg ${afterDate ? "text-textPrimary" : "text-textSecondary"}`}
          >
            {afterDate ? pickerValue.toLocaleDateString() : "Select a date"}
          </Text>
        </Pressable>

        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={closeDatePicker}
        >
          <Pressable
            className="flex-1 justify-end bg-black/40"
            onPress={closeDatePicker}
          >
            <Pressable
              className="bg-backgroundSecondary rounded-t-2xl px-4 pt-4 pb-8"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-end mb-2">
                <Pressable onPress={closeDatePicker} hitSlop={12}>
                  <Text className="text-base text-accent font-semibold">
                    Done
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={pickerValue}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={onDateChange}
              />
            </Pressable>
          </Pressable>
        </Modal>
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
