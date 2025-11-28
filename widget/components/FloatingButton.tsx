import React from "react";
import { Icon } from "./Icon";
import {
  FLOATING_BUTTON_SIZE,
  ANIMATION_DURATION_MS,
  FADE_DURATION_MS,
} from "../constants";

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  primaryColor: string;
  aiIcon?: string;
  imageLoaded?: boolean;
  // Custom styling
  backgroundColor?: string;
  iconColor?: string;
  borderColor?: string;
  width?: string;
  height?: string;
  iconType?: "image" | "chat";
}

export function FloatingButton({
  isOpen,
  onClick,
  primaryColor,
  aiIcon,
  imageLoaded,
  backgroundColor,
  iconColor,
  borderColor,
  width,
  height,
  iconType,
}: FloatingButtonProps) {
  // Button erst zeigen wenn imageLoaded (wird gesetzt nach Theme-Load + Bild-Load)
  const showButton = imageLoaded === true;

  // Parse width/height or use default
  const buttonWidth = width ? parseInt(width, 10) : FLOATING_BUTTON_SIZE;
  const buttonHeight = height ? parseInt(height, 10) : FLOATING_BUTTON_SIZE;
  const buttonSize = Math.min(buttonWidth, buttonHeight);

  // Berechne Icon-Größe (70% der Button-Größe wie in hermine-chat)
  const iconSize = Math.round(buttonSize * 0.7);

  // Determine if we should show the image
  const showImage = iconType === "image" && aiIcon;
  const effectiveBackgroundColor = showImage
    ? backgroundColor || "white"
    : backgroundColor || (aiIcon ? "white" : primaryColor);
  const effectiveIconColor = iconColor || (aiIcon ? primaryColor : "white");
  const effectiveBorderColor = borderColor || primaryColor;

  const buttonStyle: React.CSSProperties = {
    width: width || `${FLOATING_BUTTON_SIZE}px`,
    height: height || `${FLOATING_BUTTON_SIZE}px`,
    borderRadius: "50%",
    backgroundColor: effectiveBackgroundColor,
    border: `2px solid ${effectiveBorderColor}`,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: showImage || aiIcon ? "0" : "10px",
    marginTop: "12px",
    position: "relative",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    transition: `transform ${ANIMATION_DURATION_MS}ms ease, box-shadow ${ANIMATION_DURATION_MS}ms ease, opacity ${FADE_DURATION_MS}ms ease`,
    // Sanftes Fade-In
    opacity: showButton ? 1 : 0,
    pointerEvents: showButton ? "auto" : "none",
    // Shadow wie in hermine-chat
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.3)",
  };

  const avatarStyle: React.CSSProperties = {
    width: width || `${FLOATING_BUTTON_SIZE}px`,
    height: height || `${FLOATING_BUTTON_SIZE}px`,
    objectFit: "cover",
    borderRadius: "50%",
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      aria-label={isOpen ? "Chat schließen" : "Chat öffnen"}
    >
      {showImage && aiIcon ? (
        <img src={aiIcon} alt="Chat" style={avatarStyle} />
      ) : aiIcon && iconType !== "chat" ? (
        <img src={aiIcon} alt="Chat" style={avatarStyle} />
      ) : (
        <Icon name="chat" size={iconSize} color={effectiveIconColor} />
      )}
    </button>
  );
}
