/**
 * Styles für ChatWindow Komponente
 *
 * 1:1 angepasst an hermine-chat
 */

import React from "react";
import {
  CHAT_WINDOW_WIDTH,
  CHAT_WINDOW_BORDER_RADIUS,
  SEND_BUTTON_SIZE,
  AVATAR_SIZE,
} from "../constants";

// ============================================
// Container Styles
// ============================================

export const windowStyle: React.CSSProperties = {
  width: `${CHAT_WINDOW_WIDTH}px`,
  maxWidth: "calc(100vw - 40px)",
  maxHeight: "80vh",
  minHeight: "50vh",
  backgroundColor: "white",
  borderRadius: CHAT_WINDOW_BORDER_RADIUS,
  boxShadow:
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  animation: "hermine-widget-fadeIn 0.5s ease-out",
};

export const chatContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  overflow: "hidden",
  borderRadius: CHAT_WINDOW_BORDER_RADIUS,
};

export const messagesContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: "16px",
  overflowY: "auto",
  overflowX: "hidden",
};

// ============================================
// Header Styles (topContainer)
// ============================================

export const topContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px 20px",
  backgroundColor: "white",
  borderBottom: "1px solid rgb(229, 231, 235)",
  borderTopLeftRadius: CHAT_WINDOW_BORDER_RADIUS,
  borderTopRightRadius: CHAT_WINDOW_BORDER_RADIUS,
};

export const headerContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "stretch",
  width: "100%",
  minHeight: "fit-content",
};

export const leftSectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
  flexGrow: 1,
};

export const rightSectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-end",
};

export const titleSectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  textAlign: "left",
};

export const logoStyle: React.CSSProperties = {
  height: "40px",
  maxHeight: "40px",
  objectFit: "contain",
};

export const createTitleStyle = (titleColor?: string): React.CSSProperties => ({
  fontWeight: "bold",
  fontSize: "24px",
  lineHeight: 1.2,
  textAlign: "left",
  color: titleColor || "black",
});

export const createSubTitleStyle = (
  subTitleColor?: string
): React.CSSProperties => ({
  fontSize: "16px",
  lineHeight: 1.4,
  fontWeight: 500,
  textAlign: "left",
  color: subTitleColor || "#6B7280",
});

export const closeButtonStyle: React.CSSProperties = {
  color: "rgb(55, 65, 81)",
  textAlign: "center",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  background: "none",
  border: "none",
};

// ============================================
// Error Banner Styles
// ============================================

export const errorBannerStyle: React.CSSProperties = {
  backgroundColor: "#fef2f2",
  color: "#991b1b",
  padding: "12px 16px",
  fontSize: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const errorCloseButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#991b1b",
  cursor: "pointer",
  padding: "4px",
};

// ============================================
// Message Styles
// ============================================

export const centeredTextStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#6b7280",
  marginTop: "40px",
};

export const emptyStateTextStyle: React.CSSProperties = {
  fontSize: "14px",
};

export const loadingBubbleStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  backgroundColor: "#f3f4f6",
  padding: "12px 16px",
  borderRadius: "8px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  borderBottomRightRadius: "8px",
  borderBottomLeftRadius: "0",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
};

// ============================================
// Splash Screen / Prompts Styles
// ============================================

export const splashScreenStyle: React.CSSProperties = {
  minHeight: "30vh",
  display: "flex",
  flex: 1,
  padding: "10px 24px",
  justifyContent: "center",
  color: "rgb(75, 85, 99)",
};

export const splashTextStyle: React.CSSProperties = {
  textAlign: "left",
};

export const promptsContainerStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
  padding: "16px",
  gridTemplateColumns: "1fr 1fr",
};

export const promptButtonStyle: React.CSSProperties = {
  border: "1px solid rgb(209, 213, 219)",
  borderRadius: "5px",
  padding: "5px 10px",
  textAlign: "left",
  justifyContent: "flex-start",
  alignItems: "center",
  height: "100%",
  display: "flex",
  cursor: "pointer",
  fontSize: "0.8em",
  backgroundColor: "transparent",
  color: "rgb(75, 85, 99)",
  transition: "background-color 0.2s",
};

