// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "./components/LangProvider";

export const metadata: Metadata = {
  title: "diveplunge",
  description: "Breath. Jump. Live.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
