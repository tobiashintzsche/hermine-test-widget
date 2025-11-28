/**
 * Theme Module
 *
 * Zentrale Stelle für Theme-Resolution.
 * Hier wird Config + API-Theme zu einem finalen Theme zusammengeführt.
 */

export { resolveTheme, updateThemeWithApiData } from "./resolveTheme";
export type { ResolvedTheme } from "./resolveTheme";

export {
  ThemeProvider,
  useResolvedTheme,
  useResolvedThemeOptional,
} from "./ThemeContext";
