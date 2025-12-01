/**
 * ChatHeader Komponente
 *
 * Header-Bereich des Chat-Fensters mit Logo, Titel und Aktionsbuttons.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { useResolvedTheme } from "../theme";
import { X, Maximize2, Minimize2 } from "lucide-react";
import {
  topContainerStyle,
  headerContainerStyle,
  rightSectionStyle,
  titleSectionStyle,
  logoStyle,
  createTitleStyle,
  createSubTitleStyle,
  closeButtonStyle,
} from "./ChatWindow.styles";

// ============================================
// Types
// ============================================

interface ChatHeaderProps {
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onClose: () => void;
}

// ============================================
// Styles
// ============================================

const hoverButtonStyle = (isHovered: boolean): React.CSSProperties => ({
  ...closeButtonStyle,
  backgroundColor: isHovered ? "rgb(243, 244, 246)" : "transparent",
});

// ============================================
// Sub-Components
// ============================================

interface HeaderButtonProps {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

function HeaderButton({ onClick, ariaLabel, children }: HeaderButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      style={hoverButtonStyle(isHovered)}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}

// ============================================
// Main Component
// ============================================

export function ChatHeader({
  isFullScreen,
  onToggleFullScreen,
  onClose,
}: ChatHeaderProps) {
  const { t } = useTranslation();
  const theme = useResolvedTheme();

  return (
    <div style={topContainerStyle}>
      <div style={headerContainerStyle}>
        {/* Left side: Logo */}
        {theme.header.logoUrl && theme.header.showLogo && (
          <img src={theme.header.logoUrl} alt="Logo" style={logoStyle} />
        )}

        {/* Right side: Fullscreen + Close Button */}
        <div style={rightSectionStyle}>
          {theme.features.fullScreenEnabled && onToggleFullScreen && (
            <HeaderButton
              onClick={onToggleFullScreen}
              ariaLabel={
                isFullScreen
                  ? t("header.fullscreenExit")
                  : t("header.fullscreenEnter")
              }
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </HeaderButton>
          )}
          <HeaderButton onClick={onClose} ariaLabel={t("header.close")}>
            <X size={24} />
          </HeaderButton>
        </div>
      </div>

      {/* Title Section */}
      {(theme.header.title ||
        theme.header.subtitle ||
        theme.header.description) && (
        <div style={titleSectionStyle}>
          {theme.header.title && (
            <div style={createTitleStyle(theme.header.titleColor)}>
              {theme.header.title}
            </div>
          )}
          {theme.header.subtitle && (
            <div style={createSubTitleStyle(theme.header.subtitleColor)}>
              {theme.header.subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
