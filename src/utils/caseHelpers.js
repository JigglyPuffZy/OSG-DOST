export function hasCaseNumber(caseItem) {
  return Boolean(caseItem?.caseNumber && String(caseItem.caseNumber).trim())
}

export function hasCourt(caseItem) {
  return Boolean(caseItem?.court && String(caseItem.court).trim())
}

export function isPreCourtStage(caseItem) {
  if (hasCaseNumber(caseItem)) return false
  const type = String(caseItem?.caseType || "").toLowerCase()
  return type.includes("pre-litigation") || type.includes("small claim")
}

export function displayCaseNumber(caseItem) {
  return hasCaseNumber(caseItem) ? caseItem.caseNumber.trim() : "No docket"
}

export function displayCourt(caseItem) {
  return hasCourt(caseItem) ? caseItem.court : "Not Assigned"
}

/** Normalize any date/datetime string to YYYY-MM-DD for storage and inputs. */
export function toLocalISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function normalizeDateISO(value) {
  if (!value) return null
  const str = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str

  const isoPrefix = str.match(/^(\d{4}-\d{2}-\d{2})/)
  if (isoPrefix) return isoPrefix[1]

  const usSlash = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (usSlash) {
    const [, mm, dd, yyyy] = usSlash
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
  }

  const dashAlt = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
  if (dashAlt) {
    const [, mm, dd, yyyy] = dashAlt
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
  }

  const date = new Date(str)
  if (Number.isNaN(date.getTime())) return null
  return toLocalISODate(date)
}

/** Read hearing date from a case record (supports legacy field names). */
export function getCaseHearingDate(caseItem) {
  if (!caseItem) return null
  return normalizeDateISO(
    caseItem.hearingDate ?? caseItem.hearing_date ?? caseItem.hearing ?? null,
  )
}

