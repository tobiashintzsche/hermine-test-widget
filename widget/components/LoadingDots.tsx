import React from "react";

/**
 * Animierte Lade-Punkte für den Chat
 */
export function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#9ca3af",
            animation: `hermine-widget-bounce 1.4s ease-in-out ${
              i * 0.16
            }s infinite both`,
          }}
        />
      ))}
    </div>
  );
}
