/**
 * useConversation Hook
 *
 * Verwaltet den gesamten Chat-State und die API-Kommunikation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { ApiConfig, Message, ConversationResponse } from "../types";
import { mapApiMessageToMessage } from "../types";
import {
  createConversation,
  fetchConversation,
  sendMessage as apiSendMessage,
} from "../services/api";
import {
  POLLING_MAX_ATTEMPTS,
  POLLING_INTERVAL_MS,
  DEFAULT_INPUT_PLACEHOLDER,
  PENDING_AI_RESPONSE,
} from "../constants";

interface UseConversationOptions extends ApiConfig {}

interface UseConversationReturn {
  // State
  messages: Message[];
  conversationId: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  prompts: string[];
  imageUrl: string | undefined;
  inputPlaceholder: string;
  error: string | null;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  resetConversation: () => void;
}

export function useConversation(
  options: UseConversationOptions
): UseConversationReturn {
  const { accountId, agentSlug, apiEndpoint } = options;

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [inputPlaceholder, setInputPlaceholder] = useState(
    DEFAULT_INPUT_PLACEHOLDER
  );
  const [error, setError] = useState<string | null>(null);

  // Refs für Cleanup
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const config: ApiConfig = { accountId, agentSlug, apiEndpoint };

  // Cleanup bei Unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  // Conversation initialisieren
  useEffect(() => {
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

    if (!conversationId) {
      initConversation();
    }
  }, [accountId, agentSlug, apiEndpoint, conversationId]);

  /**
   * Wendet Conversation-Daten auf den State an
   */
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

  /**
   * Polling für AI-Antwort mit Exponential Backoff
   */
  const pollForResponse = useCallback(
    async (attempts = 0): Promise<void> => {
      if (!conversationId || !isMountedRef.current) return;

      if (attempts >= POLLING_MAX_ATTEMPTS) {
        setIsLoading(false);
        setError("Zeitüberschreitung bei der Antwort. Bitte erneut versuchen.");
        return;
      }

      try {
        const convData = await fetchConversation(config, conversationId);

        if (!isMountedRef.current) return;

        const aiMessages =
          convData.messages?.filter((m) => m.message_type === "ai") || [];
        const lastAiMessage = aiMessages[aiMessages.length - 1];

        if (
          lastAiMessage &&
          lastAiMessage.result &&
          lastAiMessage.result !== PENDING_AI_RESPONSE
        ) {
          // Antwort erhalten
          setMessages(convData.messages.map(mapApiMessageToMessage));
          setIsLoading(false);
        } else {
          // Weiter pollen
          pollingTimeoutRef.current = setTimeout(
            () => pollForResponse(attempts + 1),
            POLLING_INTERVAL_MS
          );
        }
      } catch (err) {
        console.error("[HermineChat] Polling-Fehler:", err);
        if (isMountedRef.current) {
          setIsLoading(false);
          setError("Fehler beim Laden der Antwort.");
        }
      }
    },
    [conversationId, config]
  );

  /**
   * Nachricht senden
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !conversationId || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        await apiSendMessage(config, conversationId, userMessage.content);
        await pollForResponse();
      } catch (err) {
        console.error("[HermineChat] Fehler beim Senden:", err);
        setIsLoading(false);
        setError("Nachricht konnte nicht gesendet werden.");
      }
    },
    [conversationId, isLoading, config, pollForResponse]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Conversation zurücksetzen
   */
  const resetConversation = useCallback(() => {
    // Polling stoppen
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    // State zurücksetzen
    setMessages([]);
    setConversationId(null);
    setPrompts([]);
    setImageUrl(undefined);
    setInputPlaceholder(DEFAULT_INPUT_PLACEHOLDER);
    setError(null);
    setIsLoading(false);
    // Initialisierung wird durch conversationId-Effekt erneut ausgelöst
  }, []);

  return {
    messages,
    conversationId,
    isLoading,
    isInitializing,
    prompts,
    imageUrl,
    inputPlaceholder,
    error,
    sendMessage,
    clearError,
    resetConversation,
  };
}