/** Parse a stored date value to a local calendar day (midnight). */
export function parseCalendarDate(value) {
  const normalized = normalizeDateISO(value)
  if (!normalized) return null
  const [year, month, day] = normalized.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(value) {
  const date = parseCalendarDate(value)
  if (!date) return value ? String(value) : "—"
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateShort(value) {
  const date = parseCalendarDate(value)
  if (!date) return value ? String(value) : "—"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function normalizeStatus(status) {
  if (!status) return ""
  const lower = String(status).toLowerCase()
  if (lower === "pending") return "Pending"
  if (lower === "ongoing") return "Ongoing"
  if (lower === "closed") return "Closed"
  if (lower === "archived") return "Archived"
  return status
}

export function getCaseStats(cases) {
  return {
    total: cases.length,
    pending: cases.filter((item) => normalizeStatus(item.status) === "Pending").length,
    ongoing: cases.filter((item) => normalizeStatus(item.status) === "Ongoing").length,
    closed: cases.filter((item) => normalizeStatus(item.status) === "Closed").length,
    archived: cases.filter((item) => normalizeStatus(item.status) === "Archived").length,
    withoutNumber: cases.filter((item) => !hasCaseNumber(item)).length,
  }
}

export function getUniqueCourts(cases) {
  const courts = cases
    .map((item) => item.court)
    .filter((court) => court && String(court).trim())
  return [...new Set(courts)].sort()
}

export function findDuplicateDocket(cases, caseNumber, excludeId = null) {
  const normalized = String(caseNumber || "").trim().toLowerCase()
  if (!normalized) return null
  return (
    cases.find(
      (item) =>
        item.id !== excludeId &&
        String(item.caseNumber || "")
          .trim()
          .toLowerCase() === normalized,
    ) || null
  )
}

function isWithinDays(isoDate, days) {
  if (!isoDate) return false
  const diff = daysUntil(isoDate)
  return diff !== null && diff >= -days && diff <= 0
}

export function filterCases(cases, filters) {
  const query = filters.search.trim().toLowerCase()

  return cases.filter((item) => {
    const title = item.caseTitle.toLowerCase()
    const number = hasCaseNumber(item) ? item.caseNumber.toLowerCase() : ""
    const court = (item.court || "").toLowerCase()
    const assigned = (item.assignedTo || "").toLowerCase()
    const remark = getLatestRemark(item).toLowerCase()
    const updates = getStatusUpdates(item).join(" ").toLowerCase()
    const hearingDate = resolveCaseHearingDate(item)
    const hearingLabel = hearingDate ? formatDateShort(hearingDate).toLowerCase() : ""
    const hearingRaw = (hearingDate || "").toLowerCase()
    const matchesSearch =
      !query ||
      title.includes(query) ||
      number.includes(query) ||
      court.includes(query) ||
      assigned.includes(query) ||
      remark.includes(query) ||
      updates.includes(query) ||
      hearingLabel.includes(query) ||
      hearingRaw.includes(query) ||
      (hearingDate ? queryMatchesHearingDate(hearingDate, query) : false)

    const itemStatus = normalizeStatus(item.status)
    const matchesStatus =
      filters.status === "all" || itemStatus === normalizeStatus(filters.status)

    const matchesNumber =
      filters.caseNumber === "all" ||
      (filters.caseNumber === "with" && hasCaseNumber(item)) ||
      (filters.caseNumber === "without" && !hasCaseNumber(item))

    const matchesCourt =
      !filters.court || filters.court === "all" || item.court === filters.court

    const matchesPayment =
      !filters.paymentStatus ||
      filters.paymentStatus === "all" ||
      (item.paymentStatus || "Not required") === filters.paymentStatus

    const matchesUpdatedWeek =
      !filters.updatedThisWeek || isWithinDays(item.lastUpdated, 7)

    const matchesHearingFrom =
      !filters.hearingFrom || !hearingDate || hearingDate >= filters.hearingFrom

    const matchesHearingTo =
      !filters.hearingTo || !hearingDate || hearingDate <= filters.hearingTo

    return (
      matchesSearch &&
      matchesStatus &&
      matchesNumber &&
      matchesCourt &&
      matchesPayment &&
      matchesUpdatedWeek &&
      matchesHearingFrom &&
      matchesHearingTo
    )
  })
}

export function sortCasesForDisplay(cases) {
  return [...cases].sort((a, b) => {
    const aNum = a.reportCaseNumber
    const bNum = b.reportCaseNumber
    if (aNum != null && bNum != null && aNum !== bNum) return aNum - bNum
    if (aNum != null && bNum == null) return -1
    if (aNum == null && bNum != null) return 1
    const byDate = (b.lastUpdated || "").localeCompare(a.lastUpdated || "")
    if (byDate !== 0) return byDate
    return a.caseTitle.localeCompare(b.caseTitle)
  })
}

export function getDisplayCaseNumber(caseItem, fallbackIndex = 0) {
  if (caseItem?.reportCaseNumber != null) return caseItem.reportCaseNumber
  return fallbackIndex
}

export function createCaseId() {
  return `c-${Date.now()}`
}

export function daysUntil(dateValue) {
  if (!dateValue) return null
  const target = parseCalendarDate(dateValue)
  if (!target) return null
  const today = parseCalendarDate(todayISO())
  return Math.round((target - today) / 86400000)
}

export function getAttentionItems(cases, t) {
  const items = []
  const active = cases.filter((item) => normalizeStatus(item.status) !== "Archived")

  active.forEach((item) => {
    if (!hasCaseNumber(item)) {
      items.push({
        id: `${item.id}-number`,
        caseItem: item,
        reason: t ? t("attention.noDocket") : "No docket assigned",
        tone: "warning",
      })
    }
    const until = daysUntil(item.hearingDate)
    if (until !== null && until >= 0 && until <= 14) {
      items.push({
        id: `${item.id}-hearing`,
        caseItem: item,
        reason: t
          ? t("attention.hearing", { date: formatDateShort(item.hearingDate), days: until })
          : `Hearing on ${formatDateShort(item.hearingDate)} (${until}d)`,
        tone: until <= 3 ? "urgent" : "info",
      })
    }
    if (item.paymentStatus === "Unpaid" && Number(item.amountDue) > 0) {
      items.push({
        id: `${item.id}-unpaid`,
        caseItem: item,
        reason: t ? t("attention.unpaid") : "Payment not yet made",
        tone: "warning",
      })
    }
    if (/document/i.test(item.remarks || "")) {
      items.push({
        id: `${item.id}-docs`,
        caseItem: item,
        reason: t ? t("attention.pendingDocs") : "Pending documents",
        tone: "warning",
      })
    }
  })

  const unique = []
  const seen = new Set()
  for (const entry of items) {
    const key = `${entry.caseItem.id}-${entry.reason}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(entry)
    }
  }
  return unique.slice(0, 10)
}

export function getUpcomingHearings(cases, withinDays = 60) {
  return cases
    .filter((item) => {
      if (normalizeStatus(item.status) === "Archived") return false
      const hearingDate = resolveCaseHearingDate(item)
      if (!hearingDate) return false
      const days = daysUntil(hearingDate)
      return days !== null && days >= 0 && days <= withinDays
    })
    .map((item) => {
      const hearingDate = resolveCaseHearingDate(item)
      return hearingDate === item.hearingDate ? item : { ...item, hearingDate }
    })
    .sort((a, b) => resolveCaseHearingDate(a).localeCompare(resolveCaseHearingDate(b)))
}

export function getUpcomingHearingsDetailed(cases, withinDays = 14) {
  return getUpcomingHearings(cases, withinDays).map((item) => ({
    ...item,
    daysLeft: daysUntil(item.hearingDate),
  }))
}

export function getHearingUrgency(daysLeft) {
  if (daysLeft === 0) return "today"
  if (daysLeft === 1) return "tomorrow"
  if (daysLeft <= 3) return "soon"
  if (daysLeft <= 7) return "upcoming"
  return "later"
}

export function getHearingsInMonth(cases, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`
  return cases
    .filter((item) => normalizeStatus(item.status) !== "Archived")
    .map((item) => {
      const hearingDate = resolveCaseHearingDate(item)
      if (!hearingDate?.startsWith(prefix)) return null
      return hearingDate === item.hearingDate ? item : { ...item, hearingDate }
    })
    .filter(Boolean)
    .sort((a, b) => resolveCaseHearingDate(a).localeCompare(resolveCaseHearingDate(b)))
}

function pickRemarkForDate(text, isoDate) {
  if (!text?.trim()) return ""
  const lines = String(text)
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean)

  for (const line of lines) {
    if (extractAllDatesFromText(line).includes(isoDate)) return line
  }

  if (extractAllDatesFromText(text).includes(isoDate)) {
    return lines[0] || String(text).trim().slice(0, 140)
  }

  return ""
}

const NAMED_DATE_REGEX =
  /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(20\d{2}))?\b/gi

/** Pull every date mentioned in free text (updates, story, remarks). */
export function extractAllDatesFromText(text, referenceDate = new Date()) {
  if (!text?.trim()) return []
  const source = String(text)
  const found = new Set()

  for (const match of source.matchAll(/\b(20\d{2}-\d{2}-\d{2})\b/g)) {
    const iso = normalizeDateISO(match[1])
    if (iso) found.add(iso)
  }

  for (const match of source.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/g)) {
    const [, mm, dd, yyyy] = match
    const iso = normalizeDateISO(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`)
    if (iso) found.add(iso)
  }

  for (const match of source.matchAll(NAMED_DATE_REGEX)) {
    const monthToken = match[1].toLowerCase().replace(/\.$/, "")
    const day = Number(match[2])
    const year = match[3] ? Number(match[3]) : referenceDate.getFullYear()
    const monthIndex = INFER_MONTHS.findIndex((aliases) => aliases.includes(monthToken))
    if (monthIndex >= 0 && day >= 1 && day <= 31) {
      found.add(`${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
    }
  }

  return [...found].sort()
}

/** Build calendar entries from hearing date + every date found in remarks/updates. */
export function getCaseCalendarEntries(caseItem) {
  if (!caseItem || normalizeStatus(caseItem.status) === "Archived") return []

  const entries = []
  const seen = new Set()

  const push = (date, remark, kind) => {
    const iso = normalizeDateISO(date)
    if (!iso) return
    const dedupe = `${caseItem.id}::${iso}`
    if (seen.has(dedupe)) return
    seen.add(dedupe)
    entries.push({
      id: `${caseItem.id}-${iso}`,
      date: iso,
      caseTitle: caseItem.caseTitle,
      remark: remark?.trim() || getLatestRemark(caseItem) || "",
      kind,
      caseItem: { ...caseItem, hearingDate: iso },
    })
  }

  const explicit = getCaseHearingDate(caseItem)
  if (explicit) {
    push(explicit, getLatestRemark(caseItem), "hearing")
  }

  getStatusUpdates(caseItem).forEach((line) => {
    extractAllDatesFromText(line).forEach((date) => {
      push(date, pickRemarkForDate(line, date) || line, explicit === date ? "hearing" : "mention")
    })
  })

  if (caseItem.story) {
    extractAllDatesFromText(caseItem.story).forEach((date) => {
      push(date, pickRemarkForDate(caseItem.story, date), "mention")
    })
  }

  if (caseItem.remarks && String(caseItem.remarks).trim()) {
    extractAllDatesFromText(caseItem.remarks).forEach((date) => {
      push(date, pickRemarkForDate(caseItem.remarks, date), "mention")
    })
  }

  return entries
}

export function getCalendarEntriesInMonth(cases, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`
  return cases
    .flatMap((item) => getCaseCalendarEntries(item))
    .filter((entry) => entry.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date) || a.caseTitle.localeCompare(b.caseTitle))
}

export function getAllCalendarEntries(cases) {
  return cases
    .flatMap((item) => getCaseCalendarEntries(item))
    .sort((a, b) => a.date.localeCompare(b.date) || a.caseTitle.localeCompare(b.caseTitle))
}

export function buildCalendarEntriesByDayMap(entries) {
  const map = new Map()
  entries.forEach((entry) => {
    const day = Number(entry.date.slice(8, 10))
    if (!day) return
    if (!map.has(day)) map.set(day, [])
    map.get(day).push(entry)
  })
  return map
}

export function matchesCalendarEntrySearch(entry, query) {
  if (!query?.trim()) return true
  return matchesHearingSearch(entry.caseItem, query) || entry.remark.toLowerCase().includes(query.trim().toLowerCase())
}

export function buildHearingsByDayMap(monthHearings) {
  const map = new Map()
  monthHearings.forEach((item) => {
    const normalized = resolveCaseHearingDate(item)
    const day = Number(normalized?.slice(8, 10))
    if (!day) return
    if (!map.has(day)) map.set(day, [])
    map.get(day).push(item)
  })
  return map
}

export function resolveCalendarViewMonth(cases, referenceDate = new Date()) {
  const current = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
  const currentEntries = getCalendarEntriesInMonth(cases, current.getFullYear(), current.getMonth())
  if (currentEntries.length > 0) return current
  return getNearestHearingMonth(cases) || current
}

export function countCasesWithHearingDate(cases) {
  const ids = new Set()
  cases.forEach((item) => {
    if (normalizeStatus(item.status) === "Archived") return
    if (getCaseCalendarEntries(item).length > 0) ids.add(item.id)
  })
  return ids.size
}

export function getNearestHearingMonth(cases) {
  const dates = getAllCalendarEntries(cases).map((entry) => entry.date)
  if (!dates.length) return null

  const sorted = [...dates].sort()
  const upcoming = sorted.find((value) => (daysUntil(value) ?? -1) >= 0)
  const target = upcoming || sorted[sorted.length - 1]
  const [year, month] = target.split("-").map(Number)
  return new Date(year, month - 1, 1)
}

export function normalizeCaseRecord(caseItem) {
  if (!caseItem) return caseItem
  const hearingDate = resolveCaseHearingDate(caseItem)
  return {
    ...caseItem,
    hearingDate,
    filingDate: normalizeDateISO(caseItem.filingDate ?? caseItem.filing_date),
    lastUpdated: normalizeDateISO(caseItem.lastUpdated ?? caseItem.last_updated) || caseItem.lastUpdated,
  }
}

const INFER_MONTHS = [
  ["january", "jan"],
  ["february", "feb"],
  ["march", "mar"],
  ["april", "apr"],
  ["may", "may"],
  ["june", "jun"],
  ["july", "jul"],
  ["august", "aug"],
  ["september", "sep", "sept"],
  ["october", "oct"],
  ["november", "nov"],
  ["december", "dec"],
]

export function inferHearingDateFromText(text, referenceDate = new Date()) {
  if (!text?.trim()) return null
  const source = String(text)

  const isoMatch = source.match(/\b(20\d{2}-\d{2}-\d{2})\b/)
  if (isoMatch) return normalizeDateISO(isoMatch[1])

  const slashMatch = source.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/)
  if (slashMatch) {
    const [, mm, dd, yyyy] = slashMatch
    return normalizeDateISO(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`)
  }

  const namedMatch = source.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(20\d{2}))?\b/i,
  )
  if (namedMatch) {
    const monthToken = namedMatch[1].toLowerCase()
    const day = Number(namedMatch[2])
    const year = namedMatch[3] ? Number(namedMatch[3]) : referenceDate.getFullYear()
    const monthIndex = INFER_MONTHS.findIndex((aliases) => aliases.includes(monthToken))
    if (monthIndex >= 0 && day >= 1 && day <= 31) {
      return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    }
  }

  return null
}

