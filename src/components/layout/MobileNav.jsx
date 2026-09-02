import { Archive, Briefcase, LayoutDashboard, Settings } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"

const items = [
  { id: "dashboard", labelKey: "nav.home", icon: LayoutDashboard },
  { id: "cases", labelKey: "nav.cases", icon: Briefcase },
  { id: "archived", labelKey: "nav.archived", icon: Archive },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
]

export default function MobileNav({ page, onNavigate }) {
  const { t } = useLanguage()

  return (
    <nav
      className="fixed inset-x-2 bottom-3 z-40 rounded-2xl border border-slate-200 bg-white px-0.5 py-1 shadow-lg shadow-slate-200/60 lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-[9px] font-semibold ${
                  active ? "text-dost-600" : "text-slate-400"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${active ? "text-dost-500" : ""}`} />
                {t(item.labelKey)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
