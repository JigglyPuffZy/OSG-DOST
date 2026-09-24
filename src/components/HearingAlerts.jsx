import { Bell, CalendarClock, ChevronRight } from "lucide-react"
import {
  formatDateShort,
  getHearingUrgency,
  getUpcomingHearingsDetailed,
} from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"

const toneClass = {
  today: "hearing-alert-today",
  tomorrow: "hearing-alert-tomorrow",
  soon: "hearing-alert-soon",
  upcoming: "hearing-alert-upcoming",
  later: "hearing-alert-upcoming",
}

function urgencyLabel(daysLeft, t) {
  if (daysLeft === 0) return t("hearing.today")
  if (daysLeft === 1) return t("hearing.tomorrow")
  return t("hearing.daysLeft", { count: daysLeft })
}

export default function HearingAlerts({ cases, onView, onEnableNotifications, notificationStatus }) {
  const { t } = useLanguage()
  const upcoming = getUpcomingHearingsDetailed(cases, 14)

  if (upcoming.length === 0) return null

  const showEnablePrompt =
    notificationStatus !== "granted" &&
    notificationStatus !== "unsupported" &&
    onEnableNotifications

  return (
    <section className="hearing-alerts surface-card">
      <div className="hearing-alerts-header">
        <div className="hearing-alerts-title-wrap">
          <span className="hearing-alerts-icon">
            <Bell className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t("hearing.alertTitle")}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{t("hearing.alertSubtitle")}</p>
          </div>
        </div>
        <span className="hearing-alerts-count">{upcoming.length}</span>
      </div>

      {showEnablePrompt ? (
        <div className="hearing-alerts-prompt">
          <p className="text-sm text-slate-700">{t("hearing.enablePrompt")}</p>
          <button type="button" onClick={onEnableNotifications} className="hearing-alerts-enable-btn">
            <Bell className="h-3.5 w-3.5" />
            {t("hearing.enableBtn")}
          </button>
        </div>
      ) : null}

      <ul className="hearing-alerts-list">
        {upcoming.map((item) => {
          const urgency = getHearingUrgency(item.daysLeft)
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onView(item)}
                className={`hearing-alert-item ${toneClass[urgency] || toneClass.upcoming}`}
              >
                <span className="hearing-alert-badge">{urgencyLabel(item.daysLeft, t)}</span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {item.caseTitle}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-600">
                    <CalendarClock className="h-3 w-3 shrink-0" />
                    {formatDateShort(item.hearingDate)}
                    {item.court ? <span>· {item.court}</span> : null}
                    {item.assignedTo ? <span>· {item.assignedTo}</span> : null}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            </li>
          )
        })}
      </ul>

      {upcoming.some((item) => item.daysLeft <= 3) ? (
        <p className="hearing-alerts-footnote">{t("hearing.footnote")}</p>
      ) : null}
    </section>
  )
}
