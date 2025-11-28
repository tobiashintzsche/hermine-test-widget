import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types";
import { Icon } from "./Icon";
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
} from "./ChatWindow.styles";

interface MessageBubbleProps {
  message: Message;
  primaryColor: string;
  imageUrl?: string;
  conversationId?: string;
  onFeedbackClick?: (messageId: string) => void;
  // Custom styling
  aiMessageBackgroundColor?: string;
  aiMessageTextColor?: string;
  userMessageBackgroundColor?: string;
  userMessageTextColor?: string;
}

export function MessageBubble({
  message,
  primaryColor,
  imageUrl,
  conversationId,
  onFeedbackClick,
  aiMessageBackgroundColor,
  aiMessageTextColor,
  userMessageBackgroundColor,
  userMessageTextColor,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [feedbackButtonHovered, setFeedbackButtonHovered] = useState(false);

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
                  components={{
                    a: ({ href, children, ...props }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: primaryColor,
                          textDecoration: "underline",
                        }}
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    p: ({ children, ...props }) => (
                      <p style={{ margin: "0 0 8px 0" }} {...props}>
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul
                        style={{
                          margin: "8px 0",
                          paddingLeft: "20px",
                          listStyleType: "disc",
                        }}
                        {...props}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol
                        style={{
                          margin: "8px 0",
                          paddingLeft: "20px",
                          listStyleType: "decimal",
                        }}
                        {...props}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li style={{ marginBottom: "4px" }} {...props}>
                        {children}
                      </li>
                    ),
                    code: ({ children, className, ...props }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            fontSize: "0.9em",
                            fontFamily: "monospace",
                          }}
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <code
                          style={{
                            display: "block",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            padding: "12px",
                            borderRadius: "6px",
                            fontSize: "0.9em",
                            fontFamily: "monospace",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children, ...props }) => (
                      <pre
                        style={{
                          margin: "8px 0",
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                          borderRadius: "6px",
                          overflow: "auto",
                        }}
                        {...props}
                      >
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        style={{
                          margin: "8px 0",
                          paddingLeft: "12px",
                          borderLeft: `3px solid ${primaryColor}`,
                          color: "#6b7280",
                          fontStyle: "italic",
                        }}
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                    h1: ({ children, ...props }) => (
                      <h1
                        style={{
                          fontSize: "1.5em",
                          fontWeight: "bold",
                          margin: "16px 0 8px 0",
                        }}
                        {...props}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2
                        style={{
                          fontSize: "1.3em",
                          fontWeight: "bold",
                          margin: "14px 0 8px 0",
                        }}
                        {...props}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3
                        style={{
                          fontSize: "1.1em",
                          fontWeight: "bold",
                          margin: "12px 0 8px 0",
                        }}
                        {...props}
                      >
                        {children}
                      </h3>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong style={{ fontWeight: "bold" }} {...props}>
                        {children}
                      </strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em style={{ fontStyle: "italic" }} {...props}>
                        {children}
                      </em>
                    ),
                    hr: ({ ...props }) => (
                      <hr
                        style={{
                          margin: "16px 0",
                          border: "none",
                          borderTop: "1px solid #e5e7eb",
                        }}
                        {...props}
                      />
                    ),
                    table: ({ children, ...props }) => (
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          margin: "8px 0",
                          fontSize: "0.9em",
                        }}
                        {...props}
                      >
                        {children}
                      </table>
                    ),
                    th: ({ children, ...props }) => (
                      <th
                        style={{
                          border: "1px solid #e5e7eb",
                          padding: "8px",
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                        {...props}
                      >
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td
                        style={{
                          border: "1px solid #e5e7eb",
                          padding: "8px",
                        }}
                        {...props}
                      >
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </Markdown>
              </div>
              {showFeedbackButton && (
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
                    title="Feedback geben"
                  >
                    <Icon name="feedback" size={16} color="#6b7280" />
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
      <div style={createHumanMessageStyle(userMessageBackgroundColor, userMessageTextColor)}>
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
