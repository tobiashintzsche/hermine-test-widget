import React, { useState, useMemo } from "react";
import type { WidgetConfig } from "./types";
import { useTheme, useConversation } from "./hooks";
import { FloatingButton, ChatWindow } from "./components";
import { ThemeProvider } from "./theme";
import {
  DEFAULT_API_ENDPOINT,
  DEFAULT_POSITION,
  DEFAULT_SPACING,
  WIDGET_Z_INDEX,
} from "./constants";

export function ChatWidget(config: WidgetConfig) {
  const {
    accountId,
    agentSlug,
    apiEndpoint,
    target,
    primaryColor,
    position,
    location,
    spacing = DEFAULT_SPACING,
    spacingRight,
    spacingBottom,
    fontFamily,
  } = config;

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
    bottom: spacingBottom || spacing?.bottom || DEFAULT_SPACING.bottom,
    right: spacingRight || spacing?.right || DEFAULT_SPACING.right,
    left: (spacing as { left?: string })?.left,
  };

  // Lade Theme-Daten von API
  const { theme: apiTheme, imageLoaded } = useTheme({
    accountId,
    agentSlug,
    apiEndpoint: effectiveApiEndpoint,
    fallbackColor: primaryColor,
  });

  // Conversation State auf Widget-Ebene für imageUrl im FloatingButton
  const conversation = useConversation({
    accountId,
    agentSlug,
    apiEndpoint: effectiveApiEndpoint,
  });

  // Memoized config für ThemeProvider (mit aufgelöstem apiEndpoint)
  const themeConfig = useMemo(
    () => ({ ...config, apiEndpoint: effectiveApiEndpoint }),
    [config, effectiveApiEndpoint]
  );

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
    <ThemeProvider config={themeConfig} apiTheme={apiTheme}>
      <div style={containerStyle}>
        {isOpen && (
          <ChatWindow
            accountId={accountId}
            agentSlug={agentSlug}
            apiEndpoint={effectiveApiEndpoint}
            isFullScreen={isFullScreen}
            onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
            onClose={() => setIsOpen(false)}
            conversation={conversation}
          />
        )}
        <FloatingButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          imageLoaded={!conversation.isInitializing}
          imageUrl={conversation.imageUrl}
        />
      </div>
    </ThemeProvider>
  );
}
