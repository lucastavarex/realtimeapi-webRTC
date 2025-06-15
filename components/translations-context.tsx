"use client"

import { es } from '@/lib/translations/es'
import { fr } from '@/lib/translations/fr'
import { pt } from '@/lib/translations/pt'
import { zh } from '@/lib/translations/zh'
import { createContext, ReactNode, useContext, useState } from 'react'

type TranslationValue = string | { [key: string]: TranslationValue }

type Translations = {
  [key: string]: TranslationValue
}

const translations: { [key: string]: Translations } = {
  pt,
  es,
  fr,
  zh
}

type TranslationsContextType = {
  t: (key: string) => string
  locale: string
  setLocale: (locale: string) => void
}

const TranslationsContext = createContext<TranslationsContextType | null>(null)

export function TranslationsProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('pt')

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: TranslationValue = translations[locale]
    
    for (const k of keys) {
      if (value === undefined) return key
      value = typeof value === 'object' ? value[k] : key
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <TranslationsContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationsContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(TranslationsContext)
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider')
  }
  return context
} 