import { ChevronRight, Hash, TriangleAlert } from "lucide-react"
import StatusBadge from "./StatusBadge"
import { formatDateShort, hasCaseNumber } from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"

function accentClass(status) {
  const key = status?.toLowerCase() || "archived"
  return `aura-film-card-accent-${key}`
}

export default function CaseFilmstrip({ cases, onView }) {
  const { t } = useLanguage()

  return (
    <div className="aura-filmstrip">
      {cases.map((item) => (
        <article key={item.id} className="aura-film-card">
          <div className={`aura-film-card-accent ${accentClass(item.status)}`} />
          <button type="button" onClick={() => onView(item)} className="aura-film-card-main">
            <div className="aura-film-card-top">
              <span className="aura-film-card-date">{formatDateShort(item.lastUpdated)}</span>
              <StatusBadge status={item.status} />
            </div>
            <h3>{item.caseTitle}</h3>
            {item.caseType ? <p className="aura-film-card-type">{item.caseType}</p> : null}
            <div className="aura-film-card-foot">
              {hasCaseNumber(item) ? (
                <span className="inline-flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {item.caseNumber}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-600">
                  <TriangleAlert className="h-3 w-3" />
                  {t("cases.noDocketShort")}
                </span>
              )}
              <span className="inline-flex items-center gap-0.5">
                {t("cases.open")}
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        </article>
      ))}
    </div>
  )
}
