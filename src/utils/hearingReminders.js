import { getUpcomingHearingsDetailed, getHearingUrgency } from "./caseHelpers"

const REMINDER_KEY = "osg-dost-hearing-reminders"
const NOTIFY_THRESHOLDS = [7, 3, 1, 0]

export function loadReminderState() {
  try {
    const raw = localStorage.getItem(REMINDER_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveReminderState(state) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(state))
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported"
  if (Notification.permission === "granted") return "granted"
  if (Notification.permission === "denied") return "denied"
  const result = await Notification.requestPermission()
  return result
}

function buildNotificationBody(item, daysLeft, language) {
  const date = item.hearingDate
  const court = item.court ? ` · ${item.court}` : ""
  if (language === "tl") {
    if (daysLeft === 0) return `Ngayon ang hearing: ${date}${court}`
    if (daysLeft === 1) return `Bukas ang hearing: ${date}${court}`
    return `${daysLeft} araw na lang — ${date}${court}`
  }
  if (daysLeft === 0) return `Hearing is today: ${date}${court}`
  if (daysLeft === 1) return `Hearing is tomorrow: ${date}${court}`
  return `${daysLeft} days away — ${date}${court}`
}

function buildNotificationTitle(daysLeft, language) {
  if (language === "tl") {
    if (daysLeft === 0) return "Hearing ngayon — OSG DOST"
    if (daysLeft === 1) return "Hearing bukas — OSG DOST"
    if (daysLeft <= 3) return "Malapit na ang hearing — OSG DOST"
    return "Paalala sa hearing — OSG DOST"
  }
  if (daysLeft === 0) return "Hearing today — OSG DOST"
  if (daysLeft === 1) return "Hearing tomorrow — OSG DOST"
  if (daysLeft <= 3) return "Hearing soon — OSG DOST"
  return "Hearing reminder — OSG DOST"
}

export function checkHearingReminders(cases, enabled = true, language = "en") {
  if (!enabled || !("Notification" in window) || Notification.permission !== "granted") {
    return []
  }

  const state = loadReminderState()
  const upcoming = getUpcomingHearingsDetailed(cases, 7)
  const fired = []

  upcoming.forEach((item) => {
    const daysLeft = item.daysLeft
    if (daysLeft === null || daysLeft < 0) return

    const threshold = NOTIFY_THRESHOLDS.find((value) => daysLeft <= value)
    if (threshold === undefined) return

    const stateKey = `${item.id}-${item.hearingDate}-${threshold}`
    if (state[stateKey]) return

    try {
      new Notification(buildNotificationTitle(daysLeft, language), {
        body: `${item.caseTitle}: ${buildNotificationBody(item, daysLeft, language)}`,
        tag: stateKey,
      })
      state[stateKey] = new Date().toISOString()
      fired.push(item)
    } catch {
      /* ignore */
    }
  })

  saveReminderState(state)
  return fired
}

export function getNotificationPermissionStatus() {
  if (!("Notification" in window)) return "unsupported"
  return Notification.permission
}

export { getHearingUrgency, getUpcomingHearingsDetailed }
