import { useLogsHistory, DatePreset, TypeFilter } from "@/lib/hooks/useLogsHistory";
import { MessageResponse } from "@/lib/api";
import { colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Types ─────────────────────────────────────────────────────────────────

// ─── Constants ─────────────────────────────────────────────────────────────

const TYPE_OPTIONS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "text", label: "Text" },
  { id: "voice", label: "Voice" },
];

const DATE_OPTIONS: { id: DatePreset; label: string }[] = [
  { id: "7days", label: "Last 7 days" },
  { id: "30days", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

const CARD_STYLE = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 24,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// ─── LogRow (placeholder – customize as needed) ─────────────────────────────

function LogRow({ item }: { item: MessageResponse }) {
  return (
    <View style={styles.logRow}>
      <View style={styles.logRowContent}>
        <Text style={styles.logTitle} numberOfLines={1}>
          {item.title || "Untitled"}
        </Text>
        <Text style={styles.logMeta}>
          {formatDate(item.created_at)} • {item.message_type}
        </Text>
      </View>
    </View>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

const LogsHistory = () => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [datePreset, setDatePreset] = useState<DatePreset>("30days");

  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  } = useLogsHistory({ typeFilter, datePreset });

  const renderFilterChip = (
    id: string,
    label: string,
    isActive: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      onPress={onPress}
      style={[styles.chip, isActive && styles.chipActive]}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.empty}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No logs in this period</Text>
      </View>
    );
  };

  return (
    <View style={[styles.card, CARD_STYLE]}>
      {/* Type filter */}
      <View style={styles.filterRow}>
        {TYPE_OPTIONS.map(({ id, label }) =>
          renderFilterChip(id, label, typeFilter === id, () => setTypeFilter(id as TypeFilter)),
        )}
      </View>

      {/* Date filter */}
      <View style={styles.filterRow}>
        {DATE_OPTIONS.map(({ id, label }) =>
          renderFilterChip(id, label, datePreset === id, () => setDatePreset(id)),
        )}
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <LogRow item={item} />}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        scrollEnabled={true}
        contentContainerStyle={items.length === 0 ? styles.listEmpty : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.button,
    fontWeight: "600",
  },
  logRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  logRowContent: {
    gap: 2,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  logMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  empty: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  listEmpty: {
    flexGrow: 1,
  },
});

export default LogsHistory;
