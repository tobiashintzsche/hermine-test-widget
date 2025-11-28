/**
 * FeedbackDialog Komponente
 *
 * Modal-Dialog für Benutzer-Feedback zu AI-Nachrichten
 * Entspricht der Implementierung in hermine-chat
 */

import React, { useState } from "react";
import { Icon } from "./Icon";
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
  primaryColor: string;
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
  primaryColor,
  onSubmitFeedback,
}: FeedbackDialogProps) {
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
            Feedback
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
                Feedback erfolgreich gesendet!
              </p>
              <p style={feedbackDialogSuccessSubtextStyle}>
                Vielen Dank für Ihr Feedback.
              </p>
            </div>
          ) : submitStatus === "error" ? (
            <div style={feedbackDialogErrorStyle}>
              <div style={feedbackDialogErrorIconStyle}>⚠</div>
              <p style={feedbackDialogErrorTextStyle}>
                Fehler beim Senden des Feedbacks
              </p>
              <p style={feedbackDialogErrorSubtextStyle}>
                Bitte versuchen Sie es erneut.
              </p>
              <button
                style={feedbackDialogRetryButtonStyle}
                onClick={() => setSubmitStatus("idle")}
              >
                Erneut versuchen
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "16px" }}>
                <span style={feedbackDialogQuestionStyle}>
                  Geben Sie Feedback zu dieser Nachricht. Service-Mitarbeiter
                  und Administratoren des Kontos sehen Ihr Feedback und den
                  Chat-Verlauf, um die KI zu verbessern.
                </span>
              </div>

              <textarea
                style={feedbackDialogTextareaStyle}
                placeholder="Ihr Feedback..."
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
                  Abbrechen
                </button>
                <button
                  style={createFeedbackDialogSubmitButtonStyle(
                    primaryColor,
                    !comment.trim() || isSubmitting
                  )}
                  onClick={handleSubmit}
                  disabled={!comment.trim() || isSubmitting}
                >
                  {isSubmitting ? "Wird gesendet..." : "Senden"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
