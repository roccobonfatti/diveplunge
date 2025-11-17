// app/components/LangProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Codici lingua (alcuni con regione per varianti richieste) */
export type Lang =
  | "ar" | "da" | "de" | "de-AT" | "de-CH" | "el" | "en" | "en-GB" | "en-CA" | "en-NZ"
  | "es" | "fi" | "fr" | "hi" | "it" | "ja" | "ko" | "nb" | "nl" | "pl" | "pt"
  | "ro" | "ru" | "sl" | "sv" | "ur" | "zh";

/** Dizionari: compiliamo bene IT ed EN. Le altre lingue fanno fallback a EN. */
type Dict = Record<string, string>;
type AllDicts = Partial<Record<Lang, Dict>>;

const EN: Dict = {
  "search.placeholder": "Search city or place (e.g. Cagliari)…",
  "filter.all": "All waters",
  "filter.sea": "Sea",
  "filter.lake": "Lake",
  "filter.river": "River",
  "btn.search": "Search",
  "header.profile": "Profile",
  "header.create": "Create spot",
  "header.favorites": "Favorites",
  "header.settings": "Settings",
  "header.signout": "Sign out",
  "header.signin": "Sign in / Register",
};

const IT: Dict = {
  "search.placeholder": "Cerca città o luogo (es. Cagliari)…",
  "filter.all": "Tutte le acque",
  "filter.sea": "Mare",
  "filter.lake": "Lago",
  "filter.river": "Fiume",
  "btn.search": "Cerca",
  "header.profile": "Profilo",
  "header.create": "Crea spot",
  "header.favorites": "Preferiti",
  "header.settings": "Impostazioni",
  "header.signout": "Esci",
  "header.signin": "Accedi / Registrati",
};

const FR: Dict = {
  "search.placeholder": "Rechercher une ville ou un lieu (ex. Cagliari)…",
  "filter.all": "Toutes les eaux",
  "filter.sea": "Mer",
  "filter.lake": "Lac",
  "filter.river": "Rivière",
  "btn.search": "Rechercher",
  "header.profile": "Profil",
  "header.create": "Créer un spot",
  "header.favorites": "Favoris",
  "header.settings": "Paramètres",
  "header.signout": "Déconnexion",
  "header.signin": "Se connecter / S’inscrire",
};

const DE: Dict = {
  "search.placeholder": "Stadt oder Ort suchen (z. B. Cagliari)…",
  "filter.all": "Alle Gewässer",
  "filter.sea": "Meer",
  "filter.lake": "See",
  "filter.river": "Fluss",
  "btn.search": "Suchen",
  "header.profile": "Profil",
  "header.create": "Spot erstellen",
  "header.favorites": "Favoriten",
  "header.settings": "Einstellungen",
  "header.signout": "Abmelden",
  "header.signin": "Anmelden / Registrieren",
};

const ES: Dict = {
  "search.placeholder": "Buscar ciudad o lugar (ej. Cagliari)…",
  "filter.all": "Todas las aguas",
  "filter.sea": "Mar",
  "filter.lake": "Lago",
  "filter.river": "Río",
  "btn.search": "Buscar",
  "header.profile": "Perfil",
  "header.create": "Crear spot",
  "header.favorites": "Favoritos",
  "header.settings": "Ajustes",
  "header.signout": "Cerrar sesión",
  "header.signin": "Iniciar sesión / Registrarse",
};

const RU: Dict = {
  "search.placeholder": "Поиск города или места (напр. Кальяри)…",
  "filter.all": "Все воды",
  "filter.sea": "Море",
  "filter.lake": "Озеро",
  "filter.river": "Река",
  "btn.search": "Поиск",
  "header.profile": "Профиль",
  "header.create": "Создать спот",
  "header.favorites": "Избранное",
  "header.settings": "Настройки",
  "header.signout": "Выйти",
  "header.signin": "Войти / Регистрация",
};

const ZH: Dict = {
  "search.placeholder": "搜索城市或地点（例如：卡利亚里）…",
  "filter.all": "所有水域",
  "filter.sea": "海洋",
  "filter.lake": "湖泊",
  "filter.river": "河流",
  "btn.search": "搜索",
  "header.profile": "个人资料",
  "header.create": "创建地点",
  "header.favorites": "收藏",
  "header.settings": "设置",
  "header.signout": "退出",
  "header.signin": "登录 / 注册",
};

const HI: Dict = {
  "search.placeholder": "शहर या स्थान खोजें (जैसे काग्लियारी)…",
  "filter.all": "सभी जल",
  "filter.sea": "समुद्र",
  "filter.lake": "झील",
  "filter.river": "नदी",
  "btn.search": "खोजें",
  "header.profile": "प्रोफ़ाइल",
  "header.create": "स्पॉट बनाएँ",
  "header.favorites": "पसंदीदा",
  "header.settings": "सेटिंग्स",
  "header.signout": "साइन आउट",
  "header.signin": "साइन इन / पंजीकरण",
};

const JA: Dict = {
  "search.placeholder": "都市または場所を検索（例：カリャリ）…",
  "filter.all": "すべての水域",
  "filter.sea": "海",
  "filter.lake": "湖",
  "filter.river": "川",
  "btn.search": "検索",
  "header.profile": "プロフィール",
  "header.create": "スポット作成",
  "header.favorites": "お気に入り",
  "header.settings": "設定",
  "header.signout": "ログアウト",
  "header.signin": "ログイン / 登録",
};

const DICTS: AllDicts = {
  it: IT,
  en: EN,
  "en-GB": EN,
  "en-CA": EN,
  "en-NZ": EN,
  fr: FR,
  de: DE,
  "de-AT": DE,
  "de-CH": DE,
  es: ES,
  ru: RU,
  zh: ZH,
  hi: HI,
  ja: JA,
  // le altre useranno il fallback EN
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("it");

  useEffect(() => {
    const stored = (localStorage.getItem("dp.lang") as Lang) || null;
    if (stored) { setLang(stored); return; }
    const nav = (navigator.language || "it").toLowerCase();
    if (nav.startsWith("it")) setLang("it");
    else if (nav.startsWith("en")) setLang("en");
    else if (nav.startsWith("fr")) setLang("fr");
    else if (nav.startsWith("de")) setLang("de");
    else if (nav.startsWith("es")) setLang("es");
    else if (nav.startsWith("ru")) setLang("ru");
    else if (nav.startsWith("zh")) setLang("zh");
    else if (nav.startsWith("hi")) setLang("hi");
    else if (nav.startsWith("ja")) setLang("ja");
  }, []);

  useEffect(() => { localStorage.setItem("dp.lang", lang); }, [lang]);

  const t = (key: string) => (DICTS[lang]?.[key] ?? EN[key] ?? key);
  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useI18n must be used within LangProvider");
  return ctx;
}
