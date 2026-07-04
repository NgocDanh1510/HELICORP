"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";
import { useAuthStore } from "../../lib/store/authStore";

const AuthModal = dynamic(() => import("../auth/AuthModal").then((module) => module.AuthModal), {
  ssr: false
});

type AppProvidersProps = {
  children: React.ReactNode;
};

type Locale = "vi" | "en";

type LanguageContextValue = {
  locale: Locale;
  label: "VI" | "EN";
  toggleLocale: () => void;
};

const messages = {
  vi: viMessages,
  en: enMessages
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside AppProviders");
  }

  return context;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [locale, setLocale] = useState<Locale>("vi");
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const savedLocale = localStorage.getItem("helicorp_locale");

    if (savedLocale === "en" || savedLocale === "vi") {
      setLocale(savedLocale);
      document.documentElement.lang = savedLocale;
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      label: locale === "vi" ? "VI" : "EN",
      toggleLocale: () => {
        setLocale((currentLocale) => {
          const nextLocale = currentLocale === "vi" ? "en" : "vi";
          localStorage.setItem("helicorp_locale", nextLocale);
          document.documentElement.lang = nextLocale;

          return nextLocale;
        });
      }
    }),
    [locale]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageContext.Provider value={value}>
        <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Asia/Ho_Chi_Minh">
          {children}
          <AuthModal />
        </NextIntlClientProvider>
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}
