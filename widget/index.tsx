import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "./ChatWidget";
import type { WidgetConfig } from "./types";
import "./styles.css";
import "./i18n"; // i18n Initialisierung

/**
 * Initialisiert das Hermine Chat Widget
 */
function initHermineChat(config: WidgetConfig) {
  // Validierung
  if (!config.accountId || !config.agentSlug) {
    console.error("[HermineChat] accountId und agentSlug sind erforderlich!");
    return;
  }

  // Prüfe ob Container bereits existiert
  let container = document.getElementById("hermine-chat-root");
  if (container) {
    container.remove();
  }

  // Neuen Container erstellen
  container = document.createElement("div");
  container.id = "hermine-chat-root";
  document.body.appendChild(container);

  // React App rendern
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget {...config} />
    </React.StrictMode>
  );

  console.log("[HermineChat] Widget initialisiert", {
    accountId: config.accountId,
    agentSlug: config.agentSlug,
  });
}

/**
 * Auto-Init via data-* Attribute im Script-Tag
 */
(function autoInit() {
  const script = document.currentScript as HTMLScriptElement | null;

  if (script) {
    const config: WidgetConfig = {
      accountId: script.dataset.accountId || "",
      agentSlug: script.dataset.agentSlug || "",
      apiEndpoint: script.dataset.apiEndpoint || "https://hermine.ai",
      primaryColor: script.dataset.primaryColor,
      chatTitle: script.dataset.title,
      chatSubTitle: script.dataset.subtitle,
      position:
        (script.dataset.position as "bottom-right" | "bottom-left") ||
        "bottom-right",
    };

    // Auto-Init wenn accountId und agentSlug vorhanden
    if (config.accountId && config.agentSlug) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          initHermineChat(config)
        );
      } else {
        initHermineChat(config);
      }
    }
  }

  // Globale Funktion für manuelle Initialisierung
  (window as any).HermineChat = initHermineChat;
})();

export { initHermineChat as HermineChat };
export type { WidgetConfig };
