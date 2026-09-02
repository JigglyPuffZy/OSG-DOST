import { useEffect, useState } from "react"
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
    featured: true,
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

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return undefined
    }

    let frame = 0
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

function ProgressRing({ percent, tone, children }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className={`summary-ring summary-ring-${tone}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="summary-ring-track" cx="50" cy="50" r={radius} />
        <circle
          className="summary-ring-progress"
          cx="50"
          cy="50"
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="summary-ring-center">{children}</div>
    </div>
  )
}

function StatCard({ card, value, total, active, delay, onSelect }) {
  const Icon = card.icon
  const animated = useCountUp(value)
  const percent = card.key === "total" ? 100 : Math.round((value / total) * 100)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(card.key)}
      className={`summary-glass summary-glass-${card.tone} ${
        card.featured ? "summary-glass-featured" : ""
      } ${active ? "summary-glass-active" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="summary-glass-shine" aria-hidden="true" />
      <div className="summary-glass-body">
        <div className="summary-glass-top">
          <span className="summary-glass-icon">
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <span className="summary-glass-label">{card.label}</span>
        </div>

        {card.featured ? (
          <div className="summary-featured-value">
            <span className="summary-glass-number summary-glass-number-xl">
              {animated}
            </span>
            <span className="summary-featured-caption">Active docket</span>
          </div>
        ) : (
          <div className="summary-glass-metric">
            <ProgressRing percent={percent} tone={card.tone}>
              <span className="summary-glass-number">{animated}</span>
            </ProgressRing>
            <span className="summary-glass-pct">{percent}% of total</span>
          </div>
        )}
      </div>
    </button>
  )
}

export default function SummaryCards({ stats, onSelect, activeKey }) {
  const total = Math.max(stats.total, 1)

  return (
    <section className="summary-hero" aria-label="Case statistics">
      <div className="summary-hero-aurora" aria-hidden="true">
        <span className="summary-aurora summary-aurora-a" />
        <span className="summary-aurora summary-aurora-b" />
        <span className="summary-aurora summary-aurora-c" />
      </div>

      <div className="summary-hero-header">
        <div className="summary-hero-title">
          <span>Live overview</span>
        </div>
        <p className="summary-hero-sub">Tap a metric to filter the docket</p>
      </div>

      <div className="summary-hero-grid">
        {cards.map((card, index) => (
          <StatCard
            key={card.key}
            card={card}
            value={stats[card.key] || 0}
            total={total}
            active={activeKey === card.key}
            delay={index * 70}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
