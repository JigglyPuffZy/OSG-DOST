import { Archive, Download, X } from "lucide-react"
import Button from "./ui/Button"
import { useLanguage } from "../i18n/LanguageContext"

export default function BulkActionBar({
  count,
  onClear,
  onArchive,
  onExport,
  showArchive = true,
}) {
  const { t } = useLanguage()

  if (count === 0) return null

  return (
    <div className="bulk-action-bar">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-800">
          {t("bulk.selected", { count })}
        </span>
        <button type="button" onClick={onClear} className="bulk-clear-btn">
          <X className="h-3.5 w-3.5" />
          {t("bulk.clear")}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={onExport}>
          <Download className="h-4 w-4" />
          {t("bulk.export")}
        </Button>
        {showArchive && onArchive ? (
          <Button size="sm" onClick={onArchive}>
            <Archive className="h-4 w-4" />
            {t("bulk.archive")}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
