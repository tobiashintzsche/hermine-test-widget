import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { widget: "widget/index.tsx" },
  outDir: "public",
  format: ["iife"],
  // Widget setzt window.HermineChat selbst

  // Performance
  minify: true,
  sourcemap: false,
  clean: false, // Don't clean public folder

  // Bilder als Base64 einbetten
  // loader: {
  //   '.png': 'dataurl',
  //   '.svg': 'dataurl',
  //   '.jpg': 'dataurl',
  // },

  // Alles bundlen (standalone widget)
  noExternal: [/.*/],

  // Browser target
  target: "es2020",
  platform: "browser",
});
