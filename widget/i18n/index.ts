/**
 * i18n Konfiguration für das Hermine Widget
 *
 * Verwendet i18next mit automatischer Browser-Spracherkennung.
 * Fallback-Sprache ist Englisch.
 */

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translations from "./translations";

// Singleton-Pattern: Nur einmal initialisieren
let initialized = false;

/**
 * Initialisiert i18n wenn noch nicht geschehen.
 * Kann mehrfach aufgerufen werden (z.B. bei Hot Reload).
 */
export function initI18n(): typeof i18next {
  if (initialized) {
    return i18next;
  }

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: translations,
      fallbackLng: "en",
      supportedLngs: ["de", "en"],

      // Browser Language Detection Optionen
      detection: {
        // Reihenfolge der Sprachquellen
        order: ["navigator", "htmlTag", "localStorage"],
        // Caching deaktiviert für Widget (jede Seite eigenständig)
        caches: [],
      },

      interpolation: {
        escapeValue: false, // React escaped bereits
      },

      // Debug nur in Development
      debug: process.env.NODE_ENV === "development",

      // React-Suspense deaktivieren für Widget
      react: {
        useSuspense: false,
      },
    });

  initialized = true;
  return i18next;
}

// Automatische Initialisierung beim Import
initI18n();

export default i18next;
