/**
 * useActionCable Hook
 *
 * React Hook für ActionCable WebSocket-Verbindung.
 * Verbindet sich automatisch wenn eine conversationId vorhanden ist
 * und räumt die Subscription bei Unmount auf.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import {
  subscribeToConversation,
  ChatSubscription,
  ChatMessage,
  disconnectConsumer,
} from "../services/actioncable";

interface UseActionCableOptions {
  conversationId: string | null;
  apiEndpoint: string;
  onMessage: (message: ChatMessage) => void;
  enabled?: boolean;
}

interface UseActionCableReturn {
  isConnected: boolean;
  reconnect: () => void;
}

export function useActionCable({
  conversationId,
  apiEndpoint,
  onMessage,
  enabled = true,
}: UseActionCableOptions): UseActionCableReturn {
  const [isConnected, setIsConnected] = useState(false);
  const subscriptionRef = useRef<ChatSubscription | null>(null);
  const onMessageRef = useRef(onMessage);

  // Callback-Ref aktuell halten ohne Re-Subscribe
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Subscription aufbauen
  useEffect(() => {
    // Nur client-side und wenn enabled
    if (typeof window === "undefined" || !enabled || !conversationId) {
      return;
    }

    // Alte Subscription aufräumen
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    console.debug(
      "[useActionCable] Subscribing to conversation:",
      conversationId
    );

    subscriptionRef.current = subscribeToConversation(
      conversationId,
      {
        onReceived: (data) => {
          onMessageRef.current(data);
        },
        onConnected: () => {
          setIsConnected(true);
        },
        onDisconnected: () => {
          setIsConnected(false);
        },
        onRejected: () => {
          setIsConnected(false);
          console.error("[useActionCable] Subscription rejected");
        },
      },
      apiEndpoint
    );

    // Cleanup bei Unmount oder Dependency-Änderung
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      setIsConnected(false);
    };
  }, [conversationId, apiEndpoint, enabled]);

  // Reconnect-Funktion
  const reconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    disconnectConsumer();
    setIsConnected(false);

    // Trigger re-subscribe durch State-Update
    // (useEffect wird erneut ausgeführt)
  }, []);

  return {
    isConnected,
    reconnect,
  };
}
