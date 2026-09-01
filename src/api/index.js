import { isSupabaseConfigured } from "../lib/supabase"
import * as remoteCases from "./cases"
import * as remoteProfile from "./profile"
import * as local from "./localBackend"

export const isRemoteBackend = isSupabaseConfigured

function dbSetupMessage(error) {
  const message = error?.message || String(error)
  if (
    message.includes("cases_full") ||
    message.includes("case_stats") ||
    message.includes("relation") ||
    message.includes("schema cache")
  ) {
    return "Database not set up. In Supabase SQL Editor, run the full supabase/schema.sql file, then refresh."
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

export async function fetchCaseStats() {
  if (isRemoteBackend) {
    try {
      return await remoteCases.fetchCaseStats()
    } catch (error) {
      throw new Error(dbSetupMessage(error))
    }
  }
  const cases = await local.fetchAllCases()
  return {
    total: cases.length,
    pending: cases.filter((c) => c.status === "Pending").length,
    ongoing: cases.filter((c) => c.status === "Ongoing").length,
    closed: cases.filter((c) => c.status === "Closed").length,
    archived: cases.filter((c) => c.status === "Archived").length,
    withoutNumber: cases.filter(
      (c) => !c.caseNumber || String(c.caseNumber).trim() === "",
    ).length,
  }
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
