import { useEffect, useMemo, useRef, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import {
  buildCalendarEntriesByDayMap,
  countCasesWithHearingDate,
  daysUntil,
  formatDateShort,
  getAllCalendarEntries,
  getCalendarEntriesInMonth,
  getHearingUrgency,
  getLatestRemark,
  getNearestHearingMonth,
  getUpcomingHearingsDetailed,
  matchesCalendarEntrySearch,
  parseCalendarDate,
  parseSearchPeriod,
  resolveCalendarViewMonth,
} from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function urgencyLabel(daysLeft, t) {
  if (daysLeft === 0) return t("hearing.today")
  if (daysLeft === 1) return t("hearing.tomorrow")
  return t("hearing.daysLeft", { count: daysLeft })
}

export default function HearingCalendar({ cases, onView }) {
  const { t } = useLanguage()
  const today = new Date()
  const userPickedMonthRef = useRef(false)
  const [search, setSearch] = useState("")
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const scheduledCount = useMemo(() => countCasesWithHearingDate(cases), [cases])
  const nearestMonth = useMemo(() => getNearestHearingMonth(cases), [cases])
  const allEntries = useMemo(() => getAllCalendarEntries(cases), [cases])

  useEffect(() => {
    if (scheduledCount === 0 || userPickedMonthRef.current) return
    setViewDate((current) => {
      const hasCurrentMonthEntries = getCalendarEntriesInMonth(
        cases,
        current.getFullYear(),
        current.getMonth(),
      ).length > 0
      if (hasCurrentMonthEntries) return current

      const resolved = resolveCalendarViewMonth(cases, new Date())
      if (
        current.getFullYear() === resolved.getFullYear() &&
        current.getMonth() === resolved.getMonth()
      ) {
        return current
      }
      return resolved
    })
  }, [scheduledCount, cases])

  const searchMatches = useMemo(() => {
    if (!search.trim()) return []
    return allEntries.filter((entry) => matchesCalendarEntrySearch(entry, search))
  }, [allEntries, search])

  useEffect(() => {
    if (!search.trim()) return undefined

    const timer = setTimeout(() => {
      const period = parseSearchPeriod(search)
      if (period?.month != null && period?.year != null) {
        setViewDate((current) => {
          const next = new Date(period.year, period.month, 1)
          if (
            current.getFullYear() === next.getFullYear() &&
            current.getMonth() === next.getMonth()
          ) {
            return current
          }
          return next
        })
        return
      }

      if (searchMatches.length === 0) return

      const parsed = parseCalendarDate(searchMatches[0].date)
      if (!parsed) return

      const next = new Date(parsed.getFullYear(), parsed.getMonth(), 1)
      setViewDate((current) => {
        if (current.getFullYear() === next.getFullYear() && current.getMonth() === next.getMonth()) {
          return current
        }
        return next
      })
    }, 400)

    return () => clearTimeout(timer)
  }, [search, searchMatches])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthValue = `${year}-${String(month + 1).padStart(2, "0")}`
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const weekAhead = useMemo(() => getUpcomingHearingsDetailed(cases, 7), [cases])

  const monthEntries = useMemo(
    () => getCalendarEntriesInMonth(cases, year, month),
    [cases, year, month],
  )

  const visibleMonthEntries = useMemo(() => {
    if (!search.trim()) return monthEntries
    return monthEntries.filter((entry) => matchesCalendarEntrySearch(entry, search))
  }, [monthEntries, search])

  const footerEntries = search.trim() ? searchMatches : monthEntries

  const entriesByDay = useMemo(
    () => buildCalendarEntriesByDayMap(visibleMonthEntries),
    [visibleMonthEntries],
  )

  const goToToday = () => {
    userPickedMonthRef.current = true
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const goToNearestHearing = () => {
    userPickedMonthRef.current = true
    if (nearestMonth) setViewDate(nearestMonth)
  }

  const handleMonthPick = (event) => {
    const value = event.target.value
    if (!value) return
    userPickedMonthRef.current = true
    const [pickedYear, pickedMonth] = value.split("-").map(Number)
    setViewDate(new Date(pickedYear, pickedMonth - 1, 1))
  }

  const isViewingCurrentMonth =
    year === today.getFullYear() && month === today.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)

  const shiftMonth = (delta) => {
    userPickedMonthRef.current = true
    setViewDate(new Date(year, month + delta, 1))
  }

  const showNearestHint =
    monthEntries.length === 0 &&
    scheduledCount > 0 &&
    nearestMonth &&
    (nearestMonth.getFullYear() !== year || nearestMonth.getMonth() !== month)

  return (
    <section className="hearing-calendar surface-card">
      <div className="hearing-calendar-header">
        <div className="hearing-calendar-title-wrap">
          <span className="hearing-calendar-icon">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t("calendar.title")}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{t("calendar.purpose")}</p>
          </div>
        </div>
        <div className="hearing-calendar-nav">
          {!isViewingCurrentMonth ? (
            <button type="button" onClick={goToToday} className="hearing-calendar-today-btn">
              {t("calendar.today")}
            </button>
          ) : null}
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="hearing-calendar-month">{monthLabel}</span>
          {monthEntries.length > 0 ? (
            <span className="hearing-calendar-month-count">
              {t("calendar.scheduledCount", { count: monthEntries.length })}
            </span>
          ) : null}
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="hearing-calendar-help">{t("calendar.help")}</p>

      <div className="hearing-calendar-toolbar">
        <div className="hearing-calendar-search-wrap">
          <Search className="hearing-calendar-search-icon" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("calendar.searchPlaceholder")}
            className="hearing-calendar-search-input"
          />
          {search ? (
            <button type="button" className="hearing-calendar-search-clear" onClick={() => setSearch("")}>
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <label className="hearing-calendar-month-picker">
          <span>{t("calendar.jumpTo")}</span>
          <input type="month" value={monthValue} onChange={handleMonthPick} />
        </label>
      </div>
      <p className="hearing-calendar-search-note">{t("calendar.searchOptional")}</p>

      {search.trim() ? (
        <p className="hearing-calendar-search-meta">
          {searchMatches.length > 0
            ? t("calendar.searchResults", { count: searchMatches.length })
            : t("calendar.searchEmpty")}
        </p>
      ) : null}

      {scheduledCount > 0 ? (
        <p className="hearing-calendar-data-meta">
          {t("calendar.totalScheduled", { count: scheduledCount })}
        </p>
      ) : null}

      {showNearestHint ? (
        <div className="hearing-calendar-hint hearing-calendar-hint-strong">
          <p>{t("calendar.otherMonthHint")}</p>
          <button type="button" onClick={goToNearestHearing} className="hearing-calendar-hint-btn">
            {t("calendar.viewNearest")}
          </button>
        </div>
      ) : null}

      {monthEntries.length === 0 && scheduledCount === 0 ? (
        <div className="hearing-calendar-hint hearing-calendar-hint-info">
          <p>{t("calendar.emptyNoDates")}</p>
        </div>
      ) : null}

      {weekAhead.length > 0 ? (
        <div className="hearing-calendar-week-strip">
          <p className="hearing-calendar-week-label">{t("calendar.thisWeek")}</p>
          <div className="hearing-calendar-week-chips">
            {weekAhead.map((item) => {
              const urgency = getHearingUrgency(item.daysLeft)
              const remark = getLatestRemark(item)
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`hearing-week-chip hearing-week-chip-${urgency}`}
                  onClick={() => onView(item)}
                  title={[item.caseTitle, remark].filter(Boolean).join(" — ")}
                >
                  <span className="hearing-week-chip-when">
                    {formatDateShort(item.hearingDate)} · {urgencyLabel(item.daysLeft, t)}
                  </span>
                  <span className="hearing-week-chip-title">{item.caseTitle}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className={`hearing-calendar-grid-wrap ${visibleMonthEntries.length === 0 ? "is-empty" : ""}`}>
        <div className="hearing-calendar-grid">
          {WEEKDAYS.map((day) => (
            <div key={day} className="hearing-calendar-weekday">
              {day}
            </div>
          ))}
          {cells.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="hearing-calendar-cell empty" />

            const items = entriesByDay.get(day) || []
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear()

            const nearestDays = items.length
              ? Math.min(...items.map((entry) => daysUntil(entry.date) ?? 99))
              : null
            const urgent = nearestDays !== null && nearestDays <= 3

            return (
              <div
                key={day}
                className={`hearing-calendar-cell ${isToday ? "today" : ""} ${items.length ? "has-events" : ""} ${urgent ? "urgent" : ""}`}
              >
                <span className="hearing-calendar-day">{day}</span>
                {items.slice(0, 3).map((entry) => {
                  const left = daysUntil(entry.date)
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      className={`hearing-calendar-event ${left !== null && left <= 3 ? "hearing-calendar-event-urgent" : ""} ${left !== null && left < 0 ? "hearing-calendar-event-past" : ""}`}
                      title={[entry.caseTitle, entry.remark].filter(Boolean).join(" — ")}
                      onClick={() => onView(entry.caseItem)}
                    >
                      <span className="hearing-calendar-event-kind">
                        {entry.kind === "hearing" ? t("calendar.entryHearing") : t("calendar.entryMention")}
                      </span>
                      <span className="hearing-calendar-event-title">{entry.caseTitle}</span>
                      {entry.remark ? (
                        <span className="hearing-calendar-event-remark">{entry.remark}</span>
                      ) : (
                        <span className="hearing-calendar-event-remark muted">{t("calendar.noRemarks")}</span>
                      )}
                    </button>
                  )
                })}
                {items.length > 3 ? (
                  <span className="hearing-calendar-more">+{items.length - 3} {t("calendar.more")}</span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <div className="hearing-calendar-footer">
        {footerEntries.length === 0 ? (
          <div className="hearing-calendar-empty">
            <p className="hearing-calendar-empty-title">{t("calendar.empty")}</p>
            <p className="hearing-calendar-empty-hint">
              {search.trim()
                ? t("calendar.searchEmpty")
                : scheduledCount === 0
                  ? t("calendar.emptyNoDates")
                  : t("calendar.emptyOtherMonth")}
            </p>
            {!search.trim() && scheduledCount > 0 ? (
              <button type="button" onClick={goToNearestHearing} className="hearing-calendar-hint-btn mt-2">
                {t("calendar.viewNearest")}
              </button>
            ) : null}
          </div>
        ) : (
          <ul className="hearing-calendar-list">
            {footerEntries.map((entry) => {
              const left = daysUntil(entry.date)
              return (
                <li key={entry.id}>
                  <button type="button" onClick={() => onView(entry.caseItem)} className="hearing-calendar-list-btn">
                    <span className="hearing-calendar-list-date">
                      {formatDateShort(entry.date)}
                    </span>
                    <span className={`hearing-calendar-list-when ${left !== null && left <= 3 ? "urgent" : ""} ${left !== null && left < 0 ? "past" : ""}`}>
                      {left !== null && left >= 0
                        ? urgencyLabel(left, t)
                        : left !== null && left < 0
                          ? t("calendar.past")
                          : entry.kind === "hearing"
                            ? t("calendar.entryHearing")
                            : t("calendar.entryMention")}
                    </span>
                    <div className="hearing-calendar-list-body">
                      <span className="hearing-calendar-list-title">{entry.caseTitle}</span>
                      <span className="hearing-calendar-list-remark">
                        {entry.remark || t("calendar.noRemarks")}
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