const HEARING_LINE_REGEX =
  /\b(hearing|pre-?trial|presentation|witness|reset(?:ting)?|scheduled|set on|set to|next scheduled)\b/i

function collectHearingDatesFromText(text) {
  if (!text?.trim()) return []
  const dates = new Set()
  const lines = String(text).split("\n")
  for (const rawLine of lines) {
    const line = rawLine.replace(/^[-•]\s*/, "").trim()
    if (!line || !HEARING_LINE_REGEX.test(line)) continue
    extractAllDatesFromText(line).forEach((date) => dates.add(date))
  }
  return [...dates].sort()
}

export function resolveCaseHearingDate(caseItem) {
  const explicit = getCaseHearingDate(caseItem)
  if (explicit) return explicit

  const hearingDates = [
    ...collectHearingDatesFromText(getStatusUpdates(caseItem).join("\n")),
    ...collectHearingDatesFromText(caseItem?.remarks),
    ...collectHearingDatesFromText(caseItem?.story),
  ].sort()

  const uniqueHearingDates = [...new Set(hearingDates)].sort()
  if (uniqueHearingDates.length) {
    const today = todayISO()
    const upcoming = uniqueHearingDates.find((date) => date >= today)
    return upcoming || uniqueHearingDates[uniqueHearingDates.length - 1]
  }

  const text = [
    caseItem?.remarks,
    caseItem?.story,
    ...getStatusUpdates(caseItem),
  ]
    .filter(Boolean)
    .join("\n")

  const dates = extractAllDatesFromText(text)
  if (!dates.length) return null

  const today = todayISO()
  const upcoming = dates.find((date) => date >= today)
  return upcoming || dates[dates.length - 1]
}

