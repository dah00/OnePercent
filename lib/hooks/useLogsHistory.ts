// lib/hooks/useLogsHistory.ts

import { useCallback, useEffect, useState } from "react";
import {
  getMessagesHistory,
  MessageResponse,
  MessagesHistoryParams,
} from "@/lib/api";

export type TypeFilter = "all" | "text" | "voice";
export type DatePreset = "7days" | "30days" | "all";

interface UseLogsHistoryOptions {
  typeFilter?: TypeFilter;
  datePreset?: DatePreset;
  limit?: number;
}

// Convert date preset to ISO string (or undefined for "all")
function getAfterDate(preset: DatePreset): string | undefined {
  if (preset === "all") return undefined;
  const now = new Date();
  const days = preset === "7days" ? 7 : 30;
  const after = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return after.toISOString();
}

export function useLogsHistory(options: UseLogsHistoryOptions = {}) {
  const { typeFilter = "all", datePreset = "30days", limit = 25 } = options;

  const [items, setItems] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Load first page (resets state)
  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params: MessagesHistoryParams = {
      type_filter: typeFilter,
      after: getAfterDate(datePreset),
      limit,
    };

    const response = await getMessagesHistory(params);

    if (response.success && response.data) {
      setItems(response.data.items);
      setNextCursor(response.data.next_cursor);
      setHasMore(response.data.next_cursor !== null);
    } else {
      const errorMsg =
        typeof response.error === "string"
          ? response.error
          : "Failed to load logs";
      setError(errorMsg);
      setItems([]);
      setHasMore(false);
    }

    setIsLoading(false);
  }, [typeFilter, datePreset, limit]);

  // Load next page (appends to items)
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;

    setIsLoadingMore(true);

    const params: MessagesHistoryParams = {
      type_filter: typeFilter,
      after: getAfterDate(datePreset),
      limit,
      cursor: nextCursor,
    };

    const response = await getMessagesHistory(params);

    if (response.success && response.data) {
      setItems((prev) => [...prev, ...response.data!.items]);
      setNextCursor(response.data.next_cursor);
      setHasMore(response.data.next_cursor !== null);
    } else {
      const errorMsg =
        typeof response.error === "string"
          ? response.error
          : "Failed to load more logs";
      setError(errorMsg);
    }

    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, nextCursor, typeFilter, datePreset, limit]);

  // Reload when filters change
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    reload: loadInitial,
  };
}