import { ReactNode } from 'react';

type Language = 'en' | 'zh';

let currentLanguage: Language = 'en';

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useLanguage() {
  const setLanguage = (lang: Language) => {
    currentLanguage = lang;
  };

  const t = (en: string, zh: string) => {
    return currentLanguage === 'en' ? en : zh;
  };

  return { language: currentLanguage, setLanguage, t };
}
