# Hermine Widget

Modernes Chat-Widget basierend auf Next.js 16 und AI SDK.

## Features

- 🚀 **Next.js 16** mit App Router
- ⚡ **AI SDK 5.x** für Streaming-Support
- 📦 **tsdown** für optimiertes Widget-Bundle (IIFE)
- 🎨 **Tailwind CSS** für Styling
- 💬 **Embeddable Widget** via `<script>` Tag

## Entwicklung

```bash
# Dependencies installieren
npm install

# Dev Server starten
npm run dev

# Widget bauen
npm run build:widget

# Alles bauen (Next.js + Widget)
npm run build
```

## Widget einbinden

### Via Script-Tag (empfohlen)

```html
<script
  src="https://widget.hermine.ai/widget.js"
  data-account-id="your-account-id"
  data-agent-slug="your-agent-slug"
  data-api-endpoint="https://hermine.ai"
  data-primary-color="#1F72B8"
  data-title="Chat Assistant"
></script>
```

### Manuelle Initialisierung

```html
<script src="https://widget.hermine.ai/widget.js"></script>
<script>
  HermineChat({
    accountId: "your-account-id",
    agentSlug: "your-agent-slug",
    apiEndpoint: "https://hermine.ai",
    primaryColor: "#1F72B8",
    title: "Chat Assistant",
  });
</script>
```

## Konfiguration

| Option         | Typ    | Default              | Beschreibung                                |
| -------------- | ------ | -------------------- | ------------------------------------------- |
| `accountId`    | string | (required)           | Account ID von hermine.ai                   |
| `agentSlug`    | string | (required)           | Agent Slug von hermine.ai                   |
| `apiEndpoint`  | string | `https://hermine.ai` | API Endpoint                                |
| `primaryColor` | string | `#6B7280`            | Hauptfarbe für UI-Elemente                  |
| `title`        | string | `Chat Assistant`     | Titel im Chat-Header                        |
| `subtitle`     | string | -                    | Untertitel im Chat-Header                   |
| `position`     | string | `bottom-right`       | Position: `bottom-right` oder `bottom-left` |

## Projektstruktur

```
hermine-widget/
├── src/
│   └── app/              # Next.js App (Demo-Seite)
├── widget/               # Widget-Source
│   ├── index.tsx         # Entry-Point
│   ├── ChatWidget.tsx    # Hauptkomponente
│   ├── components/       # UI-Komponenten
│   └── styles.css        # Widget-Styles
├── public/
│   └── widget.js         # Gebautes Widget (nach build:widget)
├── tsdown.config.ts      # tsdown Build-Config
└── package.json
```

## Technologie-Stack

- **Runtime:** Next.js 16, React 19
- **AI:** Vercel AI SDK 5.x
- **Build:** tsdown (Rolldown)
- **Styling:** Tailwind CSS, CSS-in-JS
- **TypeScript:** Strict Mode
# hermine-test-widget
