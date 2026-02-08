// lib/hooks/useMessages.ts

import type {
  MessagePayload,
  MessageResponse,
  MessageStatsResponse,
} from "@/lib/api";
import {
  createMessage,
  deleteMessage,
  getMessages,
  getMessageStats,
  getUpcomingMessages,
  updateMessage,
} from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export function useMessages() {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [upcomingMessages, setUpcomingMessages] = useState<MessageResponse[]>(
    [],
  );
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState<boolean>(false);
  const [stats, setStats] = useState<MessageStatsResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const response = await getMessages();
    if (response.success && response.data) {
      setMessages(response.data);
      setError(null);
    } else {
      // Ensure error is always a string
      const errorMsg =
        typeof response.error === "string"
          ? response.error
          : JSON.stringify(response.error) || "Failed to load messages";
      setError(errorMsg);
    }
    setIsLoading(false);
  }, []);

  const loadUpcomingMessages = useCallback(async () => {
    setIsLoadingUpcoming(true);
    const response = await getUpcomingMessages();
    if (response.success && response.data) {
      setUpcomingMessages(response.data);
      setError(null);
    } else {
      // Ensure error is always a string
      // console.log(response.error)
      const errorMsg =
        typeof response.error === "string"
          ? response.error
          : JSON.stringify(response.error) ||
            "Failed to load upcoming messages";
      setError(errorMsg);
    }
    setIsLoadingUpcoming(false);
  }, []);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    const response = await getMessageStats();
    if (response.success && response.data) {
      setStats(response.data);
      setError(null);
    } else {
      // Ensure error is always a string
      const errorMsg =
        typeof response.error === "string"
          ? response.error
          : JSON.stringify(response.error) || "Failed to load statistics";
      setError(errorMsg);
    }
    setIsLoadingStats(false);
  }, []);

  useEffect(() => {
    loadMessages();
    loadUpcomingMessages();
    loadStats();
  }, [loadMessages, loadUpcomingMessages, loadStats]);

  const createMessageHandler = async (payload: MessagePayload) => {
    const response = await createMessage(payload);
    if (!response.success || !response.data) {
      // Ensure error is always a string
      const errorMsg =
        typeof response.error === "string"
          ? response.error
          : JSON.stringify(response.error) || "Failed to create message";
      return { success: false, error: errorMsg };
    }
    const newMessage: MessageResponse = response.data;
    setMessages((prev) => [newMessage, ...prev]);

    if (
      newMessage.scheduled_date &&
      new Date(newMessage.scheduled_date) > new Date()
    ) {
      setUpcomingMessages((prev) => [newMessage, ...prev]);
    }

    await loadStats();

    return { success: true };
  };

  const updateMessageHandler = async (
    id: number,
    payload: Partial<MessagePayload>,
  ) => {
    const response = await updateMessage(id, payload);
    if (response.success && response.data) {
      setMessages((prev) =>
        prev.map((message) => (message.id === id ? response.data! : message)),
      );
      setUpcomingMessages((prev) =>
        prev.map((message) => (message.id === id ? response.data! : message)),
      );

      await loadStats();
      return { success: true };
    }
    // Ensure error is always a string
    const errorMsg =
      typeof response.error === "string"
        ? response.error
        : JSON.stringify(response.error) || "Failed to update message";
    return { success: false, error: errorMsg };
  };

  const deleteMessageHandler = async (id: number) => {
    const response = await deleteMessage(id);
    if (response.success) {
      setMessages((prev) => prev.filter((message) => message.id !== id));
      setUpcomingMessages((prev) =>
        prev.filter((message) => message.id !== id),
      );

      await loadStats();
      return { success: true };
    }
    // Ensure error is always a string
    const errorMsg =
      typeof response.error === "string"
        ? response.error
        : JSON.stringify(response.error) || "Failed to delete message";
    return { success: false, error: errorMsg };
  };

  return {
    messages,
    upcomingMessages,
    isLoadingUpcoming,
    isLoading,
    error,
    reload: loadMessages,
    reloadUpcomingMessage: loadUpcomingMessages,
    updateSchedule: updateMessage,
    createMessage: createMessageHandler,
    updateMessage: updateMessageHandler,
    deleteMessage: deleteMessageHandler,
  };
}
