/**
 * useAnimatedText Hook
 *
 * Animiert Text-Änderungen smooth, auch wenn sie chunky ankommen.
 * Simuliert Token-für-Token Streaming auf Client-Seite.
 */

import { useState, useEffect, useRef } from "react";

interface UseAnimatedTextOptions {
  /** Delay zwischen Zeichen in ms (default: 15) */
  charDelay?: number;
  /** Ob Animation aktiv sein soll (default: true) */
  enabled?: boolean;
}

/**
 * Animiert Text-Updates smooth, Character für Character.
 *
 * @param targetText - Der Zieltext, der angezeigt werden soll
 * @param options - Konfiguration für die Animation
 * @returns Der aktuell angezeigte (animierte) Text
 */
export function useAnimatedText(
  targetText: string,
  options: UseAnimatedTextOptions = {}
): string {
  const { charDelay = 15, enabled = true } = options;

  const [displayedText, setDisplayedText] = useState(targetText);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef(targetText);
  const displayedRef = useRef(targetText);

  useEffect(() => {
    targetRef.current = targetText;

    // Wenn Animation deaktiviert, direkt setzen
    if (!enabled) {
      setDisplayedText(targetText);
      displayedRef.current = targetText;
      return;
    }

    // Wenn der neue Text kürzer ist (z.B. Reset), direkt setzen
    if (targetText.length < displayedRef.current.length) {
      setDisplayedText(targetText);
      displayedRef.current = targetText;
      return;
    }

    // Animation bereits laufend? Dann läuft sie weiter zum neuen Ziel
    if (animationRef.current !== null) {
      return;
    }

    // Neue Animation starten
    const animate = () => {
      const current = displayedRef.current;
      const target = targetRef.current;

      if (current.length < target.length) {
        // Nächstes Zeichen hinzufügen
        const nextChar = target[current.length];
        const newText = current + nextChar;
        displayedRef.current = newText;
        setDisplayedText(newText);

        // Nächsten Frame planen
        animationRef.current = window.setTimeout(animate, charDelay);
      } else {
        // Animation beendet
        animationRef.current = null;
      }
    };

    // Animation starten
    animationRef.current = window.setTimeout(animate, charDelay);

    return () => {
      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [targetText, charDelay, enabled]);

  // Cleanup bei Unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  return displayedText;
}