export function getCaseCardNote(caseItem, t) {
  const remark = getLatestRemark(caseItem)
  if (remark) return remark

  const hearingDate = resolveCaseHearingDate(caseItem)
  if (hearingDate) {
    return t("cases.hearingOnly", { date: formatDateShort(hearingDate) })
  }

  if (isPreCourtStage(caseItem)) {
    return t("cases.noRemarksInReport")
  }

  return t("cases.noUpdatesNoHearing")
}

export function getPaymentSummary(cases) {
  const active = cases.filter((item) => normalizeStatus(item.status) !== "Archived")
  let totalDue = 0
  let totalPaid = 0
  let totalBalance = 0
  let unpaidCount = 0
  let partialCount = 0
  let paidCount = 0

  active.forEach((item) => {
    const due = Number(item.amountDue) || 0
    const paid = Number(item.amountPaid) || 0
    totalDue += due
    totalPaid += paid
    totalBalance += paymentBalance(item)
    if (item.paymentStatus === "Unpaid") unpaidCount += 1
    if (item.paymentStatus === "Partial") partialCount += 1
    if (item.paymentStatus === "Paid") paidCount += 1
  })

  return { totalDue, totalPaid, totalBalance, unpaidCount, partialCount, paidCount }
}

export function buildActivity(previous, next, mode, actorName = "Staff") {
  const date = todayISO()
  const activity = [...(previous?.activity || [])]
  const actor = actorName || "Staff"

  const push = (label) => {
    activity.push({ date, label, actor })
  }

  if (mode === "add") {
    push("Case created")
    if (hasCaseNumber(next)) push("Docket number assigned")
    if (next.assignedTo) push(`Assigned to ${next.assignedTo}`)
    return activity
  }

  if (!hasCaseNumber(previous) && hasCaseNumber(next)) {
    push("Docket number assigned")
  }
  if ((previous.court || "") !== (next.court || "") && next.court) {
    push(`Court updated to ${next.court}`)
  }
  if ((previous.hearingDate || "") !== (next.hearingDate || "")) {
    push(
      next.hearingDate
        ? `Hearing scheduled for ${formatDateShort(next.hearingDate)}`
        : "Hearing date cleared",
    )
  }
  if ((previous.assignedTo || "") !== (next.assignedTo || "")) {
    push(next.assignedTo ? `Assigned to ${next.assignedTo}` : "Assignment cleared")
  }
  if (normalizeStatus(previous.status) !== normalizeStatus(next.status)) {
    push(`Status updated to ${normalizeStatus(next.status)}`)
  }
  if ((previous.remarks || "") !== (next.remarks || "")) {
    push("Remarks updated")
  }
  if (JSON.stringify(previous.updates || []) !== JSON.stringify(next.updates || [])) {
    push("Status updates revised")
  }
  return activity
}

