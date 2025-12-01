/**
 * ChatWindow Komponente (Refactored)
 *
 * Haupt-Chat-Fenster, das kleinere Komponenten orchestriert.
 * Folgt dem SRP durch Delegation an spezialisierte Sub-Komponenten.
 */

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { ApiConfig } from "../types";
import type { UseConversationReturn } from "../hooks/useConversation";
import { useResolvedTheme } from "../theme";
import { useAutoScroll, useChatForm } from "../hooks";
import { submitMessageFeedback } from "../services/api";

// Components
import { ChatHeader } from "./ChatHeader";
import { ChatInputForm } from "./ChatInputForm";
import { ErrorBanner } from "./ErrorBanner";
import { SplashScreen } from "./SplashScreen";
import { MessageList } from "./MessageList";
import { FeedbackDialog } from "./FeedbackDialog";

// Styles
import { windowStyle, chatContainerStyle } from "./ChatWindow.styles";

// ============================================
// Types
// ============================================

interface ChatWindowProps extends ApiConfig {
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onClose: () => void;
  conversation: UseConversationReturn;
}

// ============================================
// Styles Helper
// ============================================

function createFullScreenStyle(): React.CSSProperties {
  return {
    width: "80vw",
    maxWidth: "80vw",
    height: "70vh",
    maxHeight: "80vh",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
    zIndex: 9999,
  };
}

// ============================================
// Main Component
// ============================================

export function ChatWindow({
  accountId,
  agentSlug,
  apiEndpoint,
  isFullScreen,
  onToggleFullScreen,
  onClose,
  conversation,
}: ChatWindowProps) {
  // i18n
  const { t } = useTranslation();

  // Theme
  const theme = useResolvedTheme();

  // Feedback State
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(
    null
  );

  // Destructure conversation
  const {
    messages,
    conversationId,
    isLoading,
    isInitializing,
    prompts,
    imageUrl,
    inputPlaceholder,
    error,
    isStreaming,
    streamingMessageId,
    sendMessage,
    clearError,
    resetConversation,
  } = conversation;

  // Auto-scroll Hook
  const { containerRef, endRef, scrollToEnd } = useAutoScroll({
    dependency: messages.length,
  });

  // Form Hook
  const form = useChatForm({
    onSubmit: async (content) => {
      await sendMessage(content);
      scrollToEnd();
    },
    isDisabled: isLoading || isInitializing,
  });

  // ============================================
  // Handlers
  // ============================================

  const handlePromptClick = useCallback(
    async (prompt: string) => {
      await sendMessage(prompt);
      scrollToEnd();
    },
    [sendMessage, scrollToEnd]
  );

  const handleResetChat = useCallback(() => {
    resetConversation();
    onClose();
  }, [resetConversation, onClose]);

  const handleFeedbackClick = useCallback((messageId: string) => {
    setFeedbackMessageId(messageId);
  }, []);

  const handleFeedbackClose = useCallback(() => {
    setFeedbackMessageId(null);
  }, []);

  const handleFeedbackSubmit = useCallback(
    async (
      messageId: string,
      convId: string,
      feedback: string
    ): Promise<boolean> => {
      try {
        await submitMessageFeedback(
          { accountId, agentSlug, apiEndpoint },
          convId,
          messageId,
          feedback
        );
        return true;
      } catch (err) {
        console.error("Failed to submit feedback:", err);
        return false;
      }
    },
    [accountId, agentSlug, apiEndpoint]
  );

  // ============================================
  // Derived State
  // ============================================

  const effectiveImageUrl = imageUrl || theme.assets.aiIcon;
  const effectivePlaceholder =
    theme.input.placeholder || inputPlaceholder || t("input.placeholder");

  const firstMessage = messages.find((m) => m.isWelcome);
  const showSplashScreen = messages.length <= 1 && !isLoading;

  // ============================================
  // Dynamic Styles
  // ============================================

  const dynamicWindowStyle: React.CSSProperties = {
    ...windowStyle,
    backgroundColor: theme.window.backgroundColor,
    fontFamily: theme.window.fontFamily,
    boxShadow: theme.window.shadow,
    ...(isFullScreen && createFullScreenStyle()),
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div style={dynamicWindowStyle}>
      <div style={chatContainerStyle}>
        {/* Header */}
        <ChatHeader
          isFullScreen={isFullScreen}
          onToggleFullScreen={onToggleFullScreen}
          onClose={onClose}
        />

        {/* Error Banner */}
        {error && <ErrorBanner message={error} onClose={clearError} />}

        {/* Content: SplashScreen or Messages */}
        {showSplashScreen ? (
          <SplashScreen
            welcomeMessage={firstMessage?.content}
            prompts={prompts}
            onPromptClick={handlePromptClick}
          />
        ) : (
          <MessageList
            messages={messages}
            conversationId={conversationId}
            imageUrl={effectiveImageUrl}
            isLoading={isLoading}
            isInitializing={isInitializing}
            isStreaming={isStreaming}
            streamingMessageId={streamingMessageId}
            containerRef={containerRef}
            endRef={endRef}
            onFeedbackClick={handleFeedbackClick}
          />
        )}

        {/* Input Form */}
        <ChatInputForm
          input={form.input}
          textareaRef={form.textareaRef}
          placeholder={effectivePlaceholder}
          isDisabled={isLoading || isInitializing}
          isSubmitDisabled={form.isSubmitDisabled}
          onChange={form.handleChange}
          onKeyDown={form.handleKeyDown}
          onSubmit={form.handleSubmit}
          onReset={handleResetChat}
        />
      </div>

      {/* Feedback Dialog */}
      {feedbackMessageId && conversationId && (
        <FeedbackDialog
          isOpen={!!feedbackMessageId}
          onClose={handleFeedbackClose}
          messageId={feedbackMessageId}
          conversationId={conversationId}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
