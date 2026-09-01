import { ArrowRight, ChevronRight, TriangleAlert } from "lucide-react"
import StatusBadge from "./StatusBadge"
import {
  formatDateShort,
  getStatusUpdates,
  hasCaseNumber,
} from "../utils/caseHelpers"

const statusStripe = {
  Pending: "bg-amber-400",
  Ongoing: "bg-sky-500",
  Closed: "bg-emerald-500",
  Archived: "bg-slate-400",
}

const paymentStyles = {
  Unpaid: "bg-amber-50 text-amber-800 ring-amber-200/80",
  Partial: "bg-orange-50 text-orange-800 ring-orange-200/80",
  Paid: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
}

function PaymentTag({ status }) {
  if (!status || status === "Not required") return null
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${paymentStyles[status] || "bg-slate-50 text-slate-600 ring-slate-200"}`}
    >
      {status}
    </span>
  )
}

function truncate(text, max = 90) {
  if (!text) return ""
  return text.length > max ? `${text.slice(0, max).trim()}…` : text
}

export default function DashboardRecentTable({ cases, onView, onViewAll }) {
  return (
    <section className="table-pro surface-card hidden overflow-hidden md:block">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Recent cases</h2>
          <p className="mt-0.5 text-xs text-slate-500">Click a row to open the full case file</p>
        </div>
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-dost-600 transition-colors hover:bg-dost-50 hover:text-dost-700"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="w-12 px-3 py-3 text-center text-xs font-semibold text-slate-500">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Case
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Status
              </th>
              <th className="min-w-[220px] px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Recent update
              </th>
              <th className="w-10 px-4 py-3" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {cases.map((item, index) => {
              const updates = getStatusUpdates(item)
              const latestRemark = updates[0] || item.remarks || ""
              const rowNumber = index + 1

              return (
                <tr
                  key={item.id}
                  tabIndex={0}
                  onClick={() => onView(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onView(item)
                    }
                  }}
                  className="group cursor-pointer border-t border-slate-100 transition-colors hover:bg-dost-50/50"
                >
                  <td className="px-3 py-4 text-center align-middle">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold tabular-nums text-slate-600">
                      {rowNumber}
                    </span>
                  </td>
                  <td className="relative px-4 py-4 align-top">
                    <span
                      className={`absolute inset-y-3 left-0 w-0.5 rounded-full ${statusStripe[item.status] || statusStripe.Archived}`}
                      aria-hidden="true"
                    />
                    <p className="pr-2 font-semibold leading-snug text-slate-900">
                      {item.caseTitle}
                    </p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      {item.caseType ? <span>{item.caseType}</span> : null}
                      {item.caseType && (hasCaseNumber(item) || !hasCaseNumber(item)) ? (
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                      ) : null}
                      {hasCaseNumber(item) ? (
                        <span className="font-medium text-slate-700">{item.caseNumber}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                          <TriangleAlert className="h-3 w-3" />
                          No docket no.
                        </span>
                      )}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={item.status} />
                      <PaymentTag status={item.paymentStatus} />
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">
                    {latestRemark ? (
                      <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
                        {truncate(latestRemark)}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400">No updates yet</p>
                    )}
                    <p className="mt-1.5 text-xs text-slate-400">
                      {formatDateShort(item.lastUpdated)}
                      {updates.length > 1
                        ? ` · ${updates.length} updates`
                        : ""}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <ChevronRight
                      className="h-4 w-4 text-slate-300 transition-colors group-hover:text-dost-500"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
