"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface LanguageContextType {
  t: (key: string) => string;
  switchLanguage: () => void;
  language: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage: string;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage,
}) => {
  const { t, i18n } = useTranslation("common");
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    const langToUse = storedLanguage || initialLanguage;

    i18n.changeLanguage(langToUse).then(() => {
      setLanguage(langToUse);
      setIsLanguageReady(true);
    });
  }, [i18n, initialLanguage]);

  const switchLanguage = () => {
    const newLanguage = language === "en" ? "fr" : "en";
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  if (!isLanguageReady) return null;

  return (
    <LanguageContext.Provider value={{ t, switchLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageProvider;
