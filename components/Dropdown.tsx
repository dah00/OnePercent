import { Ionicons } from "@expo/vector-icons"
import React, { useState } from "react"
import { Pressable, Text, View } from "react-native"

interface DropdownOption {
  label: string
  value: string
}

interface DropdownProps {
  placeholder?: string
  label?: string
  options: DropdownOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  /** Notify parent when open state changes (e.g. to adjust zIndex of siblings) */
  onOpenChange?: (open: boolean) => void
}

const Dropdown = ({
  placeholder = "Select an option",
  label,
  options,
  value,
  onValueChange,
  disabled = false,
  onOpenChange,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string>("")

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  const selectedOption = options.find((option) => option.value === currentValue)
  const displayText = selectedOption ? selectedOption.label : placeholder

  const handleToggle = () => {
    if (disabled) return
    const next = !isOpen
    setIsOpen(next)
    onOpenChange?.(next)
  }

  const handleSelect = (selectedValue: string) => {
    handleValueChange(selectedValue)
    setIsOpen(false)
    onOpenChange?.(false)
  }

  return (
    <View>
      {label && (
        <Text className="text-sm font-medium mb-2 text-gray-700">{label}</Text>
      )}
      <Pressable
        onPress={handleToggle}
        disabled={disabled}
        className="bg-[#ebeaec] rounded-full px-4 py-1 flex-row gap-2 items-center justify-between"
      >
        <Text className="text-lg">{displayText}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </Pressable>

      {isOpen && (
        <View
          className="absolute z-10 top-8  rounded-xl py-2 px-4 items-center gap-2"
          style={{
            backgroundColor: "#ebeaec",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
        >
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              className="py-1"
            >
              <Text className="text-lg">{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  )
}

export default Dropdown
