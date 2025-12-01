/**
 * Resolved Theme Type
 *
 * Das finale Theme-Objekt, das aus User-Config + API-Theme zusammengeführt wird.
 * Alle Komponenten nutzen nur dieses Objekt - kein direktes Prop-Drilling mehr.
 */

import type { WidgetConfig, Theme } from "../types";

// ============================================
// Resolved Theme Interface
// ============================================

export interface ResolvedTheme {
  // Primary Brand Color (von API oder Config)
  primaryColor: string;

  // Header
  header: {
    title?: string;
    titleColor: string;
    subtitle?: string;
    subtitleColor: string;
    description?: string;
    descriptionColor: string;
    logoUrl?: string;
    showLogo: boolean;
  };

  // Chat Window
  window: {
    backgroundColor: string;
    fontFamily: string;
    shadow: string;
    borderRadius: string;
  };

  // Floating Button
  floatingButton: {
    backgroundColor: string;
    iconColor: string;
    borderColor?: string;
    width: string;
    height: string;
    icon: "image" | "chat";
  };

  // Messages
  messages: {
    ai: {
      backgroundColor: string;
      textColor: string;
    };
    user: {
      backgroundColor: string;
      textColor: string;
    };
  };

  // Input
  input: {
    placeholder: string;
    backgroundColor: string;
    textColor: string;
  };

  // Buttons
  buttons: {
    primary: {
      backgroundColor: string;
      textColor: string;
    };
  };

  // Assets from API
  assets: {
    aiIcon?: string;
    logo?: string;
  };

  // Feature Flags
  features: {
    fullScreenEnabled: boolean;
    showConversationManagement: boolean;
  };
}

// ============================================
// Default Values
// ============================================

const DEFAULTS = {
  primaryColor: "#6B7280",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  borderRadius: "12px",

  // Colors
  subtitleColor: "#6B7280",
  descriptionColor: "#6B7280",
  windowBackground: "#ffffff",

  // Message Colors
  aiMessageBg: "#f3f4f6",
  aiMessageText: "#000000",
  userMessageBg: "#d1d5db",
  userMessageText: "#4b5563",

  // Input
  inputBg: "#f3f4f6",
  inputText: "#000000",
  inputPlaceholder: "Nachricht eingeben...",

  // Button
  buttonText: "#ffffff",

  // Floating Button
  floatingButtonSize: "70px",
  floatingButtonIcon: "chat" as const,
} as const;

// ============================================
// Shadow Resolver
// ============================================

function resolveShadow(shadow?: "none" | "small" | "medium" | "large"): string {
  switch (shadow) {
    case "none":
      return "none";
    case "small":
      return "0 2px 8px rgba(0, 0, 0, 0.1)";
    case "medium":
      return "0 4px 12px rgba(0, 0, 0, 0.15)";
    case "large":
    default:
      return DEFAULTS.shadow;
  }
}

// ============================================
// Theme Resolver
// ============================================

/**
 * Führt User-Config und API-Theme zu einem finalen ResolvedTheme zusammen.
 *
 * Priorität:
 * 1. User-Config (höchste Priorität - explizit vom Entwickler gesetzt)
 * 2. API-Theme (vom Backend geladen)
 * 3. Defaults (Fallback)
 */
export function resolveTheme(
  config: Partial<WidgetConfig>,
  apiTheme?: Theme | null
): ResolvedTheme {
  // Primary Color: Config > API > Default
  const primaryColor =
    config.primaryColor || apiTheme?.primary_500 || DEFAULTS.primaryColor;

  return {
    primaryColor,

    header: {
      title: config.chatTitle,
      titleColor: config.chatTitleColor || primaryColor,
      subtitle: config.chatSubTitle,
      subtitleColor: config.chatSubTitleColor || DEFAULTS.subtitleColor,
      description: config.chatDescription,
      descriptionColor:
        config.chatDescriptionColor || DEFAULTS.descriptionColor,
      logoUrl: apiTheme?.logo,
      showLogo: config.useCustomLogo !== true,
    },

    window: {
      backgroundColor: config.chatBackgroundColor || DEFAULTS.windowBackground,
      fontFamily: config.fontFamily || DEFAULTS.fontFamily,
      shadow: resolveShadow(config.shadow),
      borderRadius: DEFAULTS.borderRadius,
    },

    floatingButton: {
      backgroundColor: config.floatingButtonBackgroundColor || primaryColor,
      iconColor: config.floatingButtonIconColor || DEFAULTS.buttonText,
      borderColor: config.floatingButtonBorderColor,
      width: config.floatingButtonWidth || DEFAULTS.floatingButtonSize,
      height: config.floatingButtonHeight || DEFAULTS.floatingButtonSize,
      icon: config.floatingButtonIcon || DEFAULTS.floatingButtonIcon,
    },

    messages: {
      ai: {
        backgroundColor:
          config.aiMessageBackgroundColor || DEFAULTS.aiMessageBg,
        textColor: config.aiMessageTextColor || DEFAULTS.aiMessageText,
      },
      user: {
        backgroundColor:
          config.messageBackgroundColor || DEFAULTS.userMessageBg,
        textColor: config.messageTextColor || DEFAULTS.userMessageText,
      },
    },

    input: {
      placeholder: config.textInputPlaceholder || DEFAULTS.inputPlaceholder,
      backgroundColor: DEFAULTS.inputBg,
      textColor: DEFAULTS.inputText,
    },

    buttons: {
      primary: {
        backgroundColor: config.buttonBackgroundColor || primaryColor,
        textColor: config.buttonColor || DEFAULTS.buttonText,
      },
    },

    assets: {
      aiIcon: apiTheme?.ai_icon,
      logo: apiTheme?.logo,
    },

    features: {
      fullScreenEnabled: config.fullScreenEnabled ?? false,
      showConversationManagement: config.showConversationManagment !== false,
    },
  };
}

// ============================================
// Partial Theme Updates
// ============================================

/**
 * Aktualisiert ein bestehendes Theme mit neuen API-Daten.
 * Nützlich wenn das API-Theme nachgeladen wird.
 */
export function updateThemeWithApiData(
  currentTheme: ResolvedTheme,
  apiTheme: Theme
): ResolvedTheme {
  return {
    ...currentTheme,
    // Nur Assets und primäre Farbe updaten wenn nicht von User überschrieben
    assets: {
      aiIcon: apiTheme.ai_icon || currentTheme.assets.aiIcon,
      logo: apiTheme.logo || currentTheme.assets.logo,
    },
    header: {
      ...currentTheme.header,
      logoUrl: apiTheme.logo || currentTheme.header.logoUrl,
    },
  };
}
