/**
 * useTheme Hook
 *
 * Lädt und verwaltet das Theme/Branding für das Widget
 */

import { useState, useEffect } from "react";
import type { ApiConfig, Theme } from "../types";
import { fetchTheme } from "../services/api";

interface UseThemeOptions extends ApiConfig {
  fallbackColor?: string;
}

interface UseThemeReturn {
  theme: Theme | null;
  isLoaded: boolean;
  imageLoaded: boolean;
  effectiveColor: string;
  themeName: string | undefined;
  aiIcon: string | undefined;
  logoUrl: string | undefined;
}

export function useTheme(options: UseThemeOptions): UseThemeReturn {
  const {
    accountId,
    agentSlug,
    apiEndpoint,
    fallbackColor = "#6B7280",
  } = options;

  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await fetchTheme({ accountId, agentSlug, apiEndpoint });
        setTheme(data);
        setIsLoaded(true);

        // Bild preloaden für smooth UX
        if (data.ai_icon) {
          const img = new Image();
          img.onload = () => setImageLoaded(true);
          img.onerror = () => setImageLoaded(true); // Trotzdem anzeigen bei Fehler
          img.src = data.ai_icon;
        } else {
          setImageLoaded(true);
        }
      } catch (error) {
        console.error("[HermineChat] Fehler beim Laden des Themes:", error);
        // Bei Fehler trotzdem anzeigen mit Fallback-Werten
        setIsLoaded(true);
        setImageLoaded(true);
      }
    };

    loadTheme();
  }, [apiEndpoint, agentSlug, accountId]);

  return {
    theme,
    isLoaded,
    imageLoaded,
    effectiveColor: theme?.primary_500 || fallbackColor,
    themeName: theme?.name,
    aiIcon: theme?.ai_icon,
    logoUrl: theme?.logo,
  };
}
