import { isSupabaseConfigured } from "../lib/supabase"
import * as remoteCases from "./cases"
import * as remoteProfile from "./profile"
import * as local from "./localBackend"

export const isRemoteBackend = isSupabaseConfigured

const DB_SETUP_HINT =
  "Check the Supabase database schema, views, and access permissions."

function dbSetupMessage(error) {
  const message = error?.message || String(error)
  if (
    message.includes("cases_full") ||
    message.includes("case_stats") ||
    message.includes("profiles") ||
    message.includes("story") ||
    message.includes("schema cache") ||
    message.includes("relation") ||
    message.includes("permission denied")
  ) {
    return `Database not set up or missing views/permissions. ${DB_SETUP_HINT} (${message})`
  }
  return message
}

export async function fetchAllCases(keepLocalData = true) {
  if (isRemoteBackend) {
    try {
      return await remoteCases.fetchAllCases()
    } catch (error) {
      throw new Error(dbSetupMessage(error))
    }
  }
  return local.fetchAllCases(keepLocalData)
}

export async function createCase(payload, activity, currentCases) {
  if (isRemoteBackend) {
    try {
      return await remoteCases.createCase(payload, activity)
    } catch (error) {
      throw new Error(dbSetupMessage(error))
    }
  }
  return local.createCase(payload, activity, currentCases)
}

export async function updateCase(previous, payload, activity, currentCases) {
  if (isRemoteBackend) {
    try {
      return await remoteCases.updateCase(previous, payload, activity)
    } catch (error) {
      throw new Error(dbSetupMessage(error))
    }
  }
  return local.updateCase(previous, payload, activity, currentCases)
}

export async function deleteCase(caseCode, currentCases) {
  if (isRemoteBackend) {
    try {
      return await remoteCases.deleteCase(caseCode)
    } catch (error) {
      throw new Error(dbSetupMessage(error))
    }
  }
  return local.deleteCase(caseCode, currentCases)
}

export async function replaceAllCases(cases) {
  if (isRemoteBackend) {
    throw new Error("Restore sample data is only available in local mode.")
  }
  local.resetMemoryStore()
  return local.replaceAllCases(cases)
}

export async function ensureProfile(user) {
  if (isRemoteBackend) {
    try {
      return await remoteProfile.ensureProfile(user)
    } catch (error) {
      throw new Error(dbSetupMessage(error))
    }
  }
  return local.ensureLocalProfile(user)
}

export async function saveProfile(settings) {
  if (isRemoteBackend) {
    try {
      return await remoteProfile.saveProfile(settings)
    } catch (error) {
      throw new Error(dbSetupMessage(error))
    }
  }
  return local.saveLocalProfile(settings)
}
