/**
 * useConversationState Hook
 *
 * Verwaltet den reinen State der Conversation.
 * Separiert State-Management von Side Effects.
 */

import { useState, useCallback } from "react";
import type { Message, ConversationResponse } from "../types";
import { mapApiMessageToMessage } from "../types";
import { DEFAULT_INPUT_PLACEHOLDER } from "../constants";

// ============================================
// Types
// ============================================

export interface ConversationState {
  messages: Message[];
  conversationId: string | null;
  prompts: string[];
  imageUrl: string | undefined;
  inputPlaceholder: string;
}

export interface LoadingState {
  isLoading: boolean;
  isInitializing: boolean;
}

export interface StreamingState {
  isStreaming: boolean;
  streamingMessageId: string | null;
}

export interface ConnectionState {
  isConnected: boolean;
  error: string | null;
}

export interface UseConversationStateReturn {
  // State
  state: ConversationState;
  loading: LoadingState;
  streaming: StreamingState;
  connection: ConnectionState;

  // State Setters
  setConversationId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsInitializing: (initializing: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Message Actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  removeMessage: (id: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  // Streaming Actions
  startStreaming: (messageId: string) => void;
  stopStreaming: () => void;

  // Conversation Data
  applyConversationData: (data: ConversationResponse) => void;

  // Reset
  reset: () => void;
}

// ============================================
// Hook
// ============================================

export function useConversationState(): UseConversationStateReturn {
  // Core State
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [inputPlaceholder, setInputPlaceholder] = useState(
    DEFAULT_INPUT_PLACEHOLDER
  );

  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Connection State
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Streaming State
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  // ============================================
  // Message Actions
  // ============================================

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: string, content: string) => {
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], content };
        return updated;
      }
      return prev;
    });
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ============================================
  // Streaming Actions
  // ============================================

  const startStreaming = useCallback((messageId: string) => {
    setIsStreaming(true);
    setStreamingMessageId(messageId);
  }, []);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    setStreamingMessageId(null);
  }, []);

  // ============================================
  // Conversation Data
  // ============================================

  const applyConversationData = useCallback(
    (convData: ConversationResponse) => {
      if (convData.messages && convData.messages.length > 0) {
        setMessages(convData.messages.map(mapApiMessageToMessage));
      }

      if (convData.prompts && convData.prompts.length > 0) {
        setPrompts(convData.prompts);
      }

      if (convData.imageUrl) {
        setImageUrl(convData.imageUrl);
      }

      if (convData.inputPlaceholderDe) {
        setInputPlaceholder(convData.inputPlaceholderDe);
      }
    },
    []
  );

  // ============================================
  // Error Handling
  // ============================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // Reset
  // ============================================

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setPrompts([]);
    setImageUrl(undefined);
    setInputPlaceholder(DEFAULT_INPUT_PLACEHOLDER);
    setError(null);
    setIsLoading(false);
    setIsConnected(false);
    setIsStreaming(false);
    setStreamingMessageId(null);
  }, []);

  // ============================================
  // Return
  // ============================================

  return {
    // State Objects
    state: {
      messages,
      conversationId,
      prompts,
      imageUrl,
      inputPlaceholder,
    },
    loading: {
      isLoading,
      isInitializing,
    },
    streaming: {
      isStreaming,
      streamingMessageId,
    },
    connection: {
      isConnected,
      error,
    },

    // State Setters
    setConversationId,
    setIsLoading,
    setIsInitializing,
    setIsConnected,
    setError,
    clearError,

    // Message Actions
    addMessage,
    updateMessage,
    removeMessage,
    setMessages,

    // Streaming Actions
    startStreaming,
    stopStreaming,

    // Conversation Data
    applyConversationData,

    // Reset
    reset,
  };
}
