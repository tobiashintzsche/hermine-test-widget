/**
 * useAutoScroll Hook
 *
 * Verwaltet automatisches Scrollen zu neuen Nachrichten.
 */

import { useRef, useEffect, useCallback } from "react";
import { AUTO_SCROLL_DELAY } from "../constants";

interface UseAutoScrollOptions {
  /** Dependency die Scroll triggert (z.B. messages.length) */
  dependency: unknown;
}

export interface UseAutoScrollReturn {
  /** Ref für den Container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref für das Scroll-Target (Ende der Liste) */
  endRef: React.RefObject<HTMLDivElement | null>;
  /** Manuelles Scrollen zum Ende */
  scrollToEnd: () => void;
}

export function useAutoScroll(
  options: UseAutoScrollOptions
): UseAutoScrollReturn {
  const { dependency } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  // Auto-scroll bei Änderungen
  useEffect(() => {
    const timeoutId = setTimeout(scrollToEnd, AUTO_SCROLL_DELAY);
    return () => clearTimeout(timeoutId);
  }, [dependency, scrollToEnd]);

  return {
    containerRef,
    endRef,
    scrollToEnd,
  };
}
