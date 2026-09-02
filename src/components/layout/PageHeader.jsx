import { Menu, Plus } from "lucide-react"
import Button from "../ui/Button"
import { useLanguage } from "../../i18n/LanguageContext"

const pageKeys = {
  dashboard: "page.home",
  cases: "page.cases",
  archived: "page.archived",
  settings: "page.settings",
}

export default function PageHeader({
  page,
  onOpenMenu,
  onAdd,
  showAdd = false,
  children,
}) {
  const { t } = useLanguage()

  return (
    <header className="page-header-bar flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-slate-600 shadow-sm transition-colors hover:border-dost-200 hover:text-dost-600 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {t(pageKeys[page] || pageKeys.dashboard)}
        </h1>
      </div>

      <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
        {children}
        {showAdd && onAdd && (
          <Button variant="primary" size="lg" onClick={onAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {t("page.addCase")}
          </Button>
        )}
      </div>
    </header>
  )
}
