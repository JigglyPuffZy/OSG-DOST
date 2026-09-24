import { Plus, SlidersHorizontal } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"

const pageKeys = {
  dashboard: "page.home",
  cases: "page.cases",
  archived: "page.archived",
  deleted: "page.deleted",
  settings: "page.settings",
}

const descKeys = {
  dashboard: "dashboard.overviewDesc",
  cases: "filters.narrow",
  archived: "empty.archivedDesc",
  deleted: "empty.deletedDesc",
  settings: "settings.autoSaveLocal",
}

export default function AuraPageHead({
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
    <header className="aura-top">
      <div>
        <p className="aura-top-kicker">{t("app.taskForce")}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="aura-top-title">{t(pageKeys[page] || pageKeys.dashboard)}</h1>
          {showCount ? (
            <span className="aura-count">
              {resultCount}
              {" "}
              {t("cases.ofTotal", { total: totalCount })}
            </span>
          ) : null}
        </div>
        <p className="aura-top-meta">{t(descKeys[page] || descKeys.dashboard)}</p>
      </div>
      <div className="aura-top-actions">
        {children}
        {showAdd && onAdd ? (
          <button type="button" onClick={onAdd} className="aura-btn aura-btn-primary hidden sm:inline-flex">
            <Plus className="h-4 w-4" />
            {t("page.addCase")}
          </button>
        ) : null}
      </div>
    </header>
  )
}

export function AuraFilterBtn({ onClick, label, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`aura-btn aura-btn-sm lg:hidden ${active ? "aura-btn-active" : ""}`}
    >
      <SlidersHorizontal className="h-4 w-4" />
      {label}
    </button>
  )
}
