import {
  Archive,
  ArchiveRestore,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react"
import StatusBadge from "./StatusBadge"
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

export default function CaseTable({
  cases,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  compact = false,
  selectable = false,
  selectedIds = new Set(),
  onToggleSelect,
  isArchivedPage = false,
}) {
  const { t } = useLanguage()

  return (
    <section className="hidden md:block">
      <div className="mb-3 px-1">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">{cases.length}</span>{" "}
          {cases.length === 1 ? t("cases.count") : t("cases.countPlural")}
        </p>
      </div>

      <ul className="space-y-3">
        {cases.map((item, index) => {
          const latestRemark = getLatestRemarkPreview(item, compact ? 80 : 140)
          const extraRemarks = Math.max(getRemarkCount(item) - 1, 0)
          const cardNote = getCaseCardNote(item, t)
          const rowNumber = getDisplayCaseNumber(item, index + 1)
          const status = normalizeStatus(item.status)
          const isArchived = status === "Archived"
          const isSelected = selectedIds.has(item.id)

          return (
            <li key={item.id}>
              <article
                className={`case-card group ${isArchived ? "case-card-archived" : ""} ${isSelected ? "case-card-selected" : ""}`}
              >
                <div className="case-card-main case-card-main-row">
                  <div className="case-card-leading">
                    {selectable ? (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect?.(item.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="case-card-checkbox"
                        aria-label={`Select ${item.caseTitle}`}
                      />
                    ) : null}
                    <span className="case-card-num">{rowNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onView(item)}
                    className="case-card-body-btn"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 h-10 w-1 shrink-0 rounded-full ${stripe[status] || stripe.Archived}`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-left text-base font-bold leading-snug text-slate-900 group-hover:text-dost-700">
                              {item.caseTitle}
                            </h3>
                            {item.caseType ? (
                              <p className="mt-1 text-left text-xs font-medium text-slate-500">{item.caseType}</p>
                            ) : null}
                            {item.assignedTo ? (
                              <p className="mt-1 text-left text-xs text-slate-500">{item.assignedTo}</p>
                            ) : null}
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                        <CaseMetaChips caseItem={item} />
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
                      <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-dost-500" />
                    </div>
                  </button>
                </div>

                <div className="case-card-actions" onClick={(event) => event.stopPropagation()}>
                  <button type="button" onClick={() => onView(item)} className="case-action-btn case-action-btn-primary">
                    {t("cases.openFile")}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => onEdit(item)} className="case-action-btn">
                    <Pencil className="h-3.5 w-3.5" />
                    {t("cases.edit")}
                  </button>
                  {isArchivedPage && onUnarchive ? (
                    <button type="button" onClick={() => onUnarchive(item)} className="case-action-btn">
                      <ArchiveRestore className="h-3.5 w-3.5" />
                      {t("cases.unarchive")}
                    </button>
                  ) : null}
                  {!isArchived && onArchive ? (
                    <button type="button" onClick={() => onArchive(item)} className="case-action-btn">
                      <Archive className="h-3.5 w-3.5" />
                      {t("cases.archive")}
                    </button>
                  ) : null}
                  <button type="button" onClick={() => onDelete(item)} className="case-action-btn case-action-btn-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("cases.delete")}
                  </button>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
