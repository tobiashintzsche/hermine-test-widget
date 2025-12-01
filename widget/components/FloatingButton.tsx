import React from "react";
import { MessageCircle } from "lucide-react";
import { useResolvedTheme } from "../theme";
import {
  createButtonStyle,
  createAvatarStyle,
  resolveFloatingButtonColors,
  calculateButtonSize,
  hoverHandlers,
} from "./FloatingButton.styles";

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  imageLoaded?: boolean;
  imageUrl?: string;
}

export function FloatingButton({
  isOpen,
  onClick,
  imageLoaded,
  imageUrl,
}: FloatingButtonProps) {
  const theme = useResolvedTheme();

  // Button erst zeigen wenn imageLoaded (wird gesetzt nach Theme-Load + Bild-Load)
  const showButton = imageLoaded === true;

  // Resolve colors and sizes from theme
  const colors = resolveFloatingButtonColors(theme);
  const sizes = calculateButtonSize(theme);

  // NUR imageUrl aus Conversation verwenden (Agent's ai_icon)
  const effectiveImageUrl = imageUrl;
  const showImage = theme.floatingButton.icon === "image" && effectiveImageUrl;

  // Get styles
  const buttonStyle = createButtonStyle({
    theme,
    showButton,
    showImage: !!showImage,
    hasAiIcon: !!effectiveImageUrl,
  });
  const avatarStyle = createAvatarStyle(theme);

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={hoverHandlers.onMouseEnter}
      onMouseLeave={hoverHandlers.onMouseLeave}
      aria-label={isOpen ? "Chat schließen" : "Chat öffnen"}
    >
      {showImage && effectiveImageUrl ? (
        <img src={effectiveImageUrl} alt="Chat" style={avatarStyle} />
      ) : effectiveImageUrl && theme.floatingButton.icon !== "chat" ? (
        <img src={effectiveImageUrl} alt="Chat" style={avatarStyle} />
      ) : (
        <MessageCircle size={sizes.iconSize} color={colors.iconColor} />
      )}
    </button>
  );
}
