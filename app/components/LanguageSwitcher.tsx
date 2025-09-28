// app/components/LanguageSwitcher.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useI18n, Lang } from "./LangProvider";

const RAW = [
  { code: "ar",    label: "العربية",                 flag: "🇸🇦" },
  { code: "da",    label: "Dansk",                   flag: "🇩🇰" },
  { code: "de",    label: "Deutsch",                 flag: "🇩🇪" },
  { code: "de-AT", label: "Deutsch (Österreich)",    flag: "🇦🇹" },
  { code: "de-CH", label: "Deutsch (Schweiz)",       flag: "🇨🇭" },
  { code: "el",    label: "Ελληνικά",                flag: "🇬🇷" },
  { code: "en",    label: "English",                 flag: "🇺🇸" },
  { code: "en-GB", label: "English (UK)",            flag: "🇬🇧" },
  { code: "en-CA", label: "English (Canada)",        flag: "🇨🇦" },
  { code: "en-NZ", label: "English (New Zealand)",   flag: "🇳🇿" },
  { code: "es",    label: "Español",                 flag: "🇪🇸" },
  { code: "fi",    label: "Suomi",                   flag: "🇫🇮" },
  { code: "fr",    label: "Français",                flag: "🇫🇷" },
  { code: "hi",    label: "हिन्दी",                  flag: "🇮🇳" },
  { code: "it",    label: "Italiano",                flag: "🇮🇹" },
  { code: "ja",    label: "日本語",                  flag: "🇯🇵" },
  { code: "ko",    label: "한국어",                  flag: "🇰🇷" },
  { code: "nb",    label: "Norsk Bokmål",            flag: "🇳🇴" },
  { code: "nl",    label: "Nederlands",              flag: "🇳🇱" },
  { code: "pl",    label: "Polski",                  flag: "🇵🇱" },
  { code: "pt",    label: "Português",               flag: "🇵🇹" },
  { code: "ro",    label: "Română",                  flag: "🇷🇴" },
  { code: "ru",    label: "Русский",                 flag: "🇷🇺" },
  { code: "sl",    label: "Slovenščina",             flag: "🇸🇮" },
  { code: "sv",    label: "Svenska",                 flag: "🇸🇪" },
  { code: "ur",    label: "اردو",                    flag: "🇵🇰" },
  { code: "zh",    label: "中文",                    flag: "🇨🇳" },
] as { code: Lang; label: string; flag: string }[];

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  const LANGS = useMemo(
    () => [...RAW].sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const curr =
    LANGS.find((l) => l.code === lang) || LANGS.find((l) => l.code === "it")!;

  return (
    <div className="dp-lang" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="dp-lang-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Language"
        title="Language"
      >
        <span className="dp-lang-emoji">{curr.flag}</span>
      </button>

      {open && (
        <div className="dp-lang-menu">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className="dp-lang-item"
              onClick={() => setLang(l.code)}
              aria-label={l.label}
            >
              <span style={{ fontSize: 22, marginRight: 8 }}>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
