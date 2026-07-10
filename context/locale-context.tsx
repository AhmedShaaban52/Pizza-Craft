"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "ar";

const LOCALE_COOKIE = "locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => { },
  dir: "ltr",
});

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )locale=(ar|en)/);
  return (match?.[1] as Locale) ?? "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return readCookieLocale();
  });

  function setLocale(next: Locale) {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function pickLocale(
  en: string | null | undefined,
  ar: string | null | undefined,
  locale: Locale,
): string {
  if (locale === "ar" && ar && ar.trim()) return ar;
  return en ?? "";
}