import { supabase } from "../lib/supabase"
import { createCaseId } from "../utils/caseHelpers"
import { mapCaseToRow, mapRowToCase } from "./caseMapping"

function requireClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.")
  }
  return supabase
}

export async function fetchAllCases() {
  const client = requireClient()
  const { data, error } = await client
    .from("cases_full")
    .select("*")
    .order("last_updated", { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map(mapRowToCase)
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

  if (deleteError) throw new Error(deleteError.message)

  if (!updates?.length) return

  const rows = updates.map((body, index) => ({
    case_id: caseDbId,
    sort_order: index + 1,
    body,
  }))

  const { error: insertError } = await client.from("case_status_updates").insert(rows)
  if (insertError) throw new Error(insertError.message)
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

export async function updateCase(previous, payload, activity) {
  const client = requireClient()
  const row = mapCaseToRow(payload, previous.id)

  const { error } = await client.from("cases").update(row).eq("code", previous.id)
  if (error) throw new Error(error.message)

  const caseDbId = previous.dbId
  if (!caseDbId) {
    const { data: match, error: lookupError } = await client
      .from("cases")
      .select("id")
      .eq("code", previous.id)
      .single()
    if (lookupError) throw new Error(lookupError.message)
    await replaceStatusUpdates(match.id, payload.updates)
    const previousCount = previous.activity?.length || 0
    const newEntries = activity.slice(previousCount)
    await insertActivity(match.id, newEntries)
  } else {
    await replaceStatusUpdates(caseDbId, payload.updates)
    const previousCount = previous.activity?.length || 0
    const newEntries = activity.slice(previousCount)
    await insertActivity(caseDbId, newEntries)
  }

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
