import { useLanguage } from "../../i18n/LanguageContext"

export default function LanguageToggle({ className = "", compact = false }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className={`lang-toggle ${compact ? "lang-toggle-compact" : ""} ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`lang-toggle-btn ${language === "en" ? "lang-toggle-btn-active" : ""}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("tl")}
        className={`lang-toggle-btn ${language === "tl" ? "lang-toggle-btn-active" : ""}`}
      >
        TL
      </button>
    </div>
  )
}