export const emptyFilters = {
  search: "",
  status: "all",
  caseNumber: "all",
  court: "all",
  paymentStatus: "all",
  updatedThisWeek: false,
  hearingFrom: "",
  hearingTo: "",
}

export function getActiveFilterChips(filters, t) {
  const chips = []
  if (filters.search.trim()) {
    chips.push({
      key: "search",
      label: `${t("filters.chipSearch")}: ${filters.search.trim()}`,
    })
  }
  if (filters.status !== "all") {
    chips.push({
      key: "status",
      label: `${t("filters.chipStatus")}: ${t(`status.${normalizeStatus(filters.status)}`)}`,
    })
  }
  if (filters.caseNumber === "with") {
    chips.push({ key: "caseNumber", label: t("filters.chipHasDocket") })
  }
  if (filters.caseNumber === "without") {
    chips.push({ key: "caseNumber", label: t("filters.chipNoDocket") })
  }
  if (filters.court && filters.court !== "all") {
    chips.push({ key: "court", label: `${t("filters.court")}: ${filters.court}` })
  }
  if (filters.paymentStatus && filters.paymentStatus !== "all") {
    chips.push({
      key: "paymentStatus",
      label: `${t("filters.payment")}: ${filters.paymentStatus}`,
    })
  }
  if (filters.updatedThisWeek) {
    chips.push({ key: "updatedThisWeek", label: t("filters.updatedWeek") })
  }
  if (filters.hearingFrom || filters.hearingTo) {
    chips.push({
      key: "hearingRange",
      label: `${t("filters.hearing")}: ${filters.hearingFrom || "…"} – ${filters.hearingTo || "…"}`,
    })
  }
  return chips
}

