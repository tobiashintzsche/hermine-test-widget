/**
 * Styles für FloatingButton Komponente
 */

import React from "react";
import type { ResolvedTheme } from "../theme";
import {
  FLOATING_BUTTON_SIZE,
  ANIMATION_DURATION_MS,
  FADE_DURATION_MS,
} from "../constants";

// ============================================
// Style Configuration Interface
// ============================================

export interface FloatingButtonStyleConfig {
  theme: ResolvedTheme;
  showButton: boolean;
  showImage: boolean;
  hasAiIcon: boolean;
}

// ============================================
// Color Resolution
// ============================================

export function resolveFloatingButtonColors(theme: ResolvedTheme) {
  // Verwende logo statt ai_icon für den FloatingButton
  const buttonImage = theme.assets.logo;
  const showImage = theme.floatingButton.icon === "image" && buttonImage;

  const backgroundColor = showImage
    ? theme.floatingButton.backgroundColor
    : theme.floatingButton.backgroundColor ||
      (buttonImage ? "white" : theme.primaryColor);

  const iconColor =
    theme.floatingButton.iconColor ||
    (buttonImage ? theme.primaryColor : "white");

  const borderColor = theme.floatingButton.borderColor || theme.primaryColor;

  return {
    backgroundColor,
    iconColor,
    borderColor,
    showImage: !!showImage,
    buttonImage,
  };
}

// ============================================
// Size Calculation
// ============================================

export function calculateButtonSize(theme: ResolvedTheme) {
  const buttonWidth = theme.floatingButton.width
    ? parseInt(theme.floatingButton.width, 10)
    : FLOATING_BUTTON_SIZE;
  const buttonHeight = theme.floatingButton.height
    ? parseInt(theme.floatingButton.height, 10)
    : FLOATING_BUTTON_SIZE;

  const buttonSize = Math.min(buttonWidth, buttonHeight);
  const iconSize = Math.round(buttonSize * 0.7);

  return {
    width: theme.floatingButton.width || `${FLOATING_BUTTON_SIZE}px`,
    height: theme.floatingButton.height || `${FLOATING_BUTTON_SIZE}px`,
    buttonSize,
    iconSize,
  };
}

// ============================================
// Button Styles
// ============================================

export function createButtonStyle(
  config: FloatingButtonStyleConfig
): React.CSSProperties {
  const { theme, showButton, showImage, hasAiIcon } = config;
  const colors = resolveFloatingButtonColors(theme);
  const sizes = calculateButtonSize(theme);

  return {
    width: sizes.width,
    height: sizes.height,
    borderRadius: "50%",
    backgroundColor: colors.backgroundColor,
    border: `2px solid ${colors.borderColor}`,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: showImage || hasAiIcon ? "0" : "10px",
    marginTop: "12px",
    position: "relative",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    transition: `transform ${ANIMATION_DURATION_MS}ms ease, box-shadow ${ANIMATION_DURATION_MS}ms ease, opacity ${FADE_DURATION_MS}ms ease`,
    opacity: showButton ? 1 : 0,
    pointerEvents: showButton ? "auto" : "none",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.3)",
  };
}

// ============================================
// Avatar Styles
// ============================================

export function createAvatarStyle(theme: ResolvedTheme): React.CSSProperties {
  // Bild etwas kleiner als Button für bessere Passform im runden Button
  const imageSize = "100%";

  return {
    width: imageSize,
    height: imageSize,
    objectFit: "cover",
    borderRadius: "50%",
  };
}

// ============================================
// Hover Handlers
// ============================================

export const hoverHandlers = {
  onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = "0.8";
  },
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = "1";
  },
};
