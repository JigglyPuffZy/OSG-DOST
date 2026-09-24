import {
  Archive,
  LogOut,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react"
import { useState } from "react"
import DostLogo from "../ui/DostLogo"
import UserAvatar from "../ui/UserAvatar"
import LanguageToggle from "../ui/LanguageToggle"
import { useLanguage } from "../../i18n/LanguageContext"
import { NAV_ITEMS } from "./navItems"

const dockItems = NAV_ITEMS.filter((item) => item.id !== "settings" && item.id !== "deleted")

export default function AuraShell({
  page,
  onNavigate,
  user,
  onRequestLogout,
  onAdd,
  archivedCount = 0,
  children,
}) {
  const { t } = useLanguage()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const go = (id) => {
    onNavigate(id)
    setDrawerOpen(false)
  }

  return (
    <div className="aura-app">
      <div className="aura-mesh" aria-hidden="true" />

      <aside className="aura-rail" aria-label="Navigation">
        <button type="button" className="aura-rail-brand" onClick={() => go("dashboard")} aria-label={t("nav.home")}>
          <DostLogo className="h-7 w-7 brightness-0 invert" />
        </button>

        <nav className="aura-rail-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = page === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={`aura-rail-link ${active ? "aura-rail-link-active" : ""}`}
                title={t(item.labelKey)}
                aria-label={t(item.labelKey)}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                {item.id === "archived" && archivedCount > 0 ? (
                  <span className="aura-rail-badge">{archivedCount}</span>
                ) : null}
              </button>
            )
          })}
        </nav>

        <div className="aura-rail-foot">
          <LanguageToggle compact />
          <button type="button" className="aura-rail-avatar" onClick={() => setDrawerOpen(true)} aria-label="Account menu">
            <UserAvatar user={user} className="h-9 w-9" />
          </button>
        </div>
      </aside>

      <nav className="aura-dock lg:hidden" aria-label="Mobile navigation">
        {dockItems.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`aura-dock-link ${active ? "aura-dock-link-active" : ""}`}
              aria-label={t(item.labelKey)}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
        {onAdd ? (
          <button type="button" className="aura-dock-link aura-dock-add" onClick={onAdd} aria-label={t("page.addCase")}>
            <Plus className="h-5 w-5" />
          </button>
        ) : null}
        <button
          type="button"
          className={`aura-dock-link ${page === "settings" ? "aura-dock-link-active" : ""}`}
          onClick={() => go("settings")}
          aria-label={t("nav.settings")}
        >
          <Settings className="h-5 w-5" />
        </button>
      </nav>

      <main className="aura-canvas">
        <div className="aura-canvas-inner aura-enter">{children}</div>
      </main>

      {drawerOpen ? (
        <div className="aura-drawer">
          <button type="button" className="aura-sheet-backdrop" aria-label="Close" onClick={() => setDrawerOpen(false)} />
          <aside className="aura-drawer-panel drawer-enter">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} className="h-11 w-11" />
                <div>
                  <p className="font-bold text-slate-900">{user.displayName}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
              </div>
              <button type="button" className="aura-icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    className={`aura-btn aura-btn-ghost justify-start ${page === item.id ? "aura-btn-active" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </button>
                )
              })}
            </div>
            <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 p-4">
              {onAdd ? (
                <button type="button" className="aura-btn aura-btn-primary" onClick={() => { onAdd(); setDrawerOpen(false) }}>
                  <Plus className="h-4 w-4" />
                  {t("page.addCase")}
                </button>
              ) : null}
              <button type="button" className="aura-btn aura-btn-ghost" onClick={onRequestLogout}>
                <LogOut className="h-4 w-4" />
                {t("nav.signOut")}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
