import { useLanguage } from "../i18n/LanguageContext"

const styles = {
  pending: "bg-amber-50 text-amber-900 ring-amber-200/80",
  ongoing: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
  closed: "bg-sky-50 text-sky-900 ring-sky-200/80",
  archived: "bg-slate-100 text-slate-700 ring-slate-200/80",
  Pending: "bg-amber-50 text-amber-900 ring-amber-200/80",
  Ongoing: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
  Closed: "bg-sky-50 text-sky-900 ring-sky-200/80",
  Archived: "bg-slate-100 text-slate-700 ring-slate-200/80",
}

const dots = {
  pending: "bg-amber-500",
  ongoing: "bg-emerald-500",
  closed: "bg-sky-500",
  archived: "bg-slate-500",
  Pending: "bg-amber-500",
  Ongoing: "bg-emerald-500",
  Closed: "bg-sky-500",
  Archived: "bg-slate-500",
}

export default function StatusBadge({ status }) {
  const { t } = useLanguage()
  const normalizedStatus = status?.toLowerCase()
  const label = normalizedStatus ? t(`status.${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`) : status

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${styles[normalizedStatus] || styles.archived}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dots[normalizedStatus] || dots.archived}`}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
