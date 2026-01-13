import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'no' | 'en';

// =============================================================================
// Translations
// =============================================================================

const translations = {
  // Auth screen
  authTitle: {
    no: 'Kulturarv Chat',
    en: 'Cultural Heritage Chat',
  },
  authSubtitle: {
    no: 'Utforsk norsk kulturarv med AI',
    en: 'Explore Norwegian cultural heritage with AI',
  },
  accessToken: {
    no: 'Tilgangstoken',
    en: 'Access Token',
  },
  enterToken: {
    no: 'Skriv inn din tilgangstoken',
    en: 'Enter your access token',
  },
  tokenHint: {
    no: 'Kontakt administrator for å få tilgangstoken',
    en: 'Contact the administrator to get an access token',
  },
  startExploring: {
    no: 'Start utforsking',
    en: 'Start Exploring',
  },
  poweredBy: {
    no: 'Drevet av Riksantikvaren, Wikipedia og Store norske leksikon',
    en: 'Powered by Riksantikvaren, Wikipedia & Store norske leksikon',
  },

  // Header
  connected: {
    no: 'Tilkoblet',
    en: 'Connected',
  },
  logOut: {
    no: 'Logg ut',
    en: 'Log out',
  },

  // Welcome screen
  welcomeTitle: {
    no: 'Velkommen til Kulturarv Chat',
    en: 'Welcome to Cultural Heritage Chat',
  },
  welcomeDescription: {
    no: 'Still spørsmål om norsk kulturarv, historiske steder, kulturminner og mer.',
    en: 'Ask questions about Norwegian cultural heritage, historical places, cultural monuments and more.',
  },

  // Input
  selectSource: {
    no: 'Velg minst én kilde...',
    en: 'Select at least one source...',
  },
  askPlaceholder: {
    no: 'Spør om norsk kulturarv...',
    en: 'Ask about Norwegian cultural heritage...',
  },
  inputHint: {
    no: 'Trykk Enter for å sende, Shift+Enter for ny linje',
    en: 'Press Enter to send, Shift+Enter for new line',
  },

  // Sources
  sources: {
    no: 'Kilder',
    en: 'Sources',
  },
  wikipedia: {
    no: 'Wikipedia',
    en: 'Wikipedia',
  },
  snl: {
    no: 'SNL',
    en: 'SNL',
  },
  riksantikvaren: {
    no: 'Riksantikvaren',
    en: 'Riksantikvaren',
  },

  // Message actions
  editMessage: {
    no: 'Rediger melding',
    en: 'Edit message',
  },
  regenerate: {
    no: 'Regenerer',
    en: 'Regenerate',
  },
  regenerateWith: {
    no: 'Regenerer med',
    en: 'Regenerate with',
  },
  regenerateWithSources: {
    no: 'Regenerer med kilder:',
    en: 'Regenerate with sources:',
  },
  cancel: {
    no: 'Avbryt',
    en: 'Cancel',
  },
  send: {
    no: 'Send',
    en: 'Send',
  },
  stopGeneration: {
    no: 'Stopp generering',
    en: 'Stop generation',
  },

  // Related
  relatedQuestions: {
    no: 'Relaterte spørsmål',
    en: 'Related questions',
  },

  // Status messages
  analyzingQuestion: {
    no: 'Analyserer spørsmål...',
    en: 'Analyzing question...',
  },
  exploringSources: {
    no: 'Utforsker kilder...',
    en: 'Exploring sources...',
  },
  generatingResponse: {
    no: 'Genererer svar...',
    en: 'Generating response...',
  },
  generationStopped: {
    no: '(Generering stoppet)',
    en: '(Generation stopped)',
  },

  // Errors
  invalidToken: {
    no: 'Ugyldig token. Vennligst logg inn på nytt.',
    en: 'Invalid token. Please re-authenticate.',
  },
  unexpectedError: {
    no: 'En uventet feil oppstod. Vennligst prøv igjen.',
    en: 'An unexpected error occurred. Please try again.',
  },

} as const;

type TranslationKey = keyof typeof translations;

// =============================================================================
// Language Context
// =============================================================================

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kulturarv_language');
    return (saved === 'en' || saved === 'no') ? saved : 'no';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kulturarv_language', lang);
  }, []);

  const t = useCallback((key: TranslationKey, replacements?: Record<string, string | number>): string => {
    let text: string = translations[key]?.[language] || translations[key]?.['en'] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
