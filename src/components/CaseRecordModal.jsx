import { Archive, Pencil, Trash2, X } from "lucide-react"
import StatusBadge from "./StatusBadge"
import Button from "./ui/Button"
import {
  displayCaseNumber,
  formatDate,
  formatMoney,
  getStatusUpdates,
  hasCaseNumber,
  paymentBalance,
} from "../utils/caseHelpers"

export default function CaseRecordModal({
  caseItem,
  onClose,
  onEdit,
  onDelete,
  onArchive,
}) {
  const activity = caseItem.activity?.length
    ? caseItem.activity
    : [{ date: caseItem.lastUpdated, label: "Case created" }]
  const unpaid = caseItem.paymentStatus === "Unpaid"
  const partial = caseItem.paymentStatus === "Partial"
  const storyParagraphs = (caseItem.story || "")
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean)
  const updates = getStatusUpdates(caseItem)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/50 p-3 backdrop-blur-sm sm:p-6">
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-title"
        className="modal-enter flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-navy-100 bg-navy-50/50 px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="section-kicker">Case file</p>
              <h1
                id="record-title"
                className="mt-2 text-2xl font-semibold leading-tight text-navy-900 sm:text-3xl"
              >
                {caseItem.caseTitle}
              </h1>
              <p className="mt-2 text-sm text-navy-500">
                {caseItem.caseType || "Case"} ·{" "}
                {hasCaseNumber(caseItem)
                  ? displayCaseNumber(caseItem)
                  : "No case number yet"}
              </p>
              <div className="mt-3">
                <StatusBadge status={caseItem.status} />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {(unpaid || partial) && (
            <aside className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950">
              {unpaid ? (
                <>
                  <p className="font-semibold">Hindi pa nakabayad</p>
                  <p className="mt-1 leading-relaxed">
                    Outstanding balance: {formatMoney(paymentBalance(caseItem))}.
                    Follow until payment is made or the court orders otherwise.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Partial payment only</p>
                  <p className="mt-1 leading-relaxed">
                    Paid {formatMoney(caseItem.amountPaid)} of{" "}
                    {formatMoney(caseItem.amountDue)}. Remaining:{" "}
                    {formatMoney(paymentBalance(caseItem))}.
                  </p>
                </>
              )}
            </aside>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="surface-muted px-4 py-3">
              <p className="section-kicker">Case number</p>
              <p className="mt-1 text-sm font-medium text-navy-900">
                {hasCaseNumber(caseItem) ? (
                  displayCaseNumber(caseItem)
                ) : (
                  <span className="text-amber-800">Not Assigned</span>
                )}
              </p>
            </div>
            <div className="surface-muted px-4 py-3">
              <p className="section-kicker">Last updated</p>
              <p className="mt-1 text-sm font-medium text-navy-900">
                {formatDate(caseItem.lastUpdated)}
              </p>
            </div>
            <div className="surface-muted px-4 py-3">
              <p className="section-kicker">Hearing</p>
              <p className="mt-1 text-sm font-medium text-navy-900">
                {caseItem.hearingDate
                  ? formatDate(caseItem.hearingDate)
                  : "Not scheduled"}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {storyParagraphs.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-navy-900">Summary</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-7 text-navy-700">
                  {storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-base font-semibold text-navy-900">Parties</h2>
              <p className="mt-2 text-[15px] leading-7 text-navy-700">
                {caseItem.parties || "Parties are not yet recorded."}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-navy-900">Payment</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-navy-100 px-3 py-2.5">
                  <p className="text-xs text-navy-500">Status</p>
                  <p className="mt-0.5 text-sm font-medium text-navy-900">
                    {caseItem.paymentStatus || "Not required"}
                  </p>
                </div>
                <div className="rounded-lg border border-navy-100 px-3 py-2.5">
                  <p className="text-xs text-navy-500">Due</p>
                  <p className="mt-0.5 text-sm font-medium text-navy-900">
                    {formatMoney(caseItem.amountDue)}
                  </p>
                </div>
                <div className="rounded-lg border border-navy-100 px-3 py-2.5">
                  <p className="text-xs text-navy-500">Paid</p>
                  <p className="mt-0.5 text-sm font-medium text-navy-900">
                    {formatMoney(caseItem.amountPaid)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-navy-900">
                Status / Remarks
              </h2>
              {updates.length > 0 ? (
                <ul className="mt-3 space-y-2.5">
                  {updates.map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-navy-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[15px] text-navy-600">
                  {caseItem.remarks || "No remarks have been entered yet."}
                </p>
              )}
            </section>

            <section>
              <h2 className="text-base font-semibold text-navy-900">
                Activity timeline
              </h2>
              <ol className="mt-4 space-y-0">
                {activity.map((event, index) => (
                  <li
                    key={`${event.date}-${event.label}-${index}`}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {index < activity.length - 1 && (
                      <span
                        className="absolute left-[5px] top-3 h-full w-px bg-navy-200"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-navy-400 ring-4 ring-white"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-navy-900">
                        {event.label}
                      </p>
                      <p className="mt-0.5 text-xs text-navy-500">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 bg-navy-50/30 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {caseItem.status !== "Archived" && onArchive ? (
              <Button
                size="sm"
                onClick={() => onArchive(caseItem)}
              >
                <Archive className="h-4 w-4" />
                Archive
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(caseItem)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose}>Close</Button>
            <Button
              variant="primary"
              onClick={() => {
                onEdit(caseItem)
                onClose()
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit case
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
