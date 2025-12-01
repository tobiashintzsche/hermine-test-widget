/**
 * API Service für Hermine Chat Widget
 * Zentralisierte API-Kommunikation mit TypeScript-Typen
 */

import type {
  ApiConfig,
  CreateConversationResponse,
  ConversationResponse,
  SendMessageResponse,
  ThemeResponse,
} from "../types";

/**
 * Erstellt die Standard-Headers für API-Requests
 */
function createHeaders(config: ApiConfig): HeadersInit {
  return {
    "X-Agent-Slug": config.agentSlug,
    "X-Account-Id": config.accountId,
    Accept: "application/json",
  };
}

/**
 * Erstellt eine neue Conversation
 */
export async function createConversation(
  config: ApiConfig
): Promise<CreateConversationResponse> {
  const response = await fetch(
    `${config.apiEndpoint}/c/${config.accountId}/${config.agentSlug}/new`,
    {
      headers: createHeaders(config),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Lädt eine bestehende Conversation mit allen Messages
 */
export async function fetchConversation(
  config: ApiConfig,
  conversationId: string
): Promise<ConversationResponse> {
  const response = await fetch(
    `${config.apiEndpoint}/chat/conversations/${conversationId}`,
    {
      headers: createHeaders(config),
      cache: "no-cache",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Sendet eine Nachricht an die Conversation
 */
export async function sendMessage(
  config: ApiConfig,
  conversationId: string,
  content: string
): Promise<SendMessageResponse> {
  const response = await fetch(
    `${config.apiEndpoint}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        ...createHeaders(config),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: { result: content },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Callback für Streaming-Updates
 */
export type StreamCallback = (chunk: string, fullText: string) => void;

/**
 * Sendet eine Nachricht mit Streaming-Response (SSE)
 */
export async function sendMessageStreaming(
  config: ApiConfig,
  conversationId: string,
  content: string,
  onChunk: StreamCallback,
  onComplete?: (fullText: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    const response = await fetch(
      `${config.apiEndpoint}/conversations/${conversationId}/messages/stream`,
      {
        method: "POST",
        headers: {
          ...createHeaders(config),
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          message: { result: content },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Parse SSE data lines
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            onComplete?.(fullText);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            // Handle different SSE formats
            const text =
              parsed.content || parsed.text || parsed.delta?.content || data;
            if (text && typeof text === "string") {
              fullText += text;
              onChunk(text, fullText);
            }
          } catch {
            // Plain text chunk (not JSON)
            if (data.trim()) {
              fullText += data;
              onChunk(data, fullText);
            }
          }
        }
      }
    }

    onComplete?.(fullText);
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Lädt das Theme/Branding für den Account
 */
export async function fetchTheme(config: ApiConfig): Promise<ThemeResponse> {
  const response = await fetch(`${config.apiEndpoint}/chat/account_theme`, {
    headers: createHeaders(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch theme: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Factory-Funktion für einen API-Client mit vordefinierten Konfiguration
 */
export function createApiClient(config: ApiConfig) {
  return {
    createConversation: () => createConversation(config),
    fetchConversation: (conversationId: string) =>
      fetchConversation(config, conversationId),
    sendMessage: (conversationId: string, content: string) =>
      sendMessage(config, conversationId, content),
    fetchTheme: () => fetchTheme(config),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

/**
 * Sendet Feedback zu einer Nachricht
 */
export async function submitMessageFeedback(
  config: ApiConfig,
  conversationId: string,
  messageId: string,
  feedback: string
): Promise<{ message: string; data?: unknown }> {
  const response = await fetch(
    `${config.apiEndpoint}/chat/conversations/${conversationId}/messages/${messageId}/feedback`,
    {
      method: "POST",
      headers: {
        ...createHeaders(config),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          feedback: feedback,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to submit feedback: ${response.statusText}`);
  }

  return response.json();
}
