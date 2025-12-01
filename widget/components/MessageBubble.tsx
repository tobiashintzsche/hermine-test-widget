import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types";
import { MessageSquare } from "lucide-react";
import { createMarkdownComponents } from "./MarkdownComponents";
import { useAnimatedText } from "../hooks/useAnimatedText";
import { useResolvedTheme } from "../theme/ThemeContext";
import {
  aiMessageContainerStyle,
  chatMessageContainerStyle,
  createAiTextContainerStyle,
  aiTextStyle,
  humanMessageContainerStyle,
  createHumanMessageStyle,
  humanTextStyle,
  avatarStyle,
  messageContentStyle,
  feedbackButtonContainerStyle,
  feedbackIconButtonStyle,
  markdownStyles,
  streamingCursorStyle,
} from "./ChatWindow.styles";

interface MessageBubbleProps {
  message: Message;
  imageUrl?: string;
  conversationId?: string;
  onFeedbackClick?: (messageId: string) => void;
  // Streaming indicator
  isStreaming?: boolean;
}

export function MessageBubble({
  message,
  conversationId,
  onFeedbackClick,
  isStreaming = false,
}: MessageBubbleProps) {
  const { t } = useTranslation();
  const theme = useResolvedTheme();
  const isUser = message.role === "user";
  const [feedbackButtonHovered, setFeedbackButtonHovered] = useState(false);

  // Theme-Farben direkt aus dem Context
  const primaryColor = theme.primaryColor;
  const aiMessageBackgroundColor = theme.messages.ai.backgroundColor;
  const aiMessageTextColor = theme.messages.ai.textColor;
  const userMessageBackgroundColor = theme.messages.user.backgroundColor;
  const userMessageTextColor = theme.messages.user.textColor;

  // Animierter Text für smooth streaming (nur während streaming aktiv)
  const animatedContent = useAnimatedText(message.content, {
    charDelay: 12,
    enabled: isStreaming,
  });

  // Verwende animierten Text während streaming, sonst den originalen
  const displayContent = isStreaming ? animatedContent : message.content;

  // AI Message
  if (!isUser) {
    const showFeedbackButton =
      !message.hasErrors &&
      !message.isWelcome &&
      conversationId &&
      onFeedbackClick;

    // Apply custom AI message colors
    const aiContainerStyle = createAiTextContainerStyle(
      aiMessageBackgroundColor,
      aiMessageTextColor
    );

    return (
      <div style={aiMessageContainerStyle}>
        <div style={chatMessageContainerStyle}>
          <div style={aiContainerStyle}>
            <div style={messageContentStyle}>
              <div style={{ ...aiTextStyle, ...markdownStyles }}>
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={createMarkdownComponents(primaryColor)}
                >
                  {displayContent}
                </Markdown>
                {isStreaming && <span style={streamingCursorStyle}>▋</span>}
              </div>
              {showFeedbackButton && !isStreaming && (
                <div style={feedbackButtonContainerStyle}>
                  <button
                    onClick={() => onFeedbackClick(message.id)}
                    style={{
                      ...feedbackIconButtonStyle,
                      opacity: feedbackButtonHovered ? 1 : 0.6,
                      backgroundColor: feedbackButtonHovered
                        ? "rgba(0, 0, 0, 0.05)"
                        : "transparent",
                    }}
                    onMouseEnter={() => setFeedbackButtonHovered(true)}
                    onMouseLeave={() => setFeedbackButtonHovered(false)}
                    title={t("feedback.buttonTitle")}
                  >
                    <MessageSquare size={16} color="#6b7280" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Human/User Message
  return (
    <div style={humanMessageContainerStyle}>
      <div
        style={createHumanMessageStyle(
          userMessageBackgroundColor,
          userMessageTextColor
        )}
      >
        <div style={humanTextStyle}>
          {message.content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.content.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