export const promptButtonHoverBg = "#f3f4f6";
export const promptButtonDefaultBg = "transparent";

// ============================================
// Form / Input Styles
// ============================================

export const formContainerStyle: React.CSSProperties = {
  padding: "24px",
  paddingBottom: "16px",
  width: "100%",
  flexDirection: "column",
  zIndex: 2,
};

export const formStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  backgroundColor: "rgb(243, 244, 246)",
  borderRadius: "28px",
  padding: "4px",
  marginBottom: "8px",
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  alignItems: "flex-end",
  gap: "4px",
};

export const textareaStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  minHeight: "48px",
  maxHeight: "96px",
  padding: "12px 16px",
  borderRadius: "24px",
  alignItems: "flex-start",
  outline: "none",
  fontSize: "14px",
  lineHeight: "20px",
  backgroundColor: "transparent",
  border: "none",
  fontFamily: "inherit",
  resize: "none",
  overflowY: "hidden",
  overflowX: "hidden",
};

export const createSendButtonStyle = (
  primaryColor: string,
  isDisabled: boolean
): React.CSSProperties => ({
  width: `${SEND_BUTTON_SIZE}px`,
  height: `${SEND_BUTTON_SIZE}px`,
  minWidth: `${SEND_BUTTON_SIZE}px`,
  minHeight: `${SEND_BUTTON_SIZE}px`,
  padding: 0,
  borderRadius: "50%",
  textAlign: "center",
  cursor: isDisabled ? "not-allowed" : "pointer",
  margin: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  alignSelf: "flex-end",
  backgroundColor: primaryColor,
  color: "white",
  border: "none",
  opacity: isDisabled ? 0.5 : 1,
});

export const resetButtonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "end",
};

export const resetButtonStyle: React.CSSProperties = {
  width: "auto",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "end",
  paddingTop: "4px",
  backgroundColor: "transparent",
  color: "rgb(55, 65, 81)",
  cursor: "pointer",
  border: "none",
};

// ============================================
// AI Message Styles
// ============================================

export const aiMessageContainerStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  marginTop: "8px",
};

export const chatMessageContainerStyle: React.CSSProperties = {
  maxWidth: "calc(100% - 40px)",
  width: "100%",
};

export const createAiTextContainerStyle = (
  bgColor?: string,
  textColor?: string
): React.CSSProperties => ({
  padding: "12px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  borderBottomRightRadius: "8px",
  borderBottomLeftRadius: "0",
  maxWidth: "700px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "left",
  backgroundColor: bgColor || "#f3f4f6",
  color: textColor || "black",
});

export const aiTextStyle: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: 0,
  textAlign: "left",
};

// Markdown Container Styles
export const markdownStyles: React.CSSProperties = {
  // Reset für Markdown-Content
  wordBreak: "break-word",
  overflowWrap: "break-word",
};

// ============================================
// Human Message Styles
// ============================================

export const humanMessageContainerStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  maxWidth: "700px",
  marginTop: "8px",
  textAlign: "left",
  marginLeft: "auto",
  justifyContent: "flex-end",
};

export const createHumanMessageStyle = (
  bgColor?: string,
  textColor?: string
): React.CSSProperties => ({
  backgroundColor: bgColor || "rgb(209, 213, 219)",
  color: textColor || "rgb(75, 85, 99)",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "0",
  padding: "12px",
  maxWidth: "calc(100% - 40px)",
  width: "fit-content",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "left",
});

export const humanTextStyle: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "20px",
  marginBottom: 0,
  textAlign: "left",
};

// ============================================
// Loading Styles
// ============================================

export const createLoadingSpinnerStyle = (
  borderColor?: string
): React.CSSProperties => ({
  width: "40px",
  height: "40px",
  border: `4px dashed ${borderColor || "black"}`,
  borderRadius: "9999px",
  animation: "hermine-widget-spin 1s linear infinite",
  margin: "16px",
});

// ============================================
// Retry Button Styles
// ============================================

export const retryButtonStyle: React.CSSProperties = {
  textDecoration: "underline",
  color: "rgb(75, 85, 99)",
  lineHeight: 1,
  fontSize: "14px",
  paddingTop: "4px",
  paddingBottom: "8px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "none",
  opacity: 0.6,
  transition: "opacity 0.2s",
};

