import React, { useState } from "react";
import type { WidgetConfig } from "./types";
import { useTheme } from "./hooks";
import { FloatingButton, ChatWindow } from "./components";
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_API_ENDPOINT,
  DEFAULT_POSITION,
  DEFAULT_SPACING,
  WIDGET_Z_INDEX,
} from "./constants";

// Helper to get shadow style
function getShadowStyle(
  shadow?: "none" | "small" | "medium" | "large"
): string {
  switch (shadow) {
    case "none":
      return "none";
    case "small":
      return "0 2px 8px rgba(0, 0, 0, 0.1)";
    case "medium":
      return "0 4px 12px rgba(0, 0, 0, 0.15)";
    case "large":
      return "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
    default:
      return "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
  }
}

export function ChatWidget({
  accountId,
  agentSlug,
  apiEndpoint,
  target,
  primaryColor = DEFAULT_PRIMARY_COLOR,
  chatTitle,
  chatTitleColor,
  chatSubTitle,
  chatSubTitleColor,
  chatDescription,
  chatDescriptionColor,
  chatBackgroundColor,
  fontFamily,
  floatingButtonBackgroundColor,
  floatingButtonIconColor,
  floatingButtonBorderColor,
  floatingButtonWidth,
  floatingButtonHeight,
  floatingButtonIcon,
  aiMessageBackgroundColor,
  aiMessageTextColor,
  messageBackgroundColor,
  buttonBackgroundColor,
  buttonColor,
  position,
  location,
  spacing = DEFAULT_SPACING,
  spacingRight,
  spacingBottom,
  fullScreenEnabled,
  shadow,
  textInputPlaceholder,
  useCustomLogo,
  showConversationManagment,
}: WidgetConfig) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Resolve apiEndpoint from target (legacy) or apiEndpoint
  const effectiveApiEndpoint = apiEndpoint || target || DEFAULT_API_ENDPOINT;

  // Resolve position from location (legacy) or position
  const effectivePosition: "bottom-right" | "bottom-left" =
    position ||
    (location === "bottom" || location === "bottom-right"
      ? "bottom-right"
      : location === "bottom-left"
      ? "bottom-left"
      : DEFAULT_POSITION);

  // Resolve spacing from spacingRight/spacingBottom or spacing object
  const effectiveSpacing = {
    bottom: spacingBottom || spacing.bottom || DEFAULT_SPACING.bottom,
    right: spacingRight || spacing.right || DEFAULT_SPACING.right,
    left: spacing.left,
  };

  const { effectiveColor, aiIcon, imageLoaded, logoUrl } = useTheme({
    accountId,
    agentSlug,
    apiEndpoint: effectiveApiEndpoint,
    fallbackColor: primaryColor,
  });

  // Titel-Farbe: chatTitleColor oder Primary-Farbe
  const effectiveTitleColor = chatTitleColor || effectiveColor;
  const effectiveSubTitleColor = chatSubTitleColor || "#6B7280";

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: WIDGET_Z_INDEX,
    fontFamily: fontFamily || "ui-sans-serif, system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    ...(effectivePosition === "bottom-right" && {
      bottom: effectiveSpacing.bottom,
      right: effectiveSpacing.right,
    }),
    ...(effectivePosition === "bottom-left" && {
      bottom: effectiveSpacing.bottom,
      left: effectiveSpacing.left || "20px",
      alignItems: "flex-start",
    }),
  };

  return (
    <div style={containerStyle}>
      {isOpen && (
        <ChatWindow
          accountId={accountId}
          agentSlug={agentSlug}
          apiEndpoint={effectiveApiEndpoint}
          primaryColor={effectiveColor}
          chatTitle={chatTitle}
          chatTitleColor={effectiveTitleColor}
          chatSubTitle={chatSubTitle}
          chatSubTitleColor={effectiveSubTitleColor}
          chatDescription={chatDescription}
          chatDescriptionColor={chatDescriptionColor}
          chatBackgroundColor={chatBackgroundColor}
          fontFamily={fontFamily}
          aiMessageBackgroundColor={aiMessageBackgroundColor}
          aiMessageTextColor={aiMessageTextColor}
          messageBackgroundColor={messageBackgroundColor}
          buttonBackgroundColor={buttonBackgroundColor}
          buttonColor={buttonColor}
          fullScreenEnabled={fullScreenEnabled}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
          shadow={shadow}
          textInputPlaceholder={textInputPlaceholder}
          useCustomLogo={useCustomLogo}
          showConversationManagment={showConversationManagment}
          onClose={() => setIsOpen(false)}
          aiIcon={aiIcon}
          logoUrl={logoUrl}
        />
      )}
      <FloatingButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        primaryColor={effectiveColor}
        aiIcon={aiIcon}
        imageLoaded={imageLoaded}
        backgroundColor={floatingButtonBackgroundColor}
        iconColor={floatingButtonIconColor}
        borderColor={floatingButtonBorderColor}
        width={floatingButtonWidth}
        height={floatingButtonHeight}
        iconType={floatingButtonIcon}
      />
    </div>
  );
}
