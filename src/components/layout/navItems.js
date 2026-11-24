import { Archive, Briefcase, LayoutDashboard, Settings, Trash2 } from "lucide-react"

export const NAV_ITEMS = [
  { id: "dashboard", labelKey: "nav.home", icon: LayoutDashboard },
  { id: "cases", labelKey: "nav.cases", icon: Briefcase },
  { id: "archived", labelKey: "nav.archived", icon: Archive },
  { id: "deleted", labelKey: "nav.deleted", icon: Trash2 },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
]
