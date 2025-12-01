/**
 * useActionCableSubscription Hook
 *
 * Verwaltet die ActionCable WebSocket-Verbindung für Echtzeit-Updates.
 * Separiert die WebSocket-Logik von der Conversation-Verwaltung.
 */

import { useCallback, useRef, useEffect } from "react";
import {
  subscribeToConversation,
  ChatSubscription,
  ChatMessage,
  StreamMessage,
} from "../services/actioncable";

export interface ActionCableCallbacks {
  onMessage: (data: ChatMessage) => void;
  onStream?: (data: StreamMessage) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export interface UseActionCableSubscriptionReturn {
  /** Verbindet zur Conversation */
  connect: (conversationId: string) => void;
  /** Trennt die Verbindung */
  disconnect: () => void;
  /** True wenn verbunden */
  isConnected: boolean;
}

interface UseActionCableSubscriptionOptions {
  apiEndpoint: string;
  callbacks: ActionCableCallbacks;
}

export function useActionCableSubscription(
  options: UseActionCableSubscriptionOptions
): UseActionCableSubscriptionReturn {
  const { apiEndpoint, callbacks } = options;

  const subscriptionRef = useRef<ChatSubscription | null>(null);
  const isConnectedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Cleanup bei Unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []);

  const connect = useCallback(
    (conversationId: string) => {
      // Alte Subscription aufräumen
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      console.debug(
        "[HermineChat] Setting up ActionCable for:",
        conversationId
      );

      subscriptionRef.current = subscribeToConversation(
        conversationId,
        {
          onReceived: callbacks.onMessage,
          onStream: callbacks.onStream,
          onConnected: () => {
            console.debug("[HermineChat] ActionCable connected");
            if (isMountedRef.current) {
              isConnectedRef.current = true;
              callbacks.onConnected?.();
            }
          },
          onDisconnected: () => {
            console.debug("[HermineChat] ActionCable disconnected");
            if (isMountedRef.current) {
              isConnectedRef.current = false;
              callbacks.onDisconnected?.();
            }
          },
          onRejected: () => {
            console.error("[HermineChat] ActionCable subscription rejected");
            if (isMountedRef.current) {
              isConnectedRef.current = false;
              callbacks.onDisconnected?.();
            }
          },
        },
        apiEndpoint
      );
    },
    [apiEndpoint, callbacks]
  );

  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      isConnectedRef.current = false;
    }
  }, []);

  return {
    connect,
    disconnect,
    isConnected: isConnectedRef.current,
  };
}