export function formatMoney(value) {
  const amount = Number(value) || 0
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function paymentBalance(caseItem) {
  const due = Number(caseItem.amountDue) || 0
  const paid = Number(caseItem.amountPaid) || 0
  return Math.max(due - paid, 0)
}

export function getStatusUpdates(caseItem) {
  const raw = caseItem?.updates ?? caseItem?.statusUpdates ?? caseItem?.status_updates
  if (Array.isArray(raw) && raw.length) {
    return raw
      .map((entry, index) => {
        if (typeof entry === "string") return entry.trim()
        if (entry?.body) return String(entry.body).trim()
        return ""
      })
      .filter(Boolean)
  }
  if (caseItem?.remarks && String(caseItem.remarks).trim()) {
    return String(caseItem.remarks)
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean)
  }
  return []
}

export function getLatestRemark(caseItem) {
  const updates = getStatusUpdates(caseItem)
  if (updates.length) return updates[updates.length - 1]
  return caseItem?.remarks?.trim() || ""
}

export function getRemarkCount(caseItem) {
  return getStatusUpdates(caseItem).length
}

function truncateText(text, max = 80) {
  if (!text) return ""
  return text.length > max ? `${text.slice(0, max).trim()}…` : text
}

export function getLatestRemarkPreview(caseItem, max = 80) {
  return truncateText(getLatestRemark(caseItem), max)
}

const MONTH_SHORT = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]

const MONTH_ALIASES = [
  ["january", "jan"],
  ["february", "feb"],
  ["march", "mar"],
  ["april", "apr"],
  ["may", "may"],
  ["june", "jun"],
  ["july", "jul"],
  ["august", "aug"],
  ["september", "sep", "sept"],
  ["october", "oct"],
  ["november", "nov"],
  ["december", "dec"],
]

function findMonthIndex(token) {
  const normalized = String(token || "").toLowerCase().replace(/\.$/, "")
  return MONTH_ALIASES.findIndex((aliases) => aliases.includes(normalized))
}

