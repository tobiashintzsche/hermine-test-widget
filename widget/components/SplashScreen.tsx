/**
 * SplashScreen Komponente
 *
 * Zeigt Welcome-Message und Prompts vor der ersten Benutzerinteraktion.
 */

import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createMarkdownComponents } from "./MarkdownComponents";
import { useResolvedTheme } from "../theme/ThemeContext";
import {
  splashScreenStyle,
  splashTextStyle,
  promptsContainerStyle,
  promptButtonStyle,
  promptButtonHoverBg,
  promptButtonDefaultBg,
} from "./ChatWindow.styles";

// ============================================
// Types
// ============================================

interface SplashScreenProps {
  welcomeMessage?: string;
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

// ============================================
// Sub-Components
// ============================================

interface PromptButtonProps {
  prompt: string;
  onClick: () => void;
}

function PromptButton({ prompt, onClick }: PromptButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const style: React.CSSProperties = {
    ...promptButtonStyle,
    backgroundColor: isHovered ? promptButtonHoverBg : promptButtonDefaultBg,
  };

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {prompt}
    </button>
  );
}

// ============================================
// Main Component
// ============================================

export function SplashScreen({
  welcomeMessage,
  prompts,
  onPromptClick,
}: SplashScreenProps) {
  const theme = useResolvedTheme();
  const primaryColor = theme.primaryColor;
  const filteredPrompts = prompts.filter((prompt) => !!prompt);

  return (
    <div style={splashScreenStyle}>
      <div>
        {welcomeMessage && (
          <div style={splashTextStyle}>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={createMarkdownComponents(primaryColor)}
            >
              {welcomeMessage}
            </Markdown>
          </div>
        )}
        {filteredPrompts.length > 0 && (
          <div style={promptsContainerStyle}>
            {filteredPrompts.map((prompt) => (
              <PromptButton
                key={prompt}
                prompt={prompt}
                onClick={() => onPromptClick(prompt)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
