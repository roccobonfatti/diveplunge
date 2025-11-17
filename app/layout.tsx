import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { LangProvider } from "./components/LangProvider";
import { SessionProvider } from "@/providers/SessionProvider";

export const metadata: Metadata = {
  title: "diveplunge",
  description: "Breath. Jump. Live.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <SessionProvider>
          <Header />
          <div style={{ paddingTop: 76 }}>
            <LangProvider>{children}</LangProvider>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
