/**
 * Theme Context
 *
 * Stellt das aufgelöste Theme allen Komponenten zur Verfügung.
 * Eliminiert Prop-Drilling durch zentrale Context-Bereitstellung.
 */

import React, { createContext, useContext, useMemo } from "react";
import type { WidgetConfig, Theme } from "../types";
import { resolveTheme, type ResolvedTheme } from "./resolveTheme";

// ============================================
// Context Definition
// ============================================

const ThemeContext = createContext<ResolvedTheme | null>(null);

// ============================================
// Provider Component
// ============================================

interface ThemeProviderProps {
  config: Partial<WidgetConfig>;
  apiTheme?: Theme | null;
  children: React.ReactNode;
}

export function ThemeProvider({
  config,
  apiTheme,
  children,
}: ThemeProviderProps) {
  const theme = useMemo(
    () => resolveTheme(config, apiTheme),
    [config, apiTheme]
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

/**
 * Hook zum Zugriff auf das aufgelöste Theme.
 * Muss innerhalb eines ThemeProviders verwendet werden.
 */
export function useResolvedTheme(): ResolvedTheme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useResolvedTheme must be used within a ThemeProvider");
  }

  return theme;
}

/**
 * Optionaler Hook - gibt null zurück wenn kein Provider vorhanden.
 * Nützlich für Komponenten die auch außerhalb des Providers funktionieren sollen.
 */
export function useResolvedThemeOptional(): ResolvedTheme | null {
  return useContext(ThemeContext);
}
