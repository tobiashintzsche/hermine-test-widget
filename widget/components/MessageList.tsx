/**
 * MessageList Komponente
 *
 * Zeigt die Liste aller Chat-Nachrichten an.
 */

import React from "react";
import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { LoadingDots } from "./LoadingDots";
import {
  messagesContainerStyle,
  loadingBubbleStyle,
} from "./ChatWindow.styles";

// ============================================
// Types
// ============================================

interface MessageListProps {
  messages: Message[];
  conversationId: string | null;
  imageUrl?: string;
  isLoading: boolean;
  isInitializing: boolean;
  isStreaming: boolean;
  streamingMessageId: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
  onFeedbackClick: (messageId: string) => void;
}

// ============================================
// Main Component
// ============================================

export function MessageList({
  messages,
  conversationId,
  imageUrl,
  isLoading,
  isInitializing,
  isStreaming,
  streamingMessageId,
  containerRef,
  endRef,
  onFeedbackClick,
}: MessageListProps) {
  return (
    <div ref={containerRef} style={messagesContainerStyle}>
      {isInitializing && (
        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginTop: "40px",
          }}
        >
          <LoadingDots />
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          imageUrl={message.role === "assistant" ? imageUrl : undefined}
          conversationId={conversationId || undefined}
          onFeedbackClick={onFeedbackClick}
          isStreaming={isStreaming && streamingMessageId === message.id}
        />
      ))}

      {isLoading && !isStreaming && (
        <div style={loadingBubbleStyle}>
          <LoadingDots />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
