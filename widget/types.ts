// ============================================
// Widget Configuration Types
// ============================================

export interface WidgetConfig {
  accountId: string;
  agentSlug: string;
  apiEndpoint?: string;
  /** @deprecated use apiEndpoint instead */
  target?: string;
  primaryColor?: string;

  // Header Konfiguration
  chatTitle?: string;
  chatTitleColor?: string;
  chatSubTitle?: string;
  chatSubTitleColor?: string;
  chatDescription?: string;
  chatDescriptionColor?: string;
  chatBackgroundColor?: string;

  // Typography
  fontFamily?: string;

  // Floating Button Design
  floatingButtonBackgroundColor?: string;
  floatingButtonIconColor?: string;
  floatingButtonBorderColor?: string;
  floatingButtonWidth?: string;
  floatingButtonHeight?: string;
  floatingButtonIcon?: "image" | "chat";

  // Message Styling
  aiMessageBackgroundColor?: string;
  aiMessageTextColor?: string;
  messageBackgroundColor?: string;
  messageTextColor?: string;
  buttonBackgroundColor?: string;
  buttonColor?: string;

  // Layout & Position
  position?: "bottom-right" | "bottom-left";
  /** @deprecated use position instead */
  location?: "bottom" | "bottom-right" | "bottom-left";
  spacing?: {
    bottom?: string;
    right?: string;
    left?: string;
  };
  /** Alternative to spacing.right */
  spacingRight?: string;
  /** Alternative to spacing.bottom */
  spacingBottom?: string;

  // Features
  fullScreenEnabled?: boolean;
  shadow?: "none" | "small" | "medium" | "large";
  textInputPlaceholder?: string;
  useCustomLogo?: boolean;
  showConversationManagment?: boolean;
}

/**
 * API-Konfiguration für Service Layer
 */
export interface ApiConfig {
  accountId: string;
  agentSlug: string;
  apiEndpoint: string;
}

// ============================================
// Message Types
// ============================================

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isWelcome?: boolean;
  createdAt?: Date;
  conversationId?: string;
  hasErrors?: boolean;
}

/**
 * Raw Message vom Backend
 */
export interface ApiMessage {
  id: string;
  message_type: "ai" | "user";
  result: string;
  is_welcome_message?: boolean;
  created_at?: string;
  conversation_id?: string;
  has_errors?: boolean;
}

// ============================================
// Theme Types
// ============================================

export interface Theme {
  ai_icon?: string;
  logo?: string;
  logo_small?: string;
  primary_500?: string;
  primary_900?: string;
  name?: string;
}

// ============================================
// Conversation Types
// ============================================

export interface Conversation {
  id: string;
  messages: Message[];
  prompts?: string[];
  privacyDisclaimer?: string;
}

// ============================================
// API Response Types
// ============================================

export interface CreateConversationResponse {
  conversation_id: string;
}

export interface ConversationResponse {
  id: string;
  messages: ApiMessage[];
  prompts?: string[];
  imageUrl?: string;
  inputPlaceholderDe?: string;
  inputPlaceholderEn?: string;
  privacyDisclaimer?: string;
}

export interface SendMessageResponse {
  status: "ok" | "error";
  message?: string;
}

export interface ThemeResponse extends Theme {}

// ============================================
// Helper Functions
// ============================================

/**
 * Konvertiert eine API-Message in das interne Format
 */
export function mapApiMessageToMessage(apiMessage: ApiMessage): Message {
  return {
    id: apiMessage.id,
    role: apiMessage.message_type === "ai" ? "assistant" : "user",
    content: apiMessage.result,
    isWelcome: apiMessage.is_welcome_message,
    createdAt: apiMessage.created_at
      ? new Date(apiMessage.created_at)
      : undefined,
    conversationId: apiMessage.conversation_id,
    hasErrors: apiMessage.has_errors,
  };
}
