"use client";

import { useEffect, useState } from "react";

// Widget-Konfigurationen zum Testen
const DEMO_CONFIGS = {
  chieming: {
    accountId: "2d0c055a-d91e-45a8-bd09-0270029e8a95",
    agentSlug: "chatbot-gemeinde-copy-209ed7cf-d8a5-4a4c-90b4-10a62b6c4228",
    apiEndpoint: "https://app.hermine.ai",
    // Chat Window Design
    chatTitle: "Hi, ich bin Chiemi",
    chatTitleColor: "#16416e",
    chatSubTitle: "KI Chat der Gemeinde Chieming",
    chatSubTitleColor: "#6B7280",
    chatDescription:
      "Herzlich willkommen! Ich bin der ChatBot der Gemeinde Chieming und beantworte gerne Ihre Fragen.",
    chatDescriptionColor: "#6B7280",
    chatBackgroundColor: "#FFFFFF",
    fontFamily: '"Nunito Sans", sans-serif',
    // Floating Button Design
    floatingButtonBackgroundColor: "#f9fafb",
    floatingButtonIconColor: "#16416e",
    floatingButtonBorderColor: "#16416e",
    floatingButtonWidth: "60px",
    floatingButtonHeight: "60px",
    floatingButtonIcon: "image" as const,
    // Message Styling
    aiMessageBackgroundColor: "#dae8f5",
    aiMessageTextColor: "#16416e",
    messageBackgroundColor: "#f9fafb",
    buttonBackgroundColor: "#16416e",
    buttonColor: "white",
    // Modern Features
    fullScreenEnabled: true,
    shadow: "large" as const,
    textInputPlaceholder: "Stellen Sie Ihre Frage...",
    // Layout
    spacingRight: "20px",
    spacingBottom: "20px",
    useCustomLogo: false,
    showConversationManagment: true,
  },
  wiggerl: {
    accountId: "60061c13-6bbf-41bc-af62-67ed04c90858",
    agentSlug: "wiggerl-weiss-was-copy-dac6fd3c-d370-4eb8-83ef-5561f2a3928f",
    apiEndpoint: "https://app.hermine.ai",
    primaryColor: "##1f72b8",
    chatTitle: "Wiggerl weiß was",
    chatSubTitle:
      "Fragen rund ums Ferienprogramm? Wiggerl unsere g'scheite Ferienprogramm-KI weiß eine ganze Menge zum Ferienprogramm",
  },
  m2: {
    accountId: "8b6fd9d2-f69f-483d-8c0f-34efc77c1ac3",
    agentSlug: "m2-ki-assistenz",
    apiEndpoint: "https://app.hermine.ai",
    primaryColor: "#F8363E",
    chatTitle: "KI Rechtsberatung",
    chatSubTitle: "Wie kann ich Ihnen helfen?",
  },
};

export default function Home() {
  const [selectedConfig, setSelectedConfig] =
    useState<keyof typeof DEMO_CONFIGS>("chieming");
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Widget laden
  useEffect(() => {
    // Prüfe ob Widget bereits geladen
    if ((window as any).HermineChat) {
      setWidgetLoaded(true);
      return;
    }

    // Widget-Script dynamisch laden
    const script = document.createElement("script");
    script.src = "/widget.iife.js";
    script.async = true;
    script.onload = () => {
      setWidgetLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup: Widget-Container entfernen wenn vorhanden
      const container = document.getElementById("hermine-chat-root");
      if (container) {
        container.remove();
      }
    };
  }, []);

  // Widget initialisieren wenn Config sich ändert
  useEffect(() => {
    if (!widgetLoaded) return;

    // Alten Container entfernen
    const oldContainer = document.getElementById("hermine-chat-root");
    if (oldContainer) {
      oldContainer.remove();
    }

    // Widget neu initialisieren
    const config = DEMO_CONFIGS[selectedConfig];
    if ((window as any).HermineChat) {
      (window as any).HermineChat(config);
    }
  }, [widgetLoaded, selectedConfig]);

  const config = DEMO_CONFIGS[selectedConfig];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hermine Widget Demo</h1>

        {/* Config Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Konfiguration wählen</h2>
          <div className="flex gap-4">
            {Object.entries(DEMO_CONFIGS).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() =>
                  setSelectedConfig(key as keyof typeof DEMO_CONFIGS)
                }
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedConfig === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {cfg.chatTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Aktuelle Config */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Aktuelle Konfiguration</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        {/* Embed Code */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Einbettungscode</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            {`<script>
(async function() {
    'use strict';
    const Hermine = await import("https://cdn.zauberware.com/hermine-chat/current/esm/index.js");
    Hermine.HermineChat(${JSON.stringify(config, null, 4)});
})();
</script>`}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `<script>\n(async function() {\n    'use strict';\n    const Hermine = await import("https://cdn.zauberware.com/hermine-chat/current/esm/index.js");\n    Hermine.HermineChat(${JSON.stringify(
                  config
                )});\n})();\n</script>`
              );
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Code kopieren
          </button>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Widget Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                widgetLoaded ? "bg-green-500" : "bg-yellow-500 animate-pulse"
              }`}
            />
            <span>
              {widgetLoaded ? "Widget geladen" : "Widget wird geladen..."}
            </span>
          </div>
        </div>

        {/* Test Area */}
        <div className="mt-8 p-8 bg-gray-300 rounded-lg min-h-[400px] relative">
          <p className="text-gray-600 text-center">
            Das Widget erscheint unten rechts auf dieser Seite.
            <br />
            Klicke auf den Chat-Button um es zu öffnen!
          </p>
        </div>
      </div>
    </main>
  );
}
