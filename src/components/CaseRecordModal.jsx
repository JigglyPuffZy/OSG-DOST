import { Archive, ArchiveRestore, Pencil, Printer, Trash2, X } from "lucide-react"
import StatusBadge from "./StatusBadge"
import Button from "./ui/Button"
import CaseDocuments from "./CaseDocuments"
import { useLanguage } from "../i18n/LanguageContext"
import { exportCasePdf } from "../utils/printCase"
import {
  displayCaseNumber,
  formatDate,
  formatMoney,
  getStatusUpdates,
  hasCaseNumber,
  normalizeStatus,
  paymentBalance,
} from "../utils/caseHelpers"

export default function CaseRecordModal({
  caseItem,
  onClose,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onUpdateFiles,
}) {
  const { t } = useLanguage()
  const isArchived = normalizeStatus(caseItem.status) === "Archived"
  const activity = caseItem.activity?.length
    ? caseItem.activity
    : [{ date: caseItem.lastUpdated, label: "Case created", actor: "Staff" }]
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
              <p className="section-kicker">{t("record.caseFile")}</p>
              <h1 id="record-title" className="mt-2 text-2xl font-semibold leading-tight text-navy-900 sm:text-3xl">
                {caseItem.caseTitle}
              </h1>
              <p className="mt-2 text-sm text-navy-500">
                {caseItem.caseType || "Case"} · {hasCaseNumber(caseItem) ? displayCaseNumber(caseItem) : t("cases.noDocket")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={caseItem.status} />
                {caseItem.assignedTo ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {t("form.assignedTo")}: {caseItem.assignedTo}
                  </span>
                ) : null}
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
                  <p className="font-semibold">{t("record.unpaid")}</p>
                  <p className="mt-1">{t("record.balance")}: {formatMoney(paymentBalance(caseItem))}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">{t("record.partial")}</p>
                  <p className="mt-1">
                    {formatMoney(caseItem.amountPaid)} / {formatMoney(caseItem.amountDue)} · {t("record.balance")}: {formatMoney(paymentBalance(caseItem))}
                  </p>
                </>
              )}
            </aside>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="surface-muted px-4 py-3">
              <p className="section-kicker">{t("filters.docket")}</p>
              <p className="mt-1 text-sm font-medium text-navy-900">
                {hasCaseNumber(caseItem) ? displayCaseNumber(caseItem) : t("cases.noDocket")}
              </p>
            </div>
            <div className="surface-muted px-4 py-3">
              <p className="section-kicker">{t("filters.court")}</p>
              <p className="mt-1 text-sm font-medium text-navy-900">{caseItem.court || t("record.notAssigned")}</p>
            </div>
            <div className="surface-muted px-4 py-3">
              <p className="section-kicker">{t("form.hearingDate")}</p>
              <p className="mt-1 text-sm font-medium text-navy-900">
                {caseItem.hearingDate ? formatDate(caseItem.hearingDate) : t("record.notScheduled")}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {storyParagraphs.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-navy-900">{t("record.summary")}</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-7 text-navy-700">
                  {storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-base font-semibold text-navy-900">{t("form.parties")}</h2>
              <p className="mt-2 text-[15px] leading-7 text-navy-700">{caseItem.parties || t("record.noParties")}</p>
            </section>

            <CaseDocuments
              files={caseItem.files}
              onChange={(files) => onUpdateFiles?.(caseItem, files)}
            />

            <section>
              <h2 className="text-base font-semibold text-navy-900">{t("form.remarks")}</h2>
              {updates.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {updates.map((line) => (
                    <li key={line} className="rounded-lg border border-navy-100 px-4 py-3 text-sm text-navy-700">{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-navy-500">{caseItem.remarks || t("cases.noUpdates")}</p>
              )}
            </section>

            <section>
              <h2 className="text-base font-semibold text-navy-900">{t("record.activity")}</h2>
              <ol className="mt-3 space-y-3">
                {activity.map((event, index) => (
                  <li key={`${event.date}-${event.label}-${index}`} className="rounded-lg border border-navy-100 px-4 py-3">
                    <p className="text-sm font-semibold text-navy-900">{event.label}</p>
                    <p className="mt-1 text-xs text-navy-500">
                      {formatDate(event.date)}
                      {event.actor ? ` · ${event.actor}` : ""}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 bg-navy-50/30 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {!isArchived && onArchive ? (
              <Button size="sm" onClick={() => onArchive(caseItem)}>
                <Archive className="h-4 w-4" />
                {t("cases.archive")}
              </Button>
            ) : null}
            {isArchived && onUnarchive ? (
              <Button size="sm" onClick={() => onUnarchive(caseItem)}>
                <ArchiveRestore className="h-4 w-4" />
                {t("cases.unarchive")}
              </Button>
            ) : null}
            <Button size="sm" onClick={() => exportCasePdf(caseItem)}>
              <Printer className="h-4 w-4" />
              {t("record.print")}
            </Button>
            {onDelete ? (
              <Button size="sm" variant="danger" onClick={() => onDelete(caseItem)}>
                <Trash2 className="h-4 w-4" />
                {t("cases.delete")}
              </Button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose}>{t("record.close")}</Button>
            <Button variant="primary" onClick={() => { onEdit(caseItem); onClose() }}>
              <Pencil className="h-4 w-4" />
              {t("cases.edit")}
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
