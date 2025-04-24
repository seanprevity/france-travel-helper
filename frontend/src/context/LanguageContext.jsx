import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

const langs = { en, fr };
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'fr') return stored;
    const nav = navigator.language || navigator.userLanguage || 'en';
    return nav.startsWith('fr') ? 'fr' : 'en';
  });

  // Store selection
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const messages = useMemo(() => langs[lang], [lang]);
  const t = (key) => messages[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
