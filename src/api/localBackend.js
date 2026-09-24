import { createCaseId, normalizeCaseRecord, todayISO } from "../utils/caseHelpers"
import { DEFAULT_DISPLAY_NAME, DEFAULT_LOGIN_EMAIL } from "../utils/auth"
import {
  defaultSettings,
  loadSavedCases,
  loadSettings,
  saveCases,
  saveSettings,
  withProfileDefaults,
} from "../utils/settings"

const LOCAL_PROFILE_KEY = "osg-dost-local-profile"

let memoryCases = []

function readStorage() {
  return loadSavedCases()
}

function writeStorage(cases) {
  saveCases(cases)
}

function resolveCaseList(currentCases, keepLocalData) {
  if (Array.isArray(currentCases) && currentCases.length > 0) {
    return currentCases.map((item) => ({ ...item }))
  }
  if (keepLocalData) {
    return readStorage() || []
  }
  return memoryCases.map((item) => ({ ...item }))
}

function persistCases(next, keepLocalData) {
  if (keepLocalData) {
    writeStorage(next)
  } else {
    memoryCases = next.map((item) => ({ ...item }))
  }
}

export async function fetchAllCases(keepLocalData = true) {
  if (keepLocalData) {
    const stored = readStorage()
    return stored?.length ? stored.map(normalizeCaseRecord) : []
  }
  return memoryCases.map((item) => normalizeCaseRecord({ ...item }))
}

export async function createCase(payload, activity, currentCases) {
  const settings = loadSettings()
  const keepLocalData = settings.keepLocalData
  const id = createCaseId()
  const created = normalizeCaseRecord({
    id,
    ...payload,
    files: payload.files || [],
    lastUpdated: todayISO(),
    activity: activity || [],
    updates: payload.updates?.length
      ? payload.updates
      : payload.remarks
        ? [payload.remarks]
        : [],
  })

  const base = resolveCaseList(currentCases, keepLocalData)
  const next = [created, ...base.filter((item) => item.id !== created.id)]
  persistCases(next, keepLocalData)
  return created
}

export async function updateCase(previous, payload, activity, currentCases) {
  const settings = loadSettings()
  const keepLocalData = settings.keepLocalData
  const updated = normalizeCaseRecord({
    ...previous,
    ...payload,
    lastUpdated: todayISO(),
    activity: activity ?? previous.activity,
    updates: payload.updates ?? previous.updates,
    files: payload.files ?? previous.files,
  })

  const base = resolveCaseList(currentCases, keepLocalData)
  const exists = base.some((item) => item.id === previous.id)
  const next = exists
    ? base.map((item) => (item.id === previous.id ? updated : item))
    : [updated, ...base]
  persistCases(next, keepLocalData)
  return updated
}

export async function deleteCase(caseCode, currentCases) {
  const settings = loadSettings()
  const keepLocalData = settings.keepLocalData
  const base = resolveCaseList(currentCases, keepLocalData)
  persistCases(
    base.filter((item) => item.id !== caseCode),
    keepLocalData,
  )
}

export async function replaceAllCases(cases) {
  const settings = loadSettings()
  const keepLocalData = settings.keepLocalData
  const copy = cases.map((item) => ({ ...item }))

  if (keepLocalData) {
    writeStorage(copy)
  } else {
    memoryCases = copy
  }

  return copy
}

export async function ensureLocalProfile(user) {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY)
    if (raw) {
      return withProfileDefaults(JSON.parse(raw))
    }
  } catch {
    /* use defaults */
  }

  const profile = {
    ...defaultSettings,
    displayName:
      user?.email?.toLowerCase() === DEFAULT_LOGIN_EMAIL.toLowerCase()
        ? DEFAULT_DISPLAY_NAME
        : user?.email?.split("@")[0] || defaultSettings.displayName,
  }
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile))
  return withProfileDefaults(profile)
}

export async function saveLocalProfile(settings) {
  const payload = withProfileDefaults({
    displayName: settings.displayName,
    role: settings.role,
    organization: settings.organization,
    startPage: settings.startPage,
    compactTable: settings.compactTable,
    keepLocalData: settings.keepLocalData,
    hearingReminders: settings.hearingReminders,
  })
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(payload))
  saveSettings(payload)
  return payload
}

export function resetMemoryStore() {
  memoryCases = []
}
