import { supabase } from "../lib/supabase"
import { createCaseId, normalizeCaseRecord } from "../utils/caseHelpers"
import { mapCaseToRow, mapRowToCase, mergeCasePayload } from "./caseMapping"

function requireClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.")
  }
  return supabase
}

function throwDbError(error, context = "Database request failed") {
  const parts = [error?.message, error?.details, error?.hint].filter(Boolean)
  throw new Error(parts.length ? parts.join(" — ") : context)
}

export async function fetchAllCases() {
  const client = requireClient()
  const { data, error } = await client.from("cases_full").select("*")

  if (error) throwDbError(error, "Could not load cases")
  return (data || [])
    .map(mapRowToCase)
    .map(normalizeCaseRecord)
    .sort((a, b) => String(b.lastUpdated || "").localeCompare(String(a.lastUpdated || "")))
}

export async function fetchCaseStats() {
  const client = requireClient()
  const { data, error } = await client.from("case_stats").select("*").maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) {
    return {
      total: 0,
      pending: 0,
      ongoing: 0,
      closed: 0,
      archived: 0,
      withoutNumber: 0,
    }
  }
  return {
    total: data.total,
    pending: data.pending,
    ongoing: data.ongoing,
    closed: data.closed,
    archived: data.archived,
    withoutNumber: data.without_number,
  }
}

async function replaceStatusUpdates(caseDbId, updates) {
  const client = requireClient()
  const { error: deleteError } = await client
    .from("case_status_updates")
    .delete()
    .eq("case_id", caseDbId)

  if (deleteError) throwDbError(deleteError, "Could not clear previous remarks")

  const bodies = (updates || [])
    .map((line) => String(line ?? "").trim())
    .filter(Boolean)
  if (!bodies.length) return

  const rows = bodies.map((body, index) => ({
    case_id: caseDbId,
    sort_order: index + 1,
    body,
  }))

  const { error: insertError } = await client.from("case_status_updates").insert(rows)
  if (insertError) throwDbError(insertError, "Could not save remarks")
}

async function insertActivity(caseDbId, activityEntries) {
  if (!activityEntries?.length) return

  const client = requireClient()
  const rows = activityEntries.map((entry) => ({
    case_id: caseDbId,
    occurred_on: entry.date,
    label: entry.label,
  }))

  const { error } = await client.from("case_activity").insert(rows)
  if (error) throw new Error(error.message)
}

export async function createCase(payload, activity) {
  const client = requireClient()
  const code = createCaseId()
  const row = mapCaseToRow(payload, code)

  const { data: created, error } = await client
    .from("cases")
    .insert(row)
    .select("id, code")
    .single()

  if (error) throw new Error(error.message)

  await replaceStatusUpdates(created.id, payload.updates)
  await insertActivity(created.id, activity)

  const { data: full, error: fetchError } = await client
    .from("cases_full")
    .select("*")
    .eq("id", created.id)
    .single()

  if (fetchError) throw new Error(fetchError.message)
  return mapRowToCase(full)
}

async function resolveCaseDbId(client, previous) {
  if (previous.dbId) return previous.dbId
  const { data: match, error: lookupError } = await client
    .from("cases")
    .select("id")
    .eq("code", previous.id)
    .single()
  if (lookupError) throw new Error(lookupError.message)
  return match.id
}

export async function updateCase(previous, payload, activity) {
  const client = requireClient()
  const merged = mergeCasePayload(previous, payload)
  if (Object.prototype.hasOwnProperty.call(payload, "updates")) {
    const updates = Array.isArray(payload.updates) ? payload.updates : []
    merged.updates = updates
    merged.remarks = updates[0] || merged.remarks || null
  }

  const row = mapCaseToRow(merged, previous.id)
  const { code: _ignoredCode, ...updateFields } = row

  const { error } = await client.from("cases").update(updateFields).eq("code", previous.id)
  if (error) throwDbError(error, "Could not update case")

  const caseDbId = await resolveCaseDbId(client, previous)

  if (Object.prototype.hasOwnProperty.call(payload, "updates")) {
    await replaceStatusUpdates(caseDbId, merged.updates)
  }

  const previousCount = previous.activity?.length || 0
  const newEntries = activity.slice(previousCount)
  await insertActivity(caseDbId, newEntries)

  const { data: full, error: fetchError } = await client
    .from("cases_full")
    .select("*")
    .eq("code", previous.id)
    .single()

  if (fetchError) throw new Error(fetchError.message)
  return mapRowToCase(full)
}

export async function deleteCase(caseCode) {
  const client = requireClient()
  const { error } = await client.from("cases").delete().eq("code", caseCode)
  if (error) throw new Error(error.message)
}
