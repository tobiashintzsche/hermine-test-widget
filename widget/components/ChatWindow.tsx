import React, { useState, useRef, useEffect, useCallback } from "react";
import type { ApiConfig } from "../types";
import { useConversation } from "../hooks/useConversation";
import { submitMessageFeedback } from "../services/api";
import { MessageBubble } from "./MessageBubble";
import { LoadingDots } from "./LoadingDots";
import { Icon } from "./Icon";
import { FeedbackDialog } from "./FeedbackDialog";
import {
  windowStyle,
  chatContainerStyle,
  messagesContainerStyle,
  topContainerStyle,
  headerContainerStyle,
  rightSectionStyle,
  titleSectionStyle,
  logoStyle,
  createTitleStyle,
  createSubTitleStyle,
  closeButtonStyle,
  errorBannerStyle,
  errorCloseButtonStyle,
  splashScreenStyle,
  splashTextStyle,
  promptsContainerStyle,
  promptButtonStyle,
  promptButtonHoverBg,
  promptButtonDefaultBg,
  formContainerStyle,
  formStyle,
  textareaStyle,
  createSendButtonStyle,
  resetButtonContainerStyle,
  resetButtonStyle,
  loadingBubbleStyle,
} from "./ChatWindow.styles";

interface ChatWindowProps extends ApiConfig {
  primaryColor: string;
  chatTitle?: string;
  chatTitleColor?: string;
  chatSubTitle?: string;
  chatSubTitleColor?: string;
  chatDescription?: string;
  chatDescriptionColor?: string;
  chatBackgroundColor?: string;
  fontFamily?: string;
  aiMessageBackgroundColor?: string;
  aiMessageTextColor?: string;
  messageBackgroundColor?: string;
  buttonBackgroundColor?: string;
  buttonColor?: string;
  fullScreenEnabled?: boolean;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  shadow?: "none" | "small" | "medium" | "large";
  textInputPlaceholder?: string;
  useCustomLogo?: boolean;
  showConversationManagment?: boolean;
  onClose: () => void;
  aiIcon?: string;
  logoUrl?: string;
}

