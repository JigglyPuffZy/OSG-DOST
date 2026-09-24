import { LogOut, Menu, Plus, X } from "lucide-react"
import { useState } from "react"
import DostLogo from "../ui/DostLogo"
import UserAvatar from "../ui/UserAvatar"
import LanguageToggle from "../ui/LanguageToggle"
import { useLanguage } from "../../i18n/LanguageContext"
import { NAV_ITEMS } from "./navItems"

function NavPills({ page, onNavigate, archivedCount, compact = false }) {
  const { t } = useLanguage()

  return (
    <nav
      className={`premium-pills ${compact ? "premium-pills-compact" : ""}`}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const active = page === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`premium-pill ${active ? "premium-pill-active" : ""}`}
          >
            <Icon className="h-4 w-4" />
            {t(item.labelKey)}
            {item.id === "archived" && archivedCount > 0 ? (
              <span className="premium-pill-badge">{archivedCount}</span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

export default function PremiumHeader({
  page,
  onNavigate,
  user,
  onRequestLogout,
  onAdd,
  archivedCount = 0,
}) {
  const { t } = useLanguage()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const go = (id) => {
    onNavigate(id)
    setDrawerOpen(false)
  }

  return (
    <>
      <header className="premium-header">
        <div className="premium-header-bar">
          <div className="premium-header-start">
            <button type="button" className="premium-brand" onClick={() => go("dashboard")}>
              <DostLogo className="h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <p className="premium-brand-title">{t("app.title")}</p>
                <p className="premium-brand-sub">{t("app.taskForce")}</p>
              </div>
            </button>
          </div>

          <div className="premium-header-nav hidden lg:flex">
            <NavPills page={page} onNavigate={go} archivedCount={archivedCount} />
          </div>

          <div className="premium-header-end hidden sm:flex">
            {page === "cases" && onAdd ? (
              <button
                type="button"
                onClick={onAdd}
                className="premium-btn premium-btn-primary premium-btn-sm hidden md:inline-flex"
              >
                <Plus className="h-4 w-4" />
                {t("page.addCase")}
              </button>
            ) : null}
            {page === "cases" && onAdd ? (
              <button
                type="button"
                onClick={onAdd}
                className="premium-icon-btn premium-icon-btn-primary md:hidden"
                aria-label={t("page.addCase")}
                title={t("page.addCase")}
              >
                <Plus className="h-5 w-5" />
              </button>
            ) : null}
            <LanguageToggle compact />
            <div className="premium-header-user">
              <UserAvatar user={user} className="h-9 w-9" />
              <div className="hidden min-w-0 md:block">
                <p className="premium-user-name">{user.displayName}</p>
                <p className="premium-user-role">{user.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRequestLogout}
              className="premium-icon-btn premium-icon-btn-ghost"
              aria-label={t("nav.signOut")}
              title={t("nav.signOut")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="premium-icon-btn sm:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="premium-header-mobile-nav lg:hidden">
          <NavPills page={page} onNavigate={go} archivedCount={archivedCount} compact />
        </div>
      </header>

      {drawerOpen ? (
        <div className="premium-drawer">
          <button
            type="button"
            className="premium-drawer-backdrop"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="premium-drawer-panel drawer-enter">
            <div className="premium-drawer-head">
              <div className="flex items-center gap-3">
                <DostLogo className="h-9 w-9" />
                <div>
                  <p className="premium-brand-title">{t("app.title")}</p>
                  <p className="premium-brand-sub">{t("app.taskForce")}</p>
                </div>
              </div>
              <button
                type="button"
                className="premium-icon-btn"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="premium-drawer-user">
              <UserAvatar user={user} className="h-10 w-10" />
              <div className="min-w-0">
                <p className="premium-user-name">{user.displayName}</p>
                <p className="premium-user-role">{user.role}</p>
              </div>
            </div>

            <NavPills page={page} onNavigate={go} archivedCount={archivedCount} />

            <div className="premium-drawer-foot">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{t("lang.toggle")}</span>
                <LanguageToggle compact />
              </div>
              {onAdd ? (
                <button type="button" className="premium-btn premium-btn-primary premium-btn-block" onClick={() => { onAdd(); setDrawerOpen(false) }}>
                  <Plus className="h-4 w-4" />
                  {t("page.addCase")}
                </button>
              ) : null}
              <button type="button" className="premium-ghost-btn" onClick={onRequestLogout}>
                <LogOut className="h-4 w-4" />
                {t("nav.signOut")}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
