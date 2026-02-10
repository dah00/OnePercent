// lib/hooks/useMessages.ts

import type {
  MessagePayload,
  MessageResponse,
  MessageStatsResponse,
  VoiceMessagePayload
} from "@/lib/api";
import {
  createMessage,
  deleteMessage,
  getMessages,
  getMessageStats,
  updateMessage,
  uploadVoiceMessage,
} from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export function useMessages() {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
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
    loadStats();
  }, [loadMessages, loadStats]);

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


    await loadStats();

    return { success: true };
  };

  const uploadVoiceMessageHandler = async (voiceMessagePayload: VoiceMessagePayload) => {
    const response = await uploadVoiceMessage(voiceMessagePayload)
    if(!response.success || !response.data){
      const errorMsg = typeof response.error === "string" ? response.error : JSON.stringify(response.error || "Failed to upload a voice message")
      return {success: false, error: errorMsg}
    }
    
    const newVoiceMessage: MessageResponse = response.data;
    setMessages((prev) => [newVoiceMessage, ...prev])

    await loadStats();

    return {success: true}
  }
 
  const updateMessageHandler = async (
    id: number,
    payload: Partial<MessagePayload>,
  ) => {
    const response = await updateMessage(id, payload);
    if (response.success && response.data) {
      setMessages((prev) =>
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
    isLoading,
    error,
    reload: loadMessages,
    updateMessage: updateMessageHandler,
    createMessage: createMessageHandler,
    uploadVoiceMessage: uploadVoiceMessageHandler,
    deleteMessage: deleteMessageHandler,
  };
}
