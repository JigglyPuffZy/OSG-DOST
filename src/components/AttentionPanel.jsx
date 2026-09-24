import { AlertTriangle, Calendar, ChevronRight } from "lucide-react"
import { useLanguage } from "../i18n/LanguageContext"

const toneStyles = {
  warning: "attention-item-warning",
  info: "attention-item-info",
  urgent: "attention-item-urgent",
}

export default function AttentionPanel({ items, onView }) {
  const { t } = useLanguage()

  if (items.length === 0) return null

  return (
    <section className="attention-panel surface-card">
      <div className="attention-panel-header">
        <div>
          <h2 className="text-sm font-bold text-slate-900">{t("attention.title")}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{t("attention.subtitle")}</p>
        </div>
        <span className="attention-count">{items.length}</span>
      </div>
      <ul className="attention-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onView(item.caseItem)}
              className={`attention-item ${toneStyles[item.tone] || toneStyles.info}`}
            >
              <span className="attention-item-icon">
                {item.tone === "urgent" || item.tone === "warning" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {item.caseItem.caseTitle}
                </span>
                <span className="block text-xs text-slate-600">{item.reason}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
