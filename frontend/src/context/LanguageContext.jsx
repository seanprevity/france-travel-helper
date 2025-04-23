import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

const langs = { en, fr };
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 1. Try to load previously chosen language
  // 2. Fallback to browser’s setting
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'fr') return stored;
    const nav = navigator.language || navigator.userLanguage || 'en';
    return nav.startsWith('fr') ? 'fr' : 'en';
  });

  // Store selection so that if they toggle later, we remember
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
