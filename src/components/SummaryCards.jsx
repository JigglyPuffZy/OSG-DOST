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
    tone: "dost",
  },
  {
    key: "pending",
    label: "Pending",
    icon: PauseCircle,
    tone: "amber",
  },
  {
    key: "ongoing",
    label: "Ongoing",
    icon: CircleDot,
    tone: "sky",
  },
  {
    key: "closed",
    label: "Closed",
    icon: FolderOpen,
    tone: "emerald",
  },
  {
    key: "withoutNumber",
    label: "No docket",
    icon: Hash,
    tone: "rose",
  },
]

export default function SummaryCards({ stats, onSelect, activeKey }) {
  return (
    <section className="summary-stats" aria-label="Case statistics">
      <div className="summary-stats-track">
        {cards.map((card) => {
          const Icon = card.icon
          const value = stats[card.key] || 0
          const active = activeKey === card.key

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onSelect?.(card.key)}
              className={`summary-stat summary-stat-${card.tone} ${active ? "summary-stat-active" : ""}`}
            >
              <span className="summary-stat-icon" aria-hidden="true">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="summary-stat-text">
                <span className="summary-stat-label">{card.label}</span>
                <span className="summary-stat-value">{value}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
