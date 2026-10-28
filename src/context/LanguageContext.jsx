import { createContext, useState } from "react";
import { translations, LANGUAGES } from "../i18n/translations";

export const LanguageContext = createContext();

const STORAGE_KEY = "app_language";

const readSaved = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && translations[saved] ? saved : null;
  } catch {
    return null;
  }
};

export const LanguageProvider = ({ children }) => {
  const [saved, setSaved] = useState(readSaved);
  const language = saved || "en";

  const setLanguage = (code) => {
    setSaved(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore storage errors
    }
  };

  // t("key", { name: value }) -> translated text
  const t = (key, vars = {}) => {
    const text = translations[language][key] ?? translations.en[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  };

  // tc("Food") -> category name in the chosen language
  const tc = (category) => translations[language][`cat.${category}`] ?? category;

  const voiceCode = LANGUAGES.find((l) => l.code === language).voice;

  return (
    <LanguageContext.Provider
      value={{ language, hasChosen: saved !== null, setLanguage, t, tc, voiceCode }}
    >
      {children}
    </LanguageContext.Provider>
  );
};