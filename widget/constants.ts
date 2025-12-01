/**
 * Konstanten für das Hermine Chat Widget
 */

// Polling-Konfiguration
export const POLLING_MAX_ATTEMPTS = 30;
export const POLLING_INTERVAL_MS = 1000;

// UI-Konstanten
export const DEFAULT_PRIMARY_COLOR = "#6B7280";
export const DEFAULT_API_ENDPOINT = "https://app.hermine.ai";
export const DEFAULT_POSITION = "bottom-right" as const;
export const DEFAULT_SPACING = {
  bottom: "20px",
  right: "20px",
};

// Input Placeholder
export const DEFAULT_INPUT_PLACEHOLDER = "Nachricht eingeben...";
export const PENDING_AI_RESPONSE = "...";

// Z-Index
export const WIDGET_Z_INDEX = 9999;

// Animation Durations
export const ANIMATION_DURATION_MS = 200;
export const FADE_DURATION_MS = 300;
export const AUTO_SCROLL_DELAY = 200;

// Textarea Configuration
export const TEXTAREA_MAX_HEIGHT = 96; // 4 Zeilen in px

// Button Dimensions
export const FLOATING_BUTTON_SIZE = 60;
export const SEND_BUTTON_SIZE = 48;
export const AVATAR_SIZE = 40;

// Window Dimensions
export const CHAT_WINDOW_WIDTH = 500;
export const CHAT_WINDOW_HEIGHT = 600;
export const CHAT_WINDOW_MIN_HEIGHT = "50vh";
export const CHAT_WINDOW_MAX_HEIGHT = "80vh";
export const CHAT_WINDOW_BORDER_RADIUS = "12px";
