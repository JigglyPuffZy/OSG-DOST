export const SETTINGS_KEY = "osg-dost-settings"
export const CASES_KEY = "osg-dost-cases"

export const defaultSettings = {
  displayName: "Mary Ann D. Carpiso",
  role: "Supervising Science Research Specialist",
  organization: "OSG DOST Task Force",
  startPage: "dashboard",
  compactTable: false,
  keepLocalData: true,
}

export function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return "TF"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...defaultSettings }
    const merged = { ...defaultSettings, ...JSON.parse(raw) }
    if (/Front-end Developer|UI\/UX Designer|Video Editor/i.test(merged.role || "")) {
      merged.role = defaultSettings.role
    }
    return merged
  } catch {
    return { ...defaultSettings }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadSavedCases() {
  try {
    const raw = localStorage.getItem(CASES_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

export function saveCases(cases) {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases))
}

export function clearSavedCases() {
  localStorage.removeItem(CASES_KEY)
}
