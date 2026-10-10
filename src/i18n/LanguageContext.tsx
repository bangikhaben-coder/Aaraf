import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TranslationKey,
  TranslationDictionary,
  LanguageMeta,
  DEFAULT_LANGUAGES,
  BUILTIN_TRANSLATIONS,
} from './translations';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  availableLanguages: LanguageMeta[];
  t: (key: TranslationKey, fallback?: string) => string;
  updateTranslation: (langCode: string, key: TranslationKey, value: string) => void;
  addCustomLanguage: (code: string, name: string, nativeName: string, baseLang?: string) => void;
  deleteCustomLanguage: (code: string) => void;
  resetLanguageOverrides: (langCode: string) => void;
  customOverrides: Record<string, Partial<TranslationDictionary>>;
  exportTranslations: () => string;
  importTranslations: (jsonString: string) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load current language
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem('chronos_lang');
    return saved || 'en';
  });

  // Load custom language meta list
  const [customLanguages, setCustomLanguages] = useState<LanguageMeta[]>(() => {
    const saved = localStorage.getItem('chronos_custom_languages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Load custom translation overrides
  const [customOverrides, setCustomOverrides] = useState<Record<string, Partial<TranslationDictionary>>>(() => {
    const saved = localStorage.getItem('chronos_custom_translations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  // Save current language
  const setLanguage = (code: string) => {
    setCurrentLanguageState(code);
    localStorage.setItem('chronos_lang', code);
  };

  // Save custom languages
  useEffect(() => {
    localStorage.setItem('chronos_custom_languages', JSON.stringify(customLanguages));
  }, [customLanguages]);

  // Save custom overrides
  useEffect(() => {
    localStorage.setItem('chronos_custom_translations', JSON.stringify(customOverrides));
  }, [customOverrides]);

  const availableLanguages: LanguageMeta[] = [...DEFAULT_LANGUAGES, ...customLanguages];

  // Translation function
  const t = (key: TranslationKey, fallback?: string): string => {
    // 1. Check custom overrides for the active language
    const langOverrides = customOverrides[currentLanguage];
    if (langOverrides && langOverrides[key] !== undefined && langOverrides[key] !== '') {
      return langOverrides[key]!;
    }

    // 2. Check built-in translations for the active language
    const builtin = BUILTIN_TRANSLATIONS[currentLanguage];
    if (builtin && builtin[key] !== undefined) {
      return builtin[key];
    }

    // 3. Fallback to English built-in
    const english = BUILTIN_TRANSLATIONS['en'];
    if (english && english[key] !== undefined) {
      return english[key];
    }

    // 4. Return explicit fallback or key
    return fallback || key;
  };

  // Update a single key override
  const updateTranslation = (langCode: string, key: TranslationKey, value: string) => {
    setCustomOverrides(prev => ({
      ...prev,
      [langCode]: {
        ...(prev[langCode] || {}),
        [key]: value,
      },
    }));
  };

  // Add a brand new custom language
  const addCustomLanguage = (code: string, name: string, nativeName: string, baseLang: string = 'en') => {
    const cleanCode = code.trim().toLowerCase();
    if (!cleanCode || availableLanguages.some(l => l.code === cleanCode)) {
      return;
    }

    const newMeta: LanguageMeta = {
      code: cleanCode,
      name: name.trim() || cleanCode,
      nativeName: nativeName.trim() || name.trim() || cleanCode,
      isCustom: true,
    };

    // Copy base translations as starting custom overrides
    const baseDict = BUILTIN_TRANSLATIONS[baseLang] || BUILTIN_TRANSLATIONS['en'];
    setCustomOverrides(prev => ({
      ...prev,
      [cleanCode]: { ...(baseDict || {}) },
    }));

    setCustomLanguages(prev => [...prev, newMeta]);
    setLanguage(cleanCode);
  };

  // Delete a custom language
  const deleteCustomLanguage = (code: string) => {
    setCustomLanguages(prev => prev.filter(l => l.code !== code));
    setCustomOverrides(prev => {
      const next = { ...prev };
      delete next[code];
      return next;
    });

    if (currentLanguage === code) {
      setLanguage('en');
    }
  };

  // Reset custom overrides for a language
  const resetLanguageOverrides = (langCode: string) => {
    setCustomOverrides(prev => {
      const next = { ...prev };
      delete next[langCode];
      return next;
    });
  };

  // Export custom language configuration
  const exportTranslations = (): string => {
    return JSON.stringify(
      {
        customLanguages,
        customOverrides,
      },
      null,
      2
    );
  };

  // Import custom language configuration
  const importTranslations = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.customLanguages && Array.isArray(parsed.customLanguages)) {
        setCustomLanguages(parsed.customLanguages);
      }
      if (parsed.customOverrides && typeof parsed.customOverrides === 'object') {
        setCustomOverrides(parsed.customOverrides);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages,
        t,
        updateTranslation,
        addCustomLanguage,
        deleteCustomLanguage,
        resetLanguageOverrides,
        customOverrides,
        exportTranslations,
        importTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
