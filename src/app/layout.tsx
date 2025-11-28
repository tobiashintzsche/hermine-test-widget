import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hermine Widget Demo",
  description: "Demo und Testumgebung für das Hermine Chat Widget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
