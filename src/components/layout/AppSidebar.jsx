import {
  Archive,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react"
import DostLogo from "../ui/DostLogo"
import UserAvatar from "../ui/UserAvatar"
import LanguageToggle from "../ui/LanguageToggle"
import { useLanguage } from "../../i18n/LanguageContext"

export const NAV_ITEMS = [
  { id: "dashboard", labelKey: "nav.home", icon: LayoutDashboard },
  { id: "cases", labelKey: "nav.cases", icon: Briefcase },
  { id: "archived", labelKey: "nav.archived", icon: Archive },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
]

function SidebarContent({ page, onNavigate, user, onRequestLogout, onCloseMobile, archivedCount = 0 }) {
  const { t } = useLanguage()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100/80 px-5 py-5">
        <button
          type="button"
          onClick={() => {
            onNavigate("dashboard")
            onCloseMobile?.()
          }}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <div className="rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100">
            <DostLogo className="h-9 w-9 shrink-0" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold tracking-tight text-slate-900">
              OSG DOST
            </p>
            <p className="truncate text-[11px] font-medium text-dost-600">{t("app.taskForce")}</p>
          </div>
        </button>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Main menu">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id)
                onCloseMobile?.()
              }}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                active
                  ? "bg-gradient-to-r from-dost-500 to-dost-600 text-white shadow-lg shadow-dost-500/25"
                  : "text-slate-600 hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-100"
              }`}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/90"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-dost-500"}`}
              />
              <span className="text-sm font-semibold">{t(item.labelKey)}</span>
              {item.id === "archived" && archivedCount > 0 ? (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {archivedCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} className="h-11 w-11" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user.displayName}</p>
              <p className="truncate text-[11px] leading-snug text-slate-500">{user.role}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500">{t("lang.toggle")}</span>
            <LanguageToggle compact />
          </div>
          <button
            type="button"
            onClick={onRequestLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white py-2 text-sm font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            {t("nav.signOut")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppSidebar({
  page,
  onNavigate,
  user,
  onRequestLogout,
  mobileOpen,
  onCloseMobile,
  archivedCount = 0,
}) {
  return (
    <>
      <aside className="app-sidebar hidden w-[272px] shrink-0 lg:sticky lg:top-0 lg:block lg:h-screen">
        <SidebarContent
          page={page}
          onNavigate={onNavigate}
          user={user}
          onRequestLogout={onRequestLogout}
          archivedCount={archivedCount}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onCloseMobile}
          />
          <aside className="app-sidebar relative h-full w-[min(300px,88vw)] shadow-2xl drawer-enter">
            <SidebarContent
              page={page}
              onNavigate={onNavigate}
              user={user}
              onRequestLogout={onRequestLogout}
              onCloseMobile={onCloseMobile}
              archivedCount={archivedCount}
            />
          </aside>
        </div>
      )}
    </>
  )
}
