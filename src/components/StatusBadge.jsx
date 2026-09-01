const styles = {
  Pending: "bg-amber-50 text-amber-900 ring-amber-200/80",
  Ongoing: "bg-sky-50 text-sky-900 ring-sky-200/80",
  Closed: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
  Archived: "bg-slate-100 text-slate-700 ring-slate-200/80",
}

const dots = {
  Pending: "bg-amber-500",
  Ongoing: "bg-sky-500",
  Closed: "bg-emerald-500",
  Archived: "bg-slate-500",
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${styles[status] || styles.Archived}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dots[status] || dots.Archived}`}
        aria-hidden="true"
      />
      {status}
    </span>
  )
}
