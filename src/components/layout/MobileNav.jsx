import { Archive, Briefcase, LayoutDashboard, Settings } from "lucide-react"

const items = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "cases", label: "Cases", icon: Briefcase },
  { id: "archived", label: "Archived", icon: Archive },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function MobileNav({ page, onNavigate }) {
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
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
