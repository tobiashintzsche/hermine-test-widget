/**
 * ActionCable Service für Hermine Chat Widget
 *
 * Verbindet sich mit dem Rails ActionCable WebSocket für Echtzeit-Updates.
 * Kompatibel mit Next.js (Client-Side only).
 */

import { createConsumer, Consumer, Subscription } from "@rails/actioncable";

const DEFAULT_BASE_URL = "https://hermine.ai";

let consumer: Consumer | null = null;

/**
 * Erstellt oder gibt den bestehenden ActionCable Consumer zurück
 */
export function getConsumer(baseUrl: string = DEFAULT_BASE_URL): Consumer {
  if (!consumer) {
    const wsUrl = `${baseUrl.replace("http", "ws")}/cable`;
    consumer = createConsumer(wsUrl);
  }
  return consumer;
}

/**
 * Callback-Typen für Channel-Events
 */
export interface ChannelCallbacks {
  /** Empfängt fertige Nachrichten */
  onReceived: (data: ChatMessage) => void;
  /** Empfängt Streaming-Tokens (optional) */
  onStream?: (data: StreamMessage) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onRejected?: () => void;
}

/**
 * Struktur einer Chat-Nachricht vom Server (fertige Nachricht)
 */
export interface ChatMessage {
  id: string;
  result: string;
  message_type: "user" | "ai";
  conversation_id: string;
  updated_at?: string;
  has_errors?: boolean;
  is_finished?: boolean;
}

/**
 * Struktur einer Streaming-Nachricht vom Server
 */
export interface StreamMessage {
  type: "stream";
  message_id: string;
  content: string;
  finished: boolean;
}

/**
 * Subscription-Wrapper mit Cleanup-Funktion
 */
export interface ChatSubscription {
  subscription: Subscription;
  unsubscribe: () => void;
}

/**
 * Erstellt eine Subscription zum ChatbotChannel für eine Conversation
 *
 * @param conversationId - Die ID der Conversation
 * @param callbacks - Callback-Funktionen für Events
 * @param baseUrl - Die Basis-URL des Servers
 * @returns ChatSubscription mit unsubscribe-Funktion
 */
export function subscribeToConversation(
  conversationId: string,
  callbacks: ChannelCallbacks,
  baseUrl: string = DEFAULT_BASE_URL
): ChatSubscription {
  const currentConsumer = getConsumer(baseUrl);

  const subscription = currentConsumer.subscriptions.create(
    {
      channel: "ChatbotChannel",
      conversation_id: conversationId,
    },
    {
      received(data: ChatMessage | StreamMessage) {
        console.debug("[ActionCable] Data received:", data);

        // Check if this is a streaming message
        if ("type" in data && data.type === "stream") {
          console.debug(
            "[ActionCable] Stream chunk:",
            data.content?.slice(-50)
          );
          callbacks.onStream?.(data as StreamMessage);
        } else {
          // Regular message update
          callbacks.onReceived(data as ChatMessage);
        }
      },
      connected() {
        console.debug("[ActionCable] Connected to ChatbotChannel");
        callbacks.onConnected?.();
      },
      disconnected() {
        console.debug("[ActionCable] Disconnected from ChatbotChannel");
        callbacks.onDisconnected?.();
      },
      rejected() {
        console.warn("[ActionCable] Subscription rejected");
        callbacks.onRejected?.();
      },
    }
  );

  return {
    subscription,
    unsubscribe: () => {
      subscription.unsubscribe();
      console.debug("[ActionCable] Unsubscribed from ChatbotChannel");
    },
  };
}

/**
 * Trennt alle Verbindungen und setzt den Consumer zurück
 */
export function disconnectConsumer(): void {
  if (consumer) {
    consumer.disconnect();
    consumer = null;
    console.debug("[ActionCable] Consumer disconnected");
  }
}
