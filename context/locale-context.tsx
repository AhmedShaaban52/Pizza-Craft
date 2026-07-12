"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type Locale = "en" | "ar";

const LOCALE_COOKIE = "locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => { },
  dir: "ltr",
  isPending: false,
});

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )locale=(ar|en)/);
  return (match?.[1] as Locale) ?? "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locale, setLocaleState] = useState<Locale>(() => {
    return readCookieLocale();
  });

  function setLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    startTransition(() => {
      setLocaleState(next);
      router.refresh();
    });
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir, isPending }}>
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