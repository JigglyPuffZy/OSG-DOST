import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { LANGUAGE_KEY, translate } from "./translations"

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(LANGUAGE_KEY) || "en"
    } catch {
      return "en"
    }
  })

  const setLanguage = useCallback((next) => {
    const value = next === "tl" ? "tl" : "en"
    setLanguageState(value)
    try {
      localStorage.setItem(LANGUAGE_KEY, value)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === "tl" ? "tl" : "en"
  }, [language])

  const t = useCallback((key, vars) => translate(language, key, vars), [language])

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
