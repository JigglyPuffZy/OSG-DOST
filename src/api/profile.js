import { supabase } from "../lib/supabase"
import { defaultSettings } from "../utils/settings"
import { mapProfileToSettings, mapSettingsToProfile } from "./caseMapping"

function requireClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured.")
  }
  return supabase
}

export async function ensureProfile(user) {
  const client = requireClient()
  const userId = user.id
  const emailName = user.email?.split("@")[0] || defaultSettings.displayName

  const { data: linked, error: linkedError } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (linkedError) throw new Error(linkedError.message)
  if (linked) return mapProfileToSettings(linked)

  const { data: orphan, error: orphanError } = await client
    .from("profiles")
    .select("*")
    .is("user_id", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (orphanError) throw new Error(orphanError.message)

  if (orphan) {
    const { data: updated, error: updateError } = await client
      .from("profiles")
      .update({ user_id: userId })
      .eq("id", orphan.id)
      .select("*")
      .single()

    if (updateError) throw new Error(updateError.message)
    return mapProfileToSettings(updated)
  }

  const { data: created, error: createError } = await client
    .from("profiles")
    .insert({
      user_id: userId,
      display_name: emailName,
      role: defaultSettings.role,
      organization: defaultSettings.organization,
      start_page: defaultSettings.startPage,
      compact_table: defaultSettings.compactTable,
      keep_local_data: false,
    })
    .select("*")
    .single()

  if (createError) throw new Error(createError.message)
  return mapProfileToSettings(created)
}

export async function saveProfile(settings) {
  const client = requireClient()
  if (!settings.profileId) {
    throw new Error("Profile is not loaded.")
  }

  const { data, error } = await client
    .from("profiles")
    .update(mapSettingsToProfile(settings))
    .eq("id", settings.profileId)
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  return mapProfileToSettings(data)
}