// ============================================
// Feedback Button Styles
// ============================================

export const feedbackIconButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  opacity: 0.6,
  transition: "opacity 0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  flexShrink: 0,
  alignSelf: "flex-start",
  marginTop: "2px",
};

export const feedbackButtonContainerStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  justifyContent: "flex-end",
};

export const messageContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

// ============================================
// Avatar Styles
// ============================================

export const avatarStyle: React.CSSProperties = {
  width: `${AVATAR_SIZE}px`,
  height: `${AVATAR_SIZE}px`,
  borderRadius: "9999px",
  flexShrink: 0,
  objectFit: "cover",
};

// ============================================
// Privacy Container Styles
// ============================================

export const privacyContainerStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgb(243, 244, 246)",
  textAlign: "center",
};

export const createAcceptButtonStyle = (
  bgColor?: string,
  textColor?: string
): React.CSSProperties => ({
  width: "auto",
  textAlign: "center",
  padding: "8px 16px",
  textTransform: "none",
  cursor: "pointer",
  borderRadius: "4px",
  backgroundColor: bgColor || "#6B7280",
  color: textColor || "white",
  border: "none",
});

// ============================================
// Feedback Dialog Styles
// ============================================

export const feedbackDialogOverlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  borderRadius: CHAT_WINDOW_BORDER_RADIUS,
};

export const feedbackDialogStyle: React.CSSProperties = {
  position: "relative",
  background: "white",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
  maxWidth: "90%",
  width: "350px",
  maxHeight: "80%",
  overflow: "auto",
  zIndex: 1001,
};

export const feedbackDialogHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  borderBottom: "1px solid #e5e7eb",
};

export const feedbackDialogTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 600,
  color: "#1f2937",
  textAlign: "left",
};

export const feedbackDialogCloseButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#6b7280",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  transition: "background-color 0.2s",
};

export const feedbackDialogContentStyle: React.CSSProperties = {
  padding: "20px",
};

export const feedbackDialogQuestionStyle: React.CSSProperties = {
  margin: "0 0 4px 0",
  fontSize: "14px",
  color: "#374151",
  textAlign: "left",
};

export const feedbackDialogTextareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "inherit",
  resize: "vertical",
  marginBottom: "20px",
  boxSizing: "border-box",
  backgroundColor: "#f9fafb",
  transition: "border-color 0.2s, box-shadow 0.2s",
  textAlign: "left",
};

export const feedbackDialogActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
};

export const feedbackDialogCancelButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#374151",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background-color 0.2s",
};

export const createFeedbackDialogSubmitButtonStyle = (
  primaryColor: string,
  isDisabled: boolean
): React.CSSProperties => ({
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: primaryColor,
  color: "white",
  fontSize: "14px",
  fontWeight: 500,
  cursor: isDisabled ? "not-allowed" : "pointer",
  opacity: isDisabled ? 0.5 : 1,
  transition: "opacity 0.2s",
});

// Feedback Dialog Success Styles
export const feedbackDialogSuccessStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "20px 0",
};

export const feedbackDialogSuccessIconStyle: React.CSSProperties = {
  color: "#10b981",
  fontSize: "48px",
  marginBottom: "16px",
};

export const feedbackDialogSuccessTextStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1f2937",
  margin: "0 0 8px 0",
};

export const feedbackDialogSuccessSubtextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  margin: 0,
};

// Feedback Dialog Error Styles
export const feedbackDialogErrorStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "20px 0",
};

export const feedbackDialogErrorIconStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "48px",
  marginBottom: "16px",
};

export const feedbackDialogErrorTextStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1f2937",
  margin: "0 0 8px 0",
};

export const feedbackDialogErrorSubtextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 16px 0",
};

export const feedbackDialogRetryButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  backgroundColor: "white",
  color: "#374151",
  fontSize: "14px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

// ============================================
// Streaming Cursor Style
// ============================================

export const streamingCursorStyle: React.CSSProperties = {
  display: "inline-block",
  marginLeft: "2px",
  animation: "hermine-widget-blink 1s step-end infinite",
  color: "#6b7280",
  fontWeight: "normal",
};
