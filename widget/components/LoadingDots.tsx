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
            animation: `hermine-bounce 1.4s ease-in-out ${
              i * 0.16
            }s infinite both`,
          }}
        />
      ))}
      <style>{`
        @keyframes hermine-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
