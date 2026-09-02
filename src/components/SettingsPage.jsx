import {
  Check,
  Database,
  Download,
  Globe,
  Layout,
  Monitor,
  User,
} from "lucide-react"
import Button from "./ui/Button"
import UserAvatar from "./ui/UserAvatar"
import LanguageToggle from "./ui/LanguageToggle"
import { initialsFromName, PROFILE_AVATAR_URL } from "../utils/settings"
import { useLanguage } from "../i18n/LanguageContext"

function SettingsSwitch({ checked, onChange, label, hint }) {
  return (
    <label className="settings-toggle-row">
      <span className="settings-toggle-copy">
        <span className="settings-toggle-label">{label}</span>
        {hint ? <span className="settings-toggle-hint">{hint}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`settings-switch ${checked ? "settings-switch-on" : ""}`}
      >
        <span className="settings-switch-thumb" />
      </button>
    </label>
  )
}

function SettingsCard({ icon: Icon, title, description, children, className = "" }) {
  return (
    <section className={`settings-card ${className}`}>
      <header className="settings-card-header">
        <Icon className="settings-card-icon-simple h-4 w-4" strokeWidth={2} />
        <div className="min-w-0">
          <h2 className="settings-card-title">{title}</h2>
          {description ? (
            <p className="settings-card-desc">{description}</p>
          ) : null}
        </div>
      </header>
      <div className="settings-card-body">{children}</div>
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
  const { t } = useLanguage()
  const update = (field, value) => onChange({ ...settings, [field]: value })
  const profileUser = {
    displayName: settings.displayName,
    initials: initialsFromName(settings.displayName),
    avatarUrl: settings.avatarUrl || PROFILE_AVATAR_URL,
  }

  return (
    <div className="settings-page animate-fade-in">
      <section className="settings-hero">
        <div className="settings-hero-aurora" aria-hidden="true">
          <span className="summary-aurora summary-aurora-a" />
          <span className="summary-aurora summary-aurora-b" />
          <span className="summary-aurora summary-aurora-c" />
        </div>
        <div className="settings-hero-inner">
          <div className="settings-hero-copy">
            <span className="settings-hero-badge">
              {t("page.settings")}
            </span>
            <p className="settings-hero-sub">
              {remoteData ? t("settings.autoSaveRemote") : t("settings.autoSaveLocal")}
            </p>
          </div>
          {saved ? (
            <span className="settings-saved-pill">
              <Check className="h-3.5 w-3.5" />
              {t("app.saved")}
            </span>
          ) : null}
        </div>
      </section>

      <SettingsCard
        icon={User}
        title={t("settings.profile")}
        description={t("settings.profileDesc")}
        className="settings-card-profile"
      >
        <div className="settings-profile-banner">
          <div className="settings-avatar-ring">
            <UserAvatar user={profileUser} className="h-20 w-20" />
          </div>
          <div className="settings-profile-meta">
            <p className="settings-profile-name">{settings.displayName}</p>
            <p className="settings-profile-role">{settings.role}</p>
            <p className="settings-profile-org">{settings.organization}</p>
          </div>
        </div>
        <div className="settings-field-grid">
          <label className="field-label">
            {t("settings.displayName")}
            <input
              value={settings.displayName}
              onChange={(event) => update("displayName", event.target.value)}
              className="field-input"
            />
          </label>
          <label className="field-label">
            {t("settings.role")}
            <input
              value={settings.role}
              onChange={(event) => update("role", event.target.value)}
              className="field-input"
            />
          </label>
        </div>
      </SettingsCard>

      <div className="settings-grid">
        <SettingsCard
          icon={Layout}
          title={t("settings.workspace")}
          description={t("settings.workspaceDesc")}
        >
          <label className="field-label">
            {t("settings.startOn")}
            <select
              value={settings.startPage}
              onChange={(event) => update("startPage", event.target.value)}
              className="field-input"
            >
              <option value="dashboard">{t("settings.startHome")}</option>
              <option value="cases">{t("settings.startCases")}</option>
            </select>
          </label>
        </SettingsCard>

        <SettingsCard
          icon={Globe}
          title={t("settings.language")}
          description={t("settings.languageDesc")}
        >
          <div className="settings-lang-row">
            <div>
              <p className="settings-lang-label">
                {t("settings.english")} / {t("settings.tagalog")}
              </p>
              <p className="settings-lang-hint">{t("settings.languageDesc")}</p>
            </div>
            <LanguageToggle />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Monitor}
          title={t("settings.display")}
          description={t("settings.displayDesc")}
        >
          <SettingsSwitch
            checked={settings.compactTable}
            onChange={(value) => update("compactTable", value)}
            label={t("settings.compactList")}
            hint={t("settings.compactListHint")}
          />
        </SettingsCard>

        <SettingsCard
          icon={Database}
          title={t("settings.data")}
          description={t("settings.dataDesc")}
        >
          <div className="settings-data-stack">
            {!remoteData ? (
              <SettingsSwitch
                checked={settings.keepLocalData}
                onChange={(value) => update("keepLocalData", value)}
                label={t("settings.keepLocal")}
                hint={t("settings.keepLocalHint")}
              />
            ) : (
              <p className="settings-data-note">{t("settings.supabaseBackup")}</p>
            )}
            <Button variant="primary" size="md" onClick={onExport} className="settings-export-btn">
              <Download className="h-4 w-4" />
              {t("settings.exportExcel")}
            </Button>
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}
