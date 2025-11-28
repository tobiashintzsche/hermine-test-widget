import React from "react";
import { Icon } from "./Icon";
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
}

export function FloatingButton({
  isOpen,
  onClick,
  imageLoaded,
}: FloatingButtonProps) {
  const theme = useResolvedTheme();

  // Button erst zeigen wenn imageLoaded (wird gesetzt nach Theme-Load + Bild-Load)
  const showButton = imageLoaded === true;

  // Resolve colors and sizes from theme
  const colors = resolveFloatingButtonColors(theme);
  const sizes = calculateButtonSize(theme);

  // Get styles
  const buttonStyle = createButtonStyle({
    theme,
    showButton,
    showImage: colors.showImage,
    hasAiIcon: !!colors.aiIcon,
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
      {colors.showImage && colors.aiIcon ? (
        <img src={colors.aiIcon} alt="Chat" style={avatarStyle} />
      ) : colors.aiIcon && theme.floatingButton.icon !== "chat" ? (
        <img src={colors.aiIcon} alt="Chat" style={avatarStyle} />
      ) : (
        <Icon name="chat" size={sizes.iconSize} color={colors.iconColor} />
      )}
    </button>
  );
}
