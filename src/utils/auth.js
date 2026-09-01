export const SESSION_KEY = "osg-dost-session"

export const DEFAULT_LOGIN_EMAIL = "admindost@gmail.com"
export const DEFAULT_LOGIN_PASSWORD = "Admin123"
export const DEFAULT_DISPLAY_NAME = "Mary Ann D. Carpiso"

export function loadLocalSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data?.email ? data : null
  } catch {
    return null
  }
}

export function saveLocalSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearLocalSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function tryLocalLogin(email, password) {
  const normalized = String(email || "").trim().toLowerCase()
  if (
    normalized === DEFAULT_LOGIN_EMAIL.toLowerCase() &&
    password === DEFAULT_LOGIN_PASSWORD
  ) {
    const user = {
      id: "local",
      email: DEFAULT_LOGIN_EMAIL,
      displayName: DEFAULT_DISPLAY_NAME,
      local: true,
    }
    saveLocalSession(user)
    return user
  }
  return null
}