/** Parse flexible search text like "August 2023", "2023-08", or "Aug 18, 2023". */
export function parseSearchPeriod(query) {
  if (!query?.trim()) return null
  const q = query.trim().toLowerCase()

  const isoMonth = q.match(/\b(20\d{2})[-/](0?[1-9]|1[0-2])\b/)
  if (isoMonth) {
    return { year: Number(isoMonth[1]), month: Number(isoMonth[2]) - 1 }
  }

  const monthYearSlash = q.match(/\b(0?[1-9]|1[0-2])[-/](20\d{2})\b/)
  if (monthYearSlash) {
    return { year: Number(monthYearSlash[2]), month: Number(monthYearSlash[1]) - 1 }
  }

  const namedMonthYear = q.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(20\d{2})\b/i,
  )
  if (namedMonthYear) {
    const monthIndex = findMonthIndex(namedMonthYear[1])
    if (monthIndex >= 0) {
      return { year: Number(namedMonthYear[2]), month: monthIndex }
    }
  }

  const namedDay = q.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(20\d{2}))?\b/i,
  )
  if (namedDay) {
    const monthIndex = findMonthIndex(namedDay[1])
    const day = Number(namedDay[2])
    const year = namedDay[3] ? Number(namedDay[3]) : null
    if (monthIndex >= 0 && day >= 1 && day <= 31) {
      return { year, month: monthIndex, day }
    }
  }

  return null
}

export function queryMatchesHearingDate(isoDate, query) {
  const parsed = parseCalendarDate(isoDate)
  if (!parsed || !query?.trim()) return false

  const q = query.trim().toLowerCase()
  const day = parsed.getDate()
  const month = parsed.getMonth()
  const year = parsed.getFullYear()
  const [, mm, dd] = isoDate.split("-")

  const period = parseSearchPeriod(q)
  if (period?.month != null) {
    const targetYear = period.year ?? year
    if (month === period.month && year === targetYear) {
      if (period.day == null || day === period.day) return true
    }
  }

  if (q.includes(isoDate)) return true
  if (q.includes(`${Number(mm)}/${Number(dd)}`) || q.includes(`${mm}/${dd}`)) return true
  if (q.includes(`${Number(dd)}/${Number(mm)}`) || q.includes(`${dd}/${mm}`)) return true

  const hasDay = q.includes(String(day)) || q.includes(dd) || q.includes(String(Number(dd)))
  const hasMonth = MONTH_SHORT.some(
    (name, index) => index === month && (q.includes(name) || q.includes(MONTH_NAMES[index])),
  )

  if (hasDay && hasMonth) return true
  if (hasMonth && q.includes(String(year))) return true

  return false
}

export function matchesHearingSearch(caseItem, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const hearingDate = resolveCaseHearingDate(caseItem)
  const title = (caseItem.caseTitle || "").toLowerCase()
  const number = (caseItem.caseNumber || "").toLowerCase()
  const court = (caseItem.court || "").toLowerCase()
  const remark = getLatestRemark(caseItem).toLowerCase()
  const updates = getStatusUpdates(caseItem).join(" ").toLowerCase()
  const hearingLabel = hearingDate ? formatDateShort(hearingDate).toLowerCase() : ""
  const period = parseSearchPeriod(q)

  return (
    title.includes(q) ||
    number.includes(q) ||
    court.includes(q) ||
    remark.includes(q) ||
    updates.includes(q) ||
    hearingLabel.includes(q) ||
    (hearingDate || "").toLowerCase().includes(q) ||
    (hearingDate ? queryMatchesHearingDate(hearingDate, q) : false) ||
    (period && updates.includes(MONTH_NAMES[period.month])) ||
    (period && period.year && updates.includes(String(period.year)))
  )
}

export function getAllScheduledHearings(cases) {
  return cases
    .filter((item) => normalizeStatus(item.status) !== "Archived")
    .map((item) => {
      const hearingDate = resolveCaseHearingDate(item)
      if (!hearingDate) return null
      return hearingDate === item.hearingDate ? item : { ...item, hearingDate }
    })
    .filter(Boolean)
    .sort((a, b) => resolveCaseHearingDate(a).localeCompare(resolveCaseHearingDate(b)))
}

export function getAccomplishmentEntries(cases, withinDays = 30) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - withinDays)
  const cutoffIso = cutoff.toISOString().slice(0, 10)

  return sortCasesForDisplay(cases)
    .filter((item) => (item.lastUpdated || "") >= cutoffIso)
    .map((item) => ({
      title: item.caseTitle,
      docket: displayCaseNumber(item),
      status: normalizeStatus(item.status),
      lastUpdated: item.lastUpdated,
      updates: getStatusUpdates(item),
      assignedTo: item.assignedTo || "",
    }))
}
