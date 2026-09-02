import { FileSearch, Plus } from "lucide-react"
import Button from "./ui/Button"
import { useLanguage } from "../i18n/LanguageContext"

export default function EmptyState({ onClear, onAdd, variant = "filtered" }) {
  const { t } = useLanguage()
  const isEmpty = variant === "empty"
  const isArchived = variant === "archived"

  const heading = isEmpty
    ? t("empty.none")
    : isArchived
      ? t("empty.archived")
      : t("empty.filtered")

  const description = isEmpty
    ? t("empty.noneDesc")
    : isArchived
      ? t("empty.archivedDesc")
      : t("empty.filteredDesc")

  return (
    <div className="surface-card px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dost-50 to-white text-dost-600 shadow-sm ring-1 ring-dost-100">
        <FileSearch className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h3 className="mt-6 text-lg font-bold text-slate-900">{heading}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {isEmpty && onAdd ? (
          <Button variant="primary" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {t("empty.addFirst")}
          </Button>
        ) : !isArchived ? (
          <Button size="sm" onClick={onClear}>
            {t("empty.clearFilters")}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
