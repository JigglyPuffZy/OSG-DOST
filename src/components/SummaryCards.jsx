import {
  Briefcase,
  CircleDot,
  FolderOpen,
  Hash,
  PauseCircle,
} from "lucide-react"

const cards = [
  {
    key: "total",
    label: "Total cases",
    icon: Briefcase,
    iconWrap: "bg-dost-100 text-dost-700",
    bar: "bg-dost-500",
    ring: "ring-dost-400",
    activeBorder: "border-dost-300",
  },
  {
    key: "pending",
    label: "Pending",
    icon: PauseCircle,
    iconWrap: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
    ring: "ring-amber-300",
    activeBorder: "border-amber-300",
  },
  {
    key: "ongoing",
    label: "Ongoing",
    icon: CircleDot,
    iconWrap: "bg-sky-100 text-sky-700",
    bar: "bg-sky-500",
    ring: "ring-sky-300",
    activeBorder: "border-sky-300",
  },
  {
    key: "closed",
    label: "Closed",
    icon: FolderOpen,
    iconWrap: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-300",
    activeBorder: "border-emerald-300",
  },
  {
    key: "withoutNumber",
    label: "No number",
    icon: Hash,
    iconWrap: "bg-rose-100 text-rose-700",
    bar: "bg-rose-400",
    ring: "ring-rose-300",
    activeBorder: "border-rose-300",
  },
]

export default function SummaryCards({ stats, onSelect, activeKey, compact = false }) {
  const total = Math.max(stats.total, 1)

  return (
    <section
      className={
        compact
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          : "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
      }
    >
      {cards.map((card) => {
        const Icon = card.icon
        const value = stats[card.key] || 0
        const active = activeKey === card.key
        const pct = card.key === "total" ? 100 : Math.round((value / total) * 100)

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect?.(card.key)}
            className={`stat-card group rounded-2xl border bg-white p-4 text-left ${
              active
                ? `${card.activeBorder} shadow-md ring-2 ${card.ring} ring-offset-1`
                : "border-slate-100 hover:border-dost-200/60"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {card.label}
              </span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${card.iconWrap}`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`stat-bar-fill h-full rounded-full ${card.bar}`}
                style={{ "--bar-pct": `${pct}%` }}
              />
            </div>
          </button>
        )
      })}
    </section>
  )
}
