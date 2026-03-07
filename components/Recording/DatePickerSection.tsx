import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { formatDateTime } from "@/lib/utils/dateFormatters";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";

interface DatePickerSectionProps {
  scheduledDate: Date | null;
  onDateChange: (date: Date) => void;
}

const DatePickerSection: React.FC<DatePickerSectionProps> = ({
  scheduledDate,
  onDateChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const handleDateChange = (event: any, selectDate?: Date) => {
    if (selectDate) {
      setTempDate(selectDate);
    }
    // Only close if explicitly dismissed
    if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  const handleConfirmDate = () => {
    onDateChange(tempDate);
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setTempDate(scheduledDate || new Date());
    setShowDatePicker(false);
  };

  return (
    <>
      <Pressable
        className="bg-primary mt-6 rounded-md justify-center px-4"
        style={{ minHeight: 60, paddingVertical: 12 }}
        onPress={() => {
          setTempDate(scheduledDate || new Date());
          setShowDatePicker(!showDatePicker);
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-sm text-gray-600">Select delivery date</Text>
            {scheduledDate ? (
              <Text className="text-base font-semibold mt-1">
                {formatDateTime(scheduledDate)}
              </Text>
            ) : (
              <Text className="text-sm text-gray-400 mt-1">
                Tap to select date & time
              </Text>
            )}
          </View>
          {scheduledDate && (
            <Image
              source={icons.calendar}
              className="w-6 h-6 ml-4"
              style={{ tintColor: colors.accent }}
            />
          )}
        </View>
      </Pressable>

      {showDatePicker && (
        <View className="mt-4">
          <DateTimePicker
            value={tempDate}
            mode="datetime"
            minimumDate={new Date()}
            onChange={handleDateChange}
            display="default"
            textColor={colors.textPrimary}
            style={{
              height: Platform.OS === "android" ? 120 : undefined,
            }}
          />
          {/* iOS: Add Cancel and Done buttons */}
          <View className="flex-row justify-end gap-4 mt-4 px-2">
            <Pressable
              onPress={handleCancelDate}
              className="px-6 py-2 rounded-md"
              style={{ backgroundColor: colors.lightGrey }}
            >
              <Text className="text-base" style={{ color: colors.textPrimary }}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirmDate}
              className="px-6 py-2 rounded-md"
              style={{ backgroundColor: colors.accent }}
            >
              <Text className="text-base font-semibold text-white">Done</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};

export default DatePickerSection;
