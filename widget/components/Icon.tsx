import React from "react";

interface IconProps {
  name: "close" | "send" | "chat" | "feedback" | "maximize" | "minimize";
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const icons: Record<IconProps["name"], React.ReactNode> = {
  close: (
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  ),
  send: (
    <path
      d="M10 14L12.2728 19.3032C12.5856 20.0331 13.5586 20.1103 13.9486 19.4185C14.7183 18.0535 15.8591 15.8522 17 13C19 8 20 4 20 4M10 14L4.69678 11.7272C3.96687 11.4144 3.88975 10.4414 4.58149 10.0514C5.94647 9.28173 8.14784 8.14086 11 7C16 5 20 4 20 4M10 14L20 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  chat: (
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  ),
  feedback: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
    />
  ),
  maximize: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    />
  ),
  minimize: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
    />
  ),
};

/**
 * Icon-Komponente für konsistente Icons im Widget
 */
export function Icon({
  name,
  size = 24,
  color = "currentColor",
  style,
}: IconProps) {
  // Send, feedback, maximize und minimize icons sind stroke-basiert, andere sind fill-basiert
  const isStrokeIcon =
    name === "send" ||
    name === "feedback" ||
    name === "maximize" ||
    name === "minimize";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isStrokeIcon ? "none" : color}
      stroke={isStrokeIcon ? "currentColor" : undefined}
      strokeWidth={isStrokeIcon ? "1.5" : undefined}
      style={{ ...style, color }}
    >
      {icons[name]}
    </svg>
  );
}
