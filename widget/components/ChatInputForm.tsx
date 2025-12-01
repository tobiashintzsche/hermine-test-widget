/**
 * ChatInputForm Komponente
 *
 * Formular für Nachrichteneingabe mit Textarea und Send-Button.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { useResolvedTheme } from "../theme";
import { Send } from "lucide-react";
import {
  formContainerStyle,
  formStyle,
  textareaStyle,
  createSendButtonStyle,
  resetButtonContainerStyle,
  resetButtonStyle,
} from "./ChatWindow.styles";

// ============================================
// Types
// ============================================

interface ChatInputFormProps {
  input: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  placeholder: string;
  isDisabled: boolean;
  isSubmitDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset?: () => void;
}

// ============================================
// Sub-Components
// ============================================

interface ResetButtonProps {
  onClick: () => void;
}

function ResetButton({ onClick }: ResetButtonProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = React.useState(false);

  const style: React.CSSProperties = {
    ...resetButtonStyle,
    opacity: isHovered ? 0.9 : 1,
    textDecoration: isHovered ? "underline" : "none",
  };

  return (
    <div style={resetButtonContainerStyle}>
      <button
        type="button"
        onClick={onClick}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {t("input.newConversation")}
      </button>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export function ChatInputForm({
  input,
  textareaRef,
  placeholder,
  isDisabled,
  isSubmitDisabled,
  onChange,
  onKeyDown,
  onSubmit,
  onReset,
}: ChatInputFormProps) {
  const theme = useResolvedTheme();
  const showResetButton = theme.features.showConversationManagement;

  const sendButtonStyle: React.CSSProperties = {
    ...createSendButtonStyle(
      theme.buttons.primary.backgroundColor,
      isSubmitDisabled
    ),
    color: theme.buttons.primary.textColor,
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={onSubmit} style={formStyle}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={textareaStyle}
          disabled={isDisabled}
          rows={1}
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          style={sendButtonStyle}
          aria-label="Nachricht senden"
        >
          <Send size={18} />
        </button>
      </form>
      {showResetButton && onReset && <ResetButton onClick={onReset} />}
    </div>
  );
}
