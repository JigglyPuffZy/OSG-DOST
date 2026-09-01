import {
  Archive,
  Calendar,
  ChevronRight,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import StatusBadge from "./StatusBadge"
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

function truncate(text, max = 120) {
  if (!text) return ""
  return text.length > max ? `${text.slice(0, max).trim()}…` : text
}

export default function CaseTable({
  cases,
  onView,
  onEdit,
  onDelete,
  onArchive,
  compact = false,
}) {
  return (
    <section className="hidden md:block">
      <div className="mb-3 px-1">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">{cases.length}</span> case
          {cases.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ul className="space-y-3">
        {cases.map((item, index) => {
          const updates = getStatusUpdates(item)
          const latestRemark = updates[0] || item.remarks || ""
          const rowNumber = index + 1
          const isArchived = item.status === "Archived"

          return (
            <li key={item.id}>
              <article
                className={`case-card group ${isArchived ? "case-card-archived" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onView(item)}
                  className="case-card-main"
                >
                  <div className="flex items-start gap-4">
                    <span className="case-card-num">{rowNumber}</span>

                    <div
                      className={`mt-1 h-10 w-1 shrink-0 rounded-full ${stripe[item.status] || stripe.Archived}`}
                      aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-left text-base font-bold leading-snug text-slate-900 group-hover:text-dost-700">
                            {item.caseTitle}
                          </h3>
                          {item.caseType ? (
                            <p className="mt-1 text-left text-xs font-medium text-slate-500">
                              {item.caseType}
                            </p>
                          ) : null}
                        </div>
                        <StatusBadge status={item.status} />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        {hasCaseNumber(item) ? (
                          <span className="case-chip font-semibold text-slate-800">
                            {item.caseNumber}
                          </span>
                        ) : (
                          <span className="case-chip case-chip-warn">
                            <TriangleAlert className="h-3 w-3" />
                            No docket no.
                          </span>
                        )}
                        <span className="case-chip">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {formatDateShort(item.lastUpdated)}
                        </span>
                      </div>

                      {latestRemark ? (
                        <p className="mt-3 text-left text-sm leading-relaxed text-slate-600 line-clamp-2">
                          {truncate(latestRemark, compact ? 80 : 140)}
                          {updates.length > 1 ? (
                            <span className="text-slate-400">
                              {" "}
                              · +{updates.length - 1} more
                            </span>
                          ) : null}
                        </p>
                      ) : (
                        <p className="mt-3 text-left text-sm text-slate-400">
                          No updates yet
                        </p>
                      )}
                    </div>

                    <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-dost-500" />
                  </div>
                </button>

                <div
                  className="case-card-actions"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onView(item)}
                    className="case-action-btn case-action-btn-primary"
                  >
                    Open file
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="case-action-btn"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  {!isArchived && onArchive ? (
                    <button
                      type="button"
                      onClick={() => onArchive(item)}
                      className="case-action-btn"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="case-action-btn case-action-btn-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
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
