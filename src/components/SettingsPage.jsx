import {
  Database,
  Download,
  Layout,
  Monitor,
  User,
} from "lucide-react"
import Button from "./ui/Button"
import UserAvatar from "./ui/UserAvatar"
import { initialsFromName } from "../utils/settings"

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-navy-100 bg-white px-4 py-3 transition-colors hover:border-navy-200">
      <span>
        <span className="block text-sm font-medium text-navy-900">{label}</span>
        <span className="mt-0.5 block text-xs text-navy-500">{hint}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded accent-navy-900"
      />
    </label>
  )
}

function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <section className="surface-card overflow-hidden">
      <div className="flex items-start gap-3 border-b border-navy-100 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-navy-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-navy-500">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

export default function SettingsPage({
  settings,
  onChange,
  onExport,
  saved,
  remoteData = false,
}) {
  const update = (field, value) => onChange({ ...settings, [field]: value })
  const profileUser = {
    displayName: settings.displayName,
    initials: initialsFromName(settings.displayName),
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-navy-500">
          {remoteData
            ? "Settings sync to your Supabase profile."
            : "Changes save automatically in this browser."}
        </p>
        {saved ? (
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            Saved
          </span>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsCard
          icon={User}
          title="Profile"
          description="Shown in the sidebar"
        >
          <div className="mb-4 flex items-center gap-4 rounded-xl border border-navy-100 bg-navy-50/50 p-4">
            <UserAvatar user={profileUser} className="h-16 w-16" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-900">
                {settings.displayName}
              </p>
              <p className="truncate text-xs text-navy-500">{settings.role}</p>
              <p className="truncate text-[11px] text-navy-400">
                {settings.organization}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="field-label">
              Display name
              <input
                value={settings.displayName}
                onChange={(event) => update("displayName", event.target.value)}
                className="field-input"
              />
            </label>
            <label className="field-label">
              Role
              <input
                value={settings.role}
                onChange={(event) => update("role", event.target.value)}
                className="field-input"
              />
            </label>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Layout}
          title="Workspace"
          description="Which page opens when you sign in"
        >
          <label className="field-label">
            Start on
            <select
              value={settings.startPage}
              onChange={(event) => update("startPage", event.target.value)}
              className="field-input"
            >
              <option value="dashboard">Home (overview)</option>
              <option value="cases">All Cases</option>
            </select>
          </label>
        </SettingsCard>

        <SettingsCard
          icon={Monitor}
          title="Display"
          description="How the docket appears"
        >
          <Toggle
            checked={settings.compactTable}
            onChange={(value) => update("compactTable", value)}
            label="Compact list"
            hint="Shorter rows and fewer remarks on case cards"
          />
        </SettingsCard>

        <SettingsCard
          icon={Database}
          title="Data"
          description="Export and backup"
        >
          <div className="space-y-3">
            {!remoteData ? (
              <Toggle
                checked={settings.keepLocalData}
                onChange={(value) => update("keepLocalData", value)}
                label="Keep cases in this browser"
                hint="Persist changes after refresh"
              />
            ) : (
              <p className="text-sm text-navy-600">
                Cases are stored in Supabase. Export a JSON backup below.
              </p>
            )}
            <Button size="sm" onClick={onExport}>
              <Download className="h-4 w-4" />
              Export cases
            </Button>
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}
