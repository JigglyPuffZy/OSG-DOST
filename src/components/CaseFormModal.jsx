import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { STATUS_OPTIONS, PAYMENT_OPTIONS } from "../data/cases"
import { findDuplicateDocket, getStatusUpdates, normalizeDateISO, todayISO } from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"
import Button from "./ui/Button"

const emptyForm = {
  caseTitle: "",
  caseType: "Civil Case",
  caseNumber: "",
  court: "",
  hearingDate: "",
  assignedTo: "",
  status: "Pending",
  remarks: "",
  updatesText: "",
  parties: "",
  story: "",
  paymentStatus: "Unpaid",
  amountDue: "",
  amountPaid: "",
}

function FormSection({ title, hint, children }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
        {hint ? <p className="mt-0.5 text-xs text-navy-500">{hint}</p> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export default function CaseFormModal({
  mode,
  caseItem,
  existingCases = [],
  onClose,
  onSave,
}) {
  const { t } = useLanguage()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (mode === "edit" && caseItem) {
      setForm({
        caseTitle: caseItem.caseTitle || "",
        caseType: caseItem.caseType || "Civil Case",
        caseNumber: caseItem.caseNumber || "",
        court: caseItem.court || "",
        hearingDate: normalizeDateISO(caseItem.hearingDate) || "",
        assignedTo: caseItem.assignedTo || "",
        status: caseItem.status || "Pending",
        remarks: caseItem.remarks || "",
        updatesText: getStatusUpdates(caseItem).join("\n"),
        parties: caseItem.parties || "",
        story: caseItem.story || "",
        paymentStatus: caseItem.paymentStatus || "Unpaid",
        amountDue: caseItem.amountDue ?? "",
        amountPaid: caseItem.amountPaid ?? "",
      })
    } else {
      setForm({ ...emptyForm })
    }
    setError("")
    setSaving(false)
  }, [mode, caseItem])

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.caseTitle.trim()) {
      setError(t("form.titleRequired"))
      return
    }

    const duplicate = findDuplicateDocket(
      existingCases,
      form.caseNumber,
      mode === "edit" ? caseItem?.id : null,
    )
    if (duplicate) {
      setError(t("form.duplicateDocket", { title: duplicate.caseTitle }))
      return
    }

    const updates = form.updatesText
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean)
    if (saving) return
    setSaving(true)
    const payload = {
      caseTitle: form.caseTitle.trim(),
      caseType: form.caseType.trim() || "Civil Case",
      caseNumber: form.caseNumber.trim() || null,
      court: form.court.trim() || null,
      hearingDate: normalizeDateISO(form.hearingDate) || null,
      assignedTo: form.assignedTo.trim() || null,
      status: form.status,
      remarks: updates[0] || form.remarks.trim(),
      updates,
      filingDate: caseItem?.filingDate ?? todayISO(),
      parties: form.parties.trim(),
      story: form.story.trim(),
      paymentStatus: form.paymentStatus,
      amountDue: Number(form.amountDue) || 0,
      amountPaid: Number(form.amountPaid) || 0,
      files: caseItem?.files || [],
    }

    Promise.resolve(onSave(payload))
      .then(() => setSaving(false))
      .catch((err) => {
        setError(err?.message || t("form.saveFailed"))
        setSaving(false)
      })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-form-title"
        className="modal-enter flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <div>
            <p className="section-kicker">{mode === "edit" ? t("form.editRecord") : t("form.newRecord")}</p>
            <h2 id="case-form-title" className="mt-1 text-lg font-semibold text-navy-900">
              {mode === "edit" ? t("form.editCase") : t("form.addCase")}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form id="case-form" onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <FormSection title={t("form.caseDetails")} hint={t("form.caseDetailsHint")}>
            <label className="field-label">
              {t("form.caseTitle")} <span className="text-red-600">*</span>
              <input
                value={form.caseTitle}
                onChange={(event) => update("caseTitle", event.target.value)}
                className="field-input"
              />
            </label>
            <label className="field-label">
              {t("form.caseType")}
              <input value={form.caseType} onChange={(event) => update("caseType", event.target.value)} className="field-input" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="field-label">
                {t("filters.docket")}
                <input value={form.caseNumber} onChange={(event) => update("caseNumber", event.target.value)} className="field-input" />
              </label>
              <label className="field-label">
                {t("filters.status")}
                <select value={form.status} onChange={(event) => update("status", event.target.value)} className="field-input">
                  {STATUS_OPTIONS.filter((s) => s !== "Archived").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="field-hearing-block">
              <label className="field-label">
                {t("form.hearingDate")} <span className="field-label-note">{t("form.hearingDateHint")}</span>
                <input
                  type="date"
                  value={form.hearingDate}
                  onChange={(event) => update("hearingDate", event.target.value)}
                  className="field-input field-input-hearing"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="field-label">
                {t("filters.court")}
                <input value={form.court} onChange={(event) => update("court", event.target.value)} placeholder="RTC Branch 5" className="field-input" />
              </label>
              <label className="field-label">
                {t("form.assignedTo")}
                <input value={form.assignedTo} onChange={(event) => update("assignedTo", event.target.value)} placeholder={t("form.assignedPlaceholder")} className="field-input" />
              </label>
            </div>
          </FormSection>

          <FormSection title={t("form.partiesNarrative")}>
            <label className="field-label">
              {t("form.parties")}
              <input value={form.parties} onChange={(event) => update("parties", event.target.value)} className="field-input" />
            </label>
            <label className="field-label">
              {t("form.story")}
              <textarea rows={4} value={form.story} onChange={(event) => update("story", event.target.value)} className="field-input" />
            </label>
          </FormSection>

          <FormSection title={t("form.payment")}>
            <label className="field-label">
              {t("form.paymentStatus")}
              <select value={form.paymentStatus} onChange={(event) => update("paymentStatus", event.target.value)} className="field-input">
                {PAYMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="field-label">
                {t("form.amountDue")}
                <input type="number" min="0" value={form.amountDue} onChange={(event) => update("amountDue", event.target.value)} className="field-input" />
              </label>
              <label className="field-label">
                {t("form.amountPaid")}
                <input type="number" min="0" value={form.amountPaid} onChange={(event) => update("amountPaid", event.target.value)} className="field-input" />
              </label>
            </div>
          </FormSection>

          <FormSection title={t("form.remarks")} hint={t("form.remarksHint")}>
            <textarea rows={5} value={form.updatesText} onChange={(event) => update("updatesText", event.target.value)} className="field-input" />
          </FormSection>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">{error}</p>
          ) : null}
        </form>

        <div className="flex justify-end gap-2 border-t border-navy-100 bg-navy-50/30 px-5 py-4">
          <Button onClick={onClose}>{t("confirm.cancel")}</Button>
          <Button variant="primary" type="submit" form="case-form" disabled={saving}>
            {saving ? t("form.saving") : mode === "edit" ? t("form.saveChanges") : t("form.addCaseBtn")}
          </Button>
        </div>
      </div>
    </div>
  )
}
