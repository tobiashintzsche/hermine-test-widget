/**
 * FeedbackDialog Komponente
 *
 * Modal-Dialog für Benutzer-Feedback zu AI-Nachrichten
 * Entspricht der Implementierung in hermine-chat
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useResolvedTheme } from "../theme/ThemeContext";
import {
  feedbackDialogOverlayStyle,
  feedbackDialogStyle,
  feedbackDialogHeaderStyle,
  feedbackDialogTitleStyle,
  feedbackDialogCloseButtonStyle,
  feedbackDialogContentStyle,
  feedbackDialogQuestionStyle,
  feedbackDialogTextareaStyle,
  feedbackDialogActionsStyle,
  feedbackDialogCancelButtonStyle,
  createFeedbackDialogSubmitButtonStyle,
  feedbackDialogSuccessStyle,
  feedbackDialogSuccessIconStyle,
  feedbackDialogSuccessTextStyle,
  feedbackDialogSuccessSubtextStyle,
  feedbackDialogErrorStyle,
  feedbackDialogErrorIconStyle,
  feedbackDialogErrorTextStyle,
  feedbackDialogErrorSubtextStyle,
  feedbackDialogRetryButtonStyle,
} from "./ChatWindow.styles";

export interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  conversationId: string;
  onSubmitFeedback: (
    messageId: string,
    conversationId: string,
    feedback: string
  ) => Promise<boolean>;
}

export function FeedbackDialog({
  isOpen,
  onClose,
  messageId,
  conversationId,
  onSubmitFeedback,
}: FeedbackDialogProps) {
  const { t } = useTranslation();
  const theme = useResolvedTheme();
  const primaryColor = theme.primaryColor;
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (comment.trim() && !isSubmitting) {
      setIsSubmitting(true);
      setSubmitStatus("idle");

      try {
        const success = await onSubmitFeedback(
          messageId,
          conversationId,
          comment
        );
        if (success) {
          setSubmitStatus("success");
          setComment("");
          // Dialog nach 4 Sekunden schließen
          setTimeout(() => {
            onClose();
            setSubmitStatus("idle");
          }, 4000);
        } else {
          setSubmitStatus("error");
        }
      } catch (error) {
        console.error("Feedback submission error:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOverlayClick = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div style={feedbackDialogOverlayStyle} onClick={handleOverlayClick}>
      <div
        style={{ ...feedbackDialogStyle, borderColor: primaryColor }}
        onClick={handleDialogClick}
      >
        <div style={feedbackDialogHeaderStyle}>
          <span style={{ ...feedbackDialogTitleStyle, color: primaryColor }}>
            {t("feedback.title")}
          </span>
          <button
            style={feedbackDialogCloseButtonStyle}
            onClick={onClose}
            disabled={isSubmitting}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            ×
          </button>
        </div>

        <div style={feedbackDialogContentStyle}>
          {submitStatus === "success" ? (
            <div style={feedbackDialogSuccessStyle}>
              <div style={feedbackDialogSuccessIconStyle}>✓</div>
              <p style={feedbackDialogSuccessTextStyle}>
                {t("feedback.successTitle")}
              </p>
              <p style={feedbackDialogSuccessSubtextStyle}>
                {t("feedback.successMessage")}
              </p>
            </div>
          ) : submitStatus === "error" ? (
            <div style={feedbackDialogErrorStyle}>
              <div style={feedbackDialogErrorIconStyle}>⚠</div>
              <p style={feedbackDialogErrorTextStyle}>
                {t("feedback.errorTitle")}
              </p>
              <p style={feedbackDialogErrorSubtextStyle}>
                {t("feedback.errorMessage")}
              </p>
              <button
                style={feedbackDialogRetryButtonStyle}
                onClick={() => setSubmitStatus("idle")}
              >
                {t("feedback.retry")}
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "16px" }}>
                <span style={feedbackDialogQuestionStyle}>
                  {t("feedback.question")}
                </span>
              </div>

              <textarea
                style={feedbackDialogTextareaStyle}
                placeholder={t("feedback.placeholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                disabled={isSubmitting}
              />

              <div style={feedbackDialogActionsStyle}>
                <button
                  style={feedbackDialogCancelButtonStyle}
                  onClick={onClose}
                  disabled={isSubmitting}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  {t("feedback.cancel")}
                </button>
                <button
                  style={createFeedbackDialogSubmitButtonStyle(
                    primaryColor,
                    !comment.trim() || isSubmitting
                  )}
                  onClick={handleSubmit}
                  disabled={!comment.trim() || isSubmitting}
                >
                  {isSubmitting ? t("feedback.submitting") : t("feedback.submit")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
