import {
  Archive,
  ArchiveRestore,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react"
import StatusBadge from "./StatusBadge"
import Button from "./ui/Button"
import CaseMetaChips from "./CaseMetaChips"
import {
  getCaseCardNote,
  getDisplayCaseNumber,
  getLatestRemarkPreview,
  getRemarkCount,
  normalizeStatus,
} from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"

const stripe = {
  Pending: "bg-amber-400",
  Ongoing: "bg-sky-500",
  Closed: "bg-emerald-500",
  Archived: "bg-slate-400",
}

export default function CaseCardList({
  cases,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  isArchivedPage = false,
}) {
  const { t } = useLanguage()

  return (
    <div className="grid gap-3 md:hidden">
      {cases.map((item, index) => {
        const latestRemark = getLatestRemarkPreview(item, 140)
        const extraRemarks = Math.max(getRemarkCount(item) - 1, 0)
        const cardNote = getCaseCardNote(item, t)
        const rowNumber = getDisplayCaseNumber(item, index + 1)
        const status = normalizeStatus(item.status)
        const isArchived = status === "Archived"

        return (
          <article
            key={item.id}
            className={`case-card ${isArchived ? "case-card-archived" : ""}`}
          >
            <button type="button" onClick={() => onView(item)} className="case-card-main">
              <div className="flex items-start gap-3">
                <span className="case-card-num">{rowNumber}</span>
                <div
                  className={`mt-1 h-8 w-1 shrink-0 rounded-full ${stripe[status] || stripe.Archived}`}
                />
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-bold leading-snug text-slate-900">
                      {item.caseTitle}
                    </h3>
                    <StatusBadge status={item.status} />
                  </div>
                  {item.caseType ? (
                    <p className="mt-1 text-xs text-slate-500">{item.caseType}</p>
                  ) : null}
                  <CaseMetaChips caseItem={item} showSoonBadge={false} compactLabels />
                  {latestRemark ? (
                    <div className="case-card-remark-wrap">
                      <span className="case-card-remark-label">{t("cases.latestUpdate")}</span>
                      <p className="case-card-remark">{latestRemark}</p>
                      {extraRemarks > 0 ? (
                        <span className="case-card-remark-more">
                          + {extraRemarks} {t("cases.moreUpdates")}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <p className="case-card-empty-note">{cardNote}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </div>
            </button>
            {onEdit ? (
              <div className="case-card-actions" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="primary" className="flex-1" onClick={() => onView(item)}>
                  {t("cases.open")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" onClick={() => onEdit(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                {!isArchived && onArchive ? (
                  <Button size="sm" onClick={() => onArchive(item)}>
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
                {isArchivedPage && onUnarchive ? (
                  <Button size="sm" onClick={() => onUnarchive(item)}>
                    <ArchiveRestore className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
                <Button size="sm" variant="danger" onClick={() => onDelete(item)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
