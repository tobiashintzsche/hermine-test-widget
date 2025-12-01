/**
 * ErrorBanner Komponente
 *
 * Zeigt Fehlermeldungen im Chat-Fenster an.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { errorBannerStyle, errorCloseButtonStyle } from "./ChatWindow.styles";

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

export function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  const { t } = useTranslation();

  return (
    <div style={errorBannerStyle}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={errorCloseButtonStyle}
        aria-label={t("error.close")}
      >
        <X size={16} />
      </button>
    </div>
  );
}
