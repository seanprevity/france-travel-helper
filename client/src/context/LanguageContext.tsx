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

  // Load language from localStorage if available
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage && storedLanguage !== language) {
      setLanguage(storedLanguage);
    } else {
      i18n.changeLanguage(language).then(() => {
        setIsLanguageReady(true);
      });
    }
  }, []);

  // Change i18n language when language state updates
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language).then(() => {
        setIsLanguageReady(true);
        localStorage.setItem("language", language);
      });
    }
  }, [language, i18n]);

  const switchLanguage = () => {
    const newLanguage = language === "en" ? "fr" : "en";
    setLanguage(newLanguage);
    // localStorage is updated in the effect
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
