import {
  Archive,
  Calendar,
  ChevronRight,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import StatusBadge from "./StatusBadge"
import Button from "./ui/Button"
import {
  formatDateShort,
  getStatusUpdates,
  hasCaseNumber,
} from "../utils/caseHelpers"

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
}) {
  return (
    <div className="grid gap-3 md:hidden">
      {cases.map((item, index) => {
        const updates = getStatusUpdates(item)
        const latestRemark = updates[0] || item.remarks || ""
        const rowNumber = index + 1
        const isArchived = item.status === "Archived"

        return (
          <article
            key={item.id}
            className={`case-card ${isArchived ? "case-card-archived" : ""}`}
          >
            <button type="button" onClick={() => onView(item)} className="case-card-main">
              <div className="flex items-start gap-3">
                <span className="case-card-num">{rowNumber}</span>
                <div
                  className={`mt-1 h-8 w-1 shrink-0 rounded-full ${stripe[item.status] || stripe.Archived}`}
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
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {hasCaseNumber(item) ? (
                      <span className="case-chip font-semibold text-slate-800">
                        {item.caseNumber}
                      </span>
                    ) : (
                      <span className="case-chip case-chip-warn">
                        <TriangleAlert className="h-3 w-3" />
                        No docket
                      </span>
                    )}
                  </div>
                  {latestRemark ? (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{latestRemark}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-slate-400">
                    <Calendar className="mr-1 inline h-3 w-3" />
                    {formatDateShort(item.lastUpdated)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </div>
            </button>
            {onEdit ? (
              <div className="case-card-actions" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="primary" className="flex-1" onClick={() => onView(item)}>
                  Open
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
