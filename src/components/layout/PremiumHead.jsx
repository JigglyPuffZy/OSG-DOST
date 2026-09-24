import { Plus, SlidersHorizontal } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"

const pageKeys = {
  dashboard: "page.home",
  cases: "page.cases",
  archived: "page.archived",
  deleted: "page.deleted",
  settings: "page.settings",
}

const eyebrowKeys = {
  dashboard: "dashboard.liveOverview",
  cases: "filters.narrow",
  archived: "filters.archivedTitle",
  deleted: "page.deleted",
  settings: "page.settings",
}

const descKeys = {
  dashboard: "dashboard.tapToFilter",
  cases: "filters.narrow",
  archived: "empty.archivedDesc",
  deleted: "empty.deletedDesc",
  settings: "settings.autoSaveLocal",
}

export default function PremiumHead({
  page,
  children,
  onAdd,
  showAdd = false,
  resultCount,
  totalCount,
}) {
  const { t } = useLanguage()
  const showCount = typeof resultCount === "number" && typeof totalCount === "number"

  return (
    <header className="premium-hero">
      <div className="min-w-0 flex-1">
        <p className="premium-hero-eyebrow">{t(eyebrowKeys[page] || eyebrowKeys.dashboard)}</p>
        <div className="premium-hero-title-row">
          <h1 className="premium-hero-title">{t(pageKeys[page] || pageKeys.dashboard)}</h1>
          {showCount ? (
            <span className="premium-count-pill">
              <span className="premium-count-pill-value">{resultCount}</span>
              <span className="premium-count-pill-label">
                {t("cases.ofTotal", { total: totalCount })}
              </span>
            </span>
          ) : null}
        </div>
        <p className="premium-hero-desc">{t(descKeys[page] || descKeys.dashboard)}</p>
      </div>
      <div className="premium-hero-actions">
        {children}
        {showAdd && onAdd ? (
          <button type="button" onClick={onAdd} className="premium-btn premium-btn-primary hidden sm:inline-flex">
            <Plus className="h-4 w-4" />
            {t("page.addCase")}
          </button>
        ) : null}
      </div>
    </header>
  )
}

export function PremiumFilterBtn({ onClick, label, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`premium-btn premium-btn-sm lg:hidden ${active ? "premium-btn-active" : ""}`}
    >
      <SlidersHorizontal className="h-4 w-4" />
      {label}
    </button>
  )
}
