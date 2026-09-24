import {
  Archive,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Trash2,
} from "lucide-react"
import DostLogo from "../ui/DostLogo"
import UserAvatar from "../ui/UserAvatar"
import LanguageToggle from "../ui/LanguageToggle"
import { useLanguage } from "../../i18n/LanguageContext"
import { NAV_ITEMS } from "./navItems"

export default function NeoDock({
  page,
  onNavigate,
  user,
  onRequestLogout,
  onAdd,
  archivedCount = 0,
}) {
  const { t } = useLanguage()

  return (
    <>
      <div className="neo-dock-user-mobile">
        <UserAvatar user={user} className="h-8 w-8" />
        <div className="neo-dock-user-mobile-copy">
          <p>{user.displayName}</p>
          <span>{user.role}</span>
        </div>
        <LanguageToggle compact />
      </div>

      <div className="neo-dock-wrap">
        <nav className="neo-dock" aria-label="Main navigation">
          <button
            type="button"
            className="neo-dock-logo"
            onClick={() => onNavigate("dashboard")}
            aria-label={t("nav.home")}
          >
            <DostLogo className="h-7 w-7" />
          </button>

          <div className="neo-dock-links">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`neo-dock-link ${active ? "neo-dock-link-active" : ""}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="neo-dock-link-label">{t(item.labelKey)}</span>
                  {item.id === "archived" && archivedCount > 0 ? (
                    <span className="neo-dock-badge">{archivedCount}</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="neo-dock-end">
            {page === "cases" && onAdd ? (
              <button type="button" className="neo-dock-fab" onClick={onAdd} aria-label={t("page.addCase")}>
                <Plus className="h-5 w-5" />
              </button>
            ) : null}
            <div className="neo-dock-user">
              <UserAvatar user={user} className="h-8 w-8" />
              <LanguageToggle compact />
              <button
                type="button"
                className="neo-dock-logout"
                onClick={onRequestLogout}
                aria-label={t("nav.signOut")}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
