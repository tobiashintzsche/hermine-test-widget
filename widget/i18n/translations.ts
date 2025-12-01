/**
 * Übersetzungsdateien für das Hermine Widget
 *
 * Enthält alle UI-Texte in Deutsch und Englisch
 */

export const translations = {
  de: {
    translation: {
      // Chat Header
      header: {
        fullscreenEnter: "Vollbild aktivieren",
        fullscreenExit: "Vollbild beenden",
        close: "Chat schließen",
      },
      // Chat Input
      input: {
        placeholder: "Nachricht eingeben...",
        newConversation: "Neues Gespräch",
      },
      // Feedback Dialog
      feedback: {
        title: "Feedback",
        question:
          "Geben Sie Feedback zu dieser Nachricht. Service-Mitarbeiter und Administratoren des Kontos sehen Ihr Feedback und den Chat-Verlauf, um die KI zu verbessern.",
        placeholder: "Ihr Feedback...",
        cancel: "Abbrechen",
        submit: "Senden",
        submitting: "Wird gesendet...",
        successTitle: "Feedback erfolgreich gesendet!",
        successMessage: "Vielen Dank für Ihr Feedback.",
        errorTitle: "Fehler beim Senden des Feedbacks",
        errorMessage: "Bitte versuchen Sie es erneut.",
        retry: "Erneut versuchen",
        buttonTitle: "Feedback geben",
      },
      // Error Messages
      error: {
        generic: "Bei dieser Anfrage ist ein Fehler aufgetreten.",
        close: "Fehler schließen",
        tryAgain: "Erneut versuchen",
      },
      // Loading States
      loading: {
        initializing: "Chat wird geladen...",
      },
    },
  },
  en: {
    translation: {
      // Chat Header
      header: {
        fullscreenEnter: "Enter fullscreen",
        fullscreenExit: "Exit fullscreen",
        close: "Close chat",
      },
      // Chat Input
      input: {
        placeholder: "Type your message...",
        newConversation: "New conversation",
      },
      // Feedback Dialog
      feedback: {
        title: "Feedback",
        question:
          "Provide feedback on this message. Service staff and account administrators will see your feedback and chat history to improve the AI.",
        placeholder: "Your feedback...",
        cancel: "Cancel",
        submit: "Send",
        submitting: "Sending...",
        successTitle: "Feedback sent successfully!",
        successMessage: "Thank you for your feedback.",
        errorTitle: "Failed to send feedback",
        errorMessage: "Please try again.",
        retry: "Try again",
        buttonTitle: "Give feedback",
      },
      // Error Messages
      error: {
        generic: "An error occurred with this request.",
        close: "Close error",
        tryAgain: "Try again",
      },
      // Loading States
      loading: {
        initializing: "Loading chat...",
      },
    },
  },
};

export default translations;
