/**
 * useChatForm Hook
 *
 * Verwaltet das Chat-Formular (Input, Submit, Textarea-Height).
 */

import { useState, useRef, useCallback } from "react";
import { TEXTAREA_MAX_HEIGHT } from "../constants";

interface UseChatFormOptions {
  onSubmit: (content: string) => Promise<void>;
  isDisabled?: boolean;
}

export interface UseChatFormReturn {
  /** Aktueller Input-Wert */
  input: string;
  /** Ref für die Textarea */
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Change-Handler für Textarea */
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** KeyDown-Handler (Enter zum Senden) */
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Submit-Handler */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** True wenn Submit disabled ist */
  isSubmitDisabled: boolean;
  /** Input zurücksetzen */
  reset: () => void;
}

export function useChatForm(options: UseChatFormOptions): UseChatFormReturn {
  const { onSubmit, isDisabled = false } = options;

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Textarea-Höhe automatisch anpassen
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT);
      textarea.style.height = `${newHeight}px`;

      // Overflow-Verhalten basierend auf der Höhe anpassen
      textarea.style.overflowY =
        scrollHeight > TEXTAREA_MAX_HEIGHT ? "auto" : "hidden";
    }
  }, []);

  // Textarea zurücksetzen
  const resetTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      adjustTextareaHeight();
    },
    [adjustTextareaHeight]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isDisabled) return;

      const content = input;
      setInput("");
      resetTextarea();

      await onSubmit(content);
    },
    [input, isDisabled, onSubmit, resetTextarea]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const reset = useCallback(() => {
    setInput("");
    resetTextarea();
  }, [resetTextarea]);

  const isSubmitDisabled = isDisabled || !input.trim();

  return {
    input,
    textareaRef,
    handleChange,
    handleKeyDown,
    handleSubmit,
    isSubmitDisabled,
    reset,
  };
}
