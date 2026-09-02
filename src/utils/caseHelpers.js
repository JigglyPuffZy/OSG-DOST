export function hasCaseNumber(caseItem) {
  return Boolean(caseItem?.caseNumber && String(caseItem.caseNumber).trim())
}

export function hasCourt(caseItem) {
  return Boolean(caseItem?.court && String(caseItem.court).trim())
}

export function displayCaseNumber(caseItem) {
  return hasCaseNumber(caseItem) ? caseItem.caseNumber.trim() : "No docket"
}

export function displayCourt(caseItem) {
  return hasCourt(caseItem) ? caseItem.court : "Not Assigned"
}

export function formatDate(value) {
  if (!value) return "—"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateShort(value) {
  if (!value) return "—"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function getCaseStats(cases) {
  return {
    total: cases.length,
    pending: cases.filter((item) => item.status === "Pending").length,
    ongoing: cases.filter((item) => item.status === "Ongoing").length,
    closed: cases.filter((item) => item.status === "Closed").length,
    archived: cases.filter((item) => item.status === "Archived").length,
    withoutNumber: cases.filter((item) => !hasCaseNumber(item)).length,
  }
}

export function getUniqueCourts(cases) {
  const courts = cases
    .map((item) => item.court)
    .filter((court) => court && String(court).trim())
  return [...new Set(courts)].sort()
}

export function filterCases(cases, filters) {
  const query = filters.search.trim().toLowerCase()

  return cases.filter((item) => {
    const title = item.caseTitle.toLowerCase()
    const number = hasCaseNumber(item) ? item.caseNumber.toLowerCase() : ""
    const matchesSearch = !query || title.includes(query) || number.includes(query)
    const matchesStatus =
      filters.status === "all" || item.status === filters.status
    const matchesNumber =
      filters.caseNumber === "all" ||
      (filters.caseNumber === "with" && hasCaseNumber(item)) ||
      (filters.caseNumber === "without" && !hasCaseNumber(item))

    return matchesSearch && matchesStatus && matchesNumber
  })
}

export function sortCasesForDisplay(cases) {
  return [...cases].sort((a, b) => {
    const byDate = (b.lastUpdated || "").localeCompare(a.lastUpdated || "")
    if (byDate !== 0) return byDate
    return a.caseTitle.localeCompare(b.caseTitle)
  })
}

export function createCaseId() {
  return `c-${Date.now()}`
}

export function daysUntil(dateValue) {
  if (!dateValue) return null
  const today = new Date(`${todayISO()}T00:00:00`)
  const target = new Date(`${dateValue}T00:00:00`)
  return Math.round((target - today) / 86400000)
}

export function getAttentionItems(cases) {
  const items = []

  cases.forEach((item) => {
    if (!hasCaseNumber(item)) {
      items.push({
        id: `${item.id}-number`,
        caseItem: item,
        reason: "Case number not yet assigned",
        tone: "warning",
      })
    }
    const until = daysUntil(item.hearingDate)
    if (until !== null && until >= 0 && until <= 21) {
      items.push({
        id: `${item.id}-hearing`,
        caseItem: item,
        reason: `Upcoming hearing on ${formatDate(item.hearingDate)}`,
        tone: "info",
      })
    }
    if (/document/i.test(item.remarks || "")) {
      items.push({
        id: `${item.id}-docs`,
        caseItem: item,
        reason: "Pending documents for docketing",
        tone: "warning",
      })
    }
    if (item.paymentStatus === "Unpaid") {
      items.push({
        id: `${item.id}-unpaid`,
        caseItem: item,
        reason: "Payment not yet made",
        tone: "warning",
      })
    }
    const updatedAgo = daysUntil(item.lastUpdated)
    if (updatedAgo !== null && updatedAgo >= -3 && updatedAgo <= 0) {
      items.push({
        id: `${item.id}-recent`,
        caseItem: item,
        reason: "Recently updated",
        tone: "info",
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
  return unique.slice(0, 8)
}

export function buildActivity(previous, next, mode) {
  const date = todayISO()
  const activity = [...(previous?.activity || [])]

  if (mode === "add") {
    activity.push({ date, label: "Case created" })
    if (hasCaseNumber(next)) {
      activity.push({ date, label: "Case number assigned" })
    }
    return activity
  }

  if (!hasCaseNumber(previous) && hasCaseNumber(next)) {
    activity.push({ date, label: "Case number assigned" })
  }
  if (previous.status !== next.status) {
    activity.push({ date, label: `Status updated to ${next.status}` })
  }
  if ((previous.remarks || "") !== (next.remarks || "")) {
    activity.push({ date, label: "Remarks updated" })
  }
  return activity
}

export const emptyFilters = {
  search: "",
  status: "all",
  caseNumber: "all",
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
      label: `${t("filters.chipStatus")}: ${t(`status.${filters.status}`)}`,
    })
  }
  if (filters.caseNumber === "with") {
    chips.push({ key: "caseNumber", label: t("filters.chipHasDocket") })
  }
  if (filters.caseNumber === "without") {
    chips.push({ key: "caseNumber", label: t("filters.chipNoDocket") })
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
  if (Array.isArray(caseItem?.updates) && caseItem.updates.length) {
    return caseItem.updates
  }
  if (caseItem?.remarks && String(caseItem.remarks).trim()) {
    return String(caseItem.remarks)
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean)
  }
  return []
}