export function ChatWindow({
  accountId,
  agentSlug,
  apiEndpoint,
  primaryColor,
  chatTitle,
  chatTitleColor,
  chatSubTitle,
  chatSubTitleColor,
  chatDescription,
  chatDescriptionColor,
  chatBackgroundColor,
  fontFamily,
  aiMessageBackgroundColor,
  aiMessageTextColor,
  messageBackgroundColor,
  buttonBackgroundColor,
  buttonColor,
  fullScreenEnabled,
  isFullScreen,
  onToggleFullScreen,
  shadow,
  textInputPlaceholder,
  useCustomLogo,
  showConversationManagment,
  onClose,
  aiIcon,
  logoUrl,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
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
  } = useConversation({ accountId, agentSlug, apiEndpoint });

  // aiIcon von props nutzen falls vorhanden, sonst von Conversation
  const effectiveImageUrl = aiIcon || imageUrl;

  // Feedback Handler
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
      } catch (error) {
        console.error("Failed to submit feedback:", error);
        return false;
      }
    },
    [accountId, agentSlug, apiEndpoint]
  );

  // Feedback Dialog öffnen
  const handleFeedbackClick = useCallback((messageId: string) => {
    setFeedbackMessageId(messageId);
  }, []);

  // Feedback Dialog schließen
  const handleFeedbackClose = useCallback(() => {
    setFeedbackMessageId(null);
  }, []);

  // Auto-scroll zu neuen Nachrichten
  const scrollToLastMessage = () => {
    messagesContainerRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToLastMessage, 200);
  }, [messages]);

  // Funktion zur automatischen Anpassung der Textarea-Höhe
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 96; // Maximale Höhe in px (4 Zeilen)
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;

      // Overflow-Verhalten basierend auf der Höhe anpassen
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input;
    setInput("");

    // Textarea-Höhe und Overflow nach dem Leeren zurücksetzen
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }

    await sendMessage(content);
    setTimeout(scrollToLastMessage, 200);
  };

  const handlePromptClick = async (prompt: string) => {
    await sendMessage(prompt);
    setTimeout(scrollToLastMessage, 200);
  };

  const handleResetChat = (e: React.MouseEvent) => {
    e.preventDefault();
    resetConversation();
    onClose();
  };

  const isSubmitDisabled = isLoading || !input.trim();

  // Erste Nachricht (Welcome Message) und Prompts für SplashScreen
  const firstMessage = messages.find((m) => m.isWelcome);
  const showSplashScreen = messages.length <= 1 && !isLoading;

  // Effective placeholder - custom or from API or default
  const effectivePlaceholder =
    textInputPlaceholder || inputPlaceholder || "Nachricht eingeben...";

  // Shadow style based on prop
  const getShadowStyle = () => {
    switch (shadow) {
      case "none":
        return "none";
      case "small":
        return "0 2px 8px rgba(0, 0, 0, 0.1)";
      case "medium":
        return "0 4px 12px rgba(0, 0, 0, 0.15)";
      case "large":
      default:
        return "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
    }
  };

  // Dynamic window style with custom props
  const dynamicWindowStyle: React.CSSProperties = {
    ...windowStyle,
    backgroundColor: chatBackgroundColor || "white",
    fontFamily: fontFamily || "ui-sans-serif, system-ui, sans-serif",
    boxShadow: getShadowStyle(),
    ...(isFullScreen && {
      width: "100vw",
      maxWidth: "100vw",
      height: "100vh",
      maxHeight: "100vh",
      minHeight: "100vh",
      borderRadius: 0,
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
  };

  // Effective button colors
  const effectiveButtonBgColor = buttonBackgroundColor || primaryColor;
  const effectiveButtonColor = buttonColor || "white";

  return (
    <div style={dynamicWindowStyle}>
      <div style={chatContainerStyle}>
        {/* Header (topContainer) */}
        <div style={topContainerStyle}>
          <div style={headerContainerStyle}>
            {/* Left side: Logo */}
            {logoUrl && !useCustomLogo && (
              <img src={logoUrl} alt="Logo" style={logoStyle} />
            )}

            {/* Right side: Fullscreen + Close Button */}
            <div style={rightSectionStyle}>
              {fullScreenEnabled && (
                <button
                  onClick={onToggleFullScreen}
                  style={closeButtonStyle}
                  aria-label={
                    isFullScreen ? "Vollbild beenden" : "Vollbild aktivieren"
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgb(243, 244, 246)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon
                    name={isFullScreen ? "minimize" : "maximize"}
                    size={20}
                  />
                </button>
              )}
              <button
                onClick={onClose}
                style={closeButtonStyle}
                aria-label="Chat schließen"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgb(243, 244, 246)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon name="close" size={24} />
              </button>
            </div>
          </div>

          {/* Title Section: chatTitle + chatSubTitle + chatDescription */}
          {(chatTitle || chatSubTitle || chatDescription) && (
            <div style={titleSectionStyle}>
              {chatTitle && (
                <div style={createTitleStyle(chatTitleColor)}>{chatTitle}</div>
              )}
              {chatSubTitle && (
                <div style={createSubTitleStyle(chatSubTitleColor)}>
                  {chatSubTitle}
                </div>
              )}
              {chatDescription && (
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: chatDescriptionColor || "#6B7280",
                    marginTop: "8px",
                  }}
                >
                  {chatDescription}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div style={errorBannerStyle}>
            <span>{error}</span>
            <button
              onClick={clearError}
              style={errorCloseButtonStyle}
              aria-label="Fehler schließen"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        {/* SplashScreen with Welcome Message and Prompts OR Messages */}
        {showSplashScreen ? (
          <div style={splashScreenStyle}>
            <div>
              {firstMessage && (
                <div style={splashTextStyle}>
                  <p>{firstMessage.content}</p>
                </div>
              )}
              {prompts && prompts.length > 0 && (
                <div style={promptsContainerStyle}>
                  {prompts
                    .filter((prompt: string) => !!prompt)
                    .map((prompt: string) => (
                      <button
                        key={prompt}
                        style={promptButtonStyle}
                        onClick={() => handlePromptClick(prompt)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            promptButtonHoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            promptButtonDefaultBg;
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div ref={messagesContainerRef} style={messagesContainerStyle}>
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
                primaryColor={primaryColor}
                imageUrl={
                  message.role === "assistant" ? effectiveImageUrl : undefined
                }
                conversationId={conversationId || undefined}
                onFeedbackClick={handleFeedbackClick}
                aiMessageBackgroundColor={aiMessageBackgroundColor}
                aiMessageTextColor={aiMessageTextColor}
                userMessageBackgroundColor={messageBackgroundColor}
              />
            ))}

            {isLoading && (
              <div style={loadingBubbleStyle}>
                <LoadingDots />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Form */}
        <div style={formContainerStyle}>
          <form onSubmit={handleSubmit} style={formStyle}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={effectivePlaceholder}
              style={textareaStyle}
              disabled={isLoading || isInitializing}
              rows={1}
            />
            <button
              type="submit"
              disabled={isSubmitDisabled}
              style={{
                ...createSendButtonStyle(
                  effectiveButtonBgColor,
                  isSubmitDisabled
                ),
                color: effectiveButtonColor,
              }}
              aria-label="Nachricht senden"
            >
              <Icon name="send" size={24} />
            </button>
          </form>
          {showConversationManagment !== false && (
            <div style={resetButtonContainerStyle}>
              <button
                type="button"
                onClick={handleResetChat}
                style={resetButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Neues Gespräch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Dialog - positioned within the chat window */}
      {feedbackMessageId && conversationId && (
        <FeedbackDialog
          isOpen={!!feedbackMessageId}
          onClose={handleFeedbackClose}
          messageId={feedbackMessageId}
          conversationId={conversationId}
          primaryColor={primaryColor}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
