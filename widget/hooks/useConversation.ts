/**
 * useConversation Hook (Refactored)
 *
 * Orchestriert die Conversation-Logik durch Komposition kleinerer Hooks.
 * Nutzt ActionCable WebSockets für Echtzeit-Updates mit Token-Streaming.
 */

import { useEffect, useCallback, useRef, useMemo } from "react";
import type { ApiConfig, Message } from "../types";
import {
  createConversation,
  fetchConversation,
  sendMessage as apiSendMessage,
} from "../services/api";
import type { ChatMessage, StreamMessage } from "../services/actioncable";
import { useConversationState } from "./useConversationState";
import { useActionCableSubscription } from "./useActionCableSubscription";
import { PENDING_AI_RESPONSE } from "../constants";

// ============================================
// Types
// ============================================

interface UseConversationOptions extends ApiConfig {}

export interface UseConversationReturn {
  // State
  messages: Message[];
  conversationId: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  prompts: string[];
  imageUrl: string | undefined;
  inputPlaceholder: string;
  error: string | null;
  /** True wenn WebSocket verbunden ist */
  isConnected: boolean;
  /** True wenn gerade gestreamt wird (AI antwortet) */
  isStreaming: boolean;
  /** ID der Message die gerade gestreamt wird */
  streamingMessageId: string | null;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  resetConversation: () => void;
}

// ============================================
// Hook
// ============================================

export function useConversation(
  options: UseConversationOptions
): UseConversationReturn {
  const { accountId, agentSlug, apiEndpoint } = options;

  const config: ApiConfig = useMemo(
    () => ({ accountId, agentSlug, apiEndpoint }),
    [accountId, agentSlug, apiEndpoint]
  );

  // Refs
  const isMountedRef = useRef(true);
  const conversationIdRef = useRef<string | null>(null);

  // State Management Hook
  const {
    state,
    loading,
    streaming,
    connection,
    setConversationId,
    setIsLoading,
    setIsInitializing,
    setIsConnected,
    setError,
    clearError,
    setMessages,
    startStreaming,
    stopStreaming,
    applyConversationData,
    reset,
  } = useConversationState();

  // Sync ref with state
  useEffect(() => {
    conversationIdRef.current = state.conversationId;
  }, [state.conversationId]);

  // ============================================
  // ActionCable Message Handlers
  // ============================================

  const handleActionCableMessage = useCallback(
    (data: ChatMessage) => {
      console.debug("[HermineChat] ActionCable message received:", data);

      if (!isMountedRef.current) return;

      // Ignoriere "..." Placeholder
      if (data.result === PENDING_AI_RESPONSE && !data.has_errors) {
        console.debug("[HermineChat] Pending response '...', skipping...");
        return;
      }

      // Direkt die Nachricht aus dem ActionCable-Event verwenden
      if (data.result && data.id) {
        // Sofort Loading beenden wenn erster echter Content kommt
        setIsLoading(false);

        // Streaming-State setzen
        if (!data.is_finished) {
          startStreaming(data.id);
        } else {
          stopStreaming();
        }

        setMessages((prev) => {
          // Prüfen ob Message mit dieser ID schon existiert
          const existingIndex = prev.findIndex((m) => m.id === data.id);

          if (existingIndex >= 0) {
            // Update existierende Message (Streaming-Update)
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              content: data.result,
            };
            return updated;
          } else {
            // Neue AI-Message hinzufügen
            return [
              ...prev,
              {
                id: data.id,
                role: "assistant" as const,
                content: data.result,
              },
            ];
          }
        });
      }
    },
    [setIsLoading, startStreaming, stopStreaming, setMessages]
  );

  const handleStreamChunk = useCallback(
    (data: StreamMessage) => {
      if (!isMountedRef.current) return;

      console.debug(
        "[HermineChat] Stream chunk received:",
        data.content?.slice(-50)
      );

      // Streaming state setzen
      startStreaming(data.message_id);

      // Wenn finished
      if (data.finished) {
        stopStreaming();
      }
    },
    [startStreaming, stopStreaming]
  );

  // ActionCable Hook
  const actionCable = useActionCableSubscription({
    apiEndpoint,
    callbacks: useMemo(
      () => ({
        onMessage: handleActionCableMessage,
        onStream: handleStreamChunk,
        onConnected: () => setIsConnected(true),
        onDisconnected: () => setIsConnected(false),
      }),
      [handleActionCableMessage, handleStreamChunk, setIsConnected]
    ),
  });

  // ============================================
  // Initialization
  // ============================================

  useEffect(() => {
    isMountedRef.current = true;

    const initConversation = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // 1. Neue Conversation erstellen
        const createData = await createConversation(config);
        const newConversationId = createData.conversation_id;

        if (!isMountedRef.current) return;
        setConversationId(newConversationId);

        // 2. Conversation-Details laden
        const convData = await fetchConversation(config, newConversationId);

        if (!isMountedRef.current) return;
        applyConversationData(convData);

        // 3. ActionCable Subscription aufbauen
        actionCable.connect(newConversationId);
      } catch (err) {
        console.error(
          "[HermineChat] Fehler beim Erstellen der Conversation:",
          err
        );
        if (isMountedRef.current) {
          setError("Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.");
        }
      } finally {
        if (isMountedRef.current) {
          setIsInitializing(false);
        }
      }
    };

    if (!state.conversationId) {
      initConversation();
    }

    return () => {
      isMountedRef.current = false;
      actionCable.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, agentSlug, apiEndpoint]);

  // ============================================
  // Actions
  // ============================================

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !state.conversationId || loading.isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
      };

      // Optimistic update: User message sofort anzeigen
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Nachricht an Server senden
        await apiSendMessage(config, state.conversationId, userMessage.content);
        // ActionCable wird die AI-Antwort pushen
        console.debug("[HermineChat] Message sent, waiting for ActionCable...");
      } catch (err) {
        console.error("[HermineChat] Fehler beim Senden:", err);
        if (isMountedRef.current) {
          setIsLoading(false);
          setError("Nachricht konnte nicht gesendet werden.");
          // Optimistic update rückgängig machen
          setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        }
      }
    },
    [state.conversationId, loading.isLoading, config, setMessages, setIsLoading, setError]
  );

  const resetConversation = useCallback(() => {
    actionCable.disconnect();
    reset();
    // Initialisierung wird durch den useEffect erneut ausgelöst
  }, [actionCable, reset]);

  // ============================================
  // Return (Flattened for backwards compatibility)
  // ============================================

  return {
    // State
    messages: state.messages,
    conversationId: state.conversationId,
    isLoading: loading.isLoading,
    isInitializing: loading.isInitializing,
    prompts: state.prompts,
    imageUrl: state.imageUrl,
    inputPlaceholder: state.inputPlaceholder,
    error: connection.error,
    isConnected: connection.isConnected,
    isStreaming: streaming.isStreaming,
    streamingMessageId: streaming.streamingMessageId,

    // Actions
    sendMessage,
    clearError,
    resetConversation,
  };
}
