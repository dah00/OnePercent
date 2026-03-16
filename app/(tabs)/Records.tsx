import BarChartComponent from "@/components/Records/BarChartComponent"
import {
  LogsHistoryFilterSection,
  LogsHistoryItem,
} from "@/components/Records/LogsHistory"
import { MessageResponse } from "@/lib/api"
import { useLogsHistory } from "@/lib/hooks/useLogsHistory"
import React, { useCallback, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "@/constants/colors"

const Records = () => {
  const [afterDate, setAfterDate] = useState<Date | null>(new Date())
  const [typeFilter, setTypeFilter] = useState<"all" | "voice" | "text">("all")

  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
  } = useLogsHistory({ afterDate, typeFilter, limit: 25 })

  const renderItem = useCallback(({ item }: { item: MessageResponse }) => (
    <LogsHistoryItem item={item} />
  ), [])

  const listHeaderComponent = useCallback(
    () => (
      <LogsHistoryFilterSection
        afterDate={afterDate}
        onAfterDateChange={setAfterDate}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        inline
      />
    ),
    [afterDate, typeFilter],
  )

  const itemSeparatorComponent = useCallback(
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: colors.lightGrey,
          marginHorizontal: 16,
        }}
      />
    ),
    [],
  )

  const listFooterComponent = useCallback(
    () =>
      isLoadingMore ? (
        <View className="p-8 items-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : null,
    [isLoadingMore],
  )

  return (
    <SafeAreaView className="flex-1 bg-background" edges={[]}>
      <View className="flex-1">
        {/* Header */}
        <View className="absolute z-10 h-32 w-[100%] justify-end bg-backgroundSecondary">
          <Text className="text-3xl ml-6 mb-2">Records</Text>
        </View>

        <View className="flex-1 px-6">
          <View style={{ height: 130 }} />
          <View className="gap-4">
            <BarChartComponent />
            <Text className="text-xl">Logs History</Text>
          </View>
          <View
            className="flex-1 mt-4 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.backgroundSecondary,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 24,
            }}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              ListHeaderComponent={listHeaderComponent}
              ItemSeparatorComponent={itemSeparatorComponent}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={listFooterComponent}
              contentContainerStyle={{ paddingBottom: 24 }}
              ListEmptyComponent={
            isLoading ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : error ? (
              <View className="py-12 px-6">
                <Text className="text-center text-textSecondary">{error}</Text>
              </View>
            ) : (
              <View className="py-12 px-6">
                <Text className="text-center text-textSecondary">No logs yet</Text>
              </View>
            )
          }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Records
