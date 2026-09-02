import {
  Hash,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { STATUS_OPTIONS } from "../data/cases"
import Button from "./ui/Button"
import { getActiveFilterChips } from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"

function PillGroup({ options, value, onChange, nowrap = false }) {
  return (
    <div className={`filter-pill-group ${nowrap ? "filter-pill-group-nowrap" : ""}`}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`filter-pill ${active ? "filter-pill-active" : ""}`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function ActiveFilterBar({ chips, onRemoveChip, onClear, clearLabel }) {
  if (chips.length === 0) return null

  return (
    <div className="filter-active-bar">
      <div className="filter-active-chips">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => onRemoveChip(chip.key)}
            className="filter-active-chip"
          >
            {chip.label}
            <X className="h-3 w-3" />
          </button>
        ))}
      </div>
      <button type="button" onClick={onClear} className="filter-clear-btn">
        {clearLabel}
      </button>
    </div>
  )
}

function MobileFilterSheet({ open, onClose, children, title }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="filter-sheet absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl">
        <div className="mx-auto mb-2 mt-3 h-1 w-10 rounded-full bg-slate-200" />
        <div className="px-5 pb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function CaseFilters({
  filters,
  resultCount,
  totalCount,
  onChange,
  onApply,
  onClear,
  mobileOpen,
  onCloseMobile,
  layout = "bar",
  hideStatus = false,
  title,
}) {
  const { t } = useLanguage()
  const panelTitle = title || t("filters.title")
  const chips = getActiveFilterChips(filters, t)

  const numberOptions = [
    { value: "all", label: t("filters.all") },
    { value: "with", label: t("filters.hasDocket") },
    { value: "without", label: t("filters.noDocket") },
  ]
  const isSidebar = layout === "sidebar"
  const isPageLayout = layout === "page"
  const hasActiveFilters = chips.length > 0

  const removeChip = (key) => {
    const next = { ...filters }
    if (key === "search") next.search = ""
    if (key === "status") next.status = "all"
    if (key === "caseNumber") next.caseNumber = "all"
    onChange(next)
  }

  const statusOptions = [
    { value: "all", label: t("filters.all") },
    ...STATUS_OPTIONS.filter((s) => s !== "Archived").map((s) => ({
      value: s,
      label: t(`status.${s}`),
    })),
  ]

  const panelHeader = (
    <div className="filter-panel-header">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="filter-panel-icon">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h2 className="text-sm font-bold text-slate-900">{panelTitle}</h2>
            <span className="text-xs font-medium text-slate-400">
              <span className="font-bold tabular-nums text-dost-600">{resultCount}</span>
              {" of "}
              <span className="tabular-nums">{totalCount}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">{t("filters.narrow")}</p>
        </div>
      </div>
    </div>
  )

  const searchField = (
    <div className="filter-search-wrap">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder={t("filters.searchPlaceholder")}
        className="filter-search-input"
      />
    </div>
  )

  const statusField = !hideStatus ? (
    <div className="filter-group">
      <p className="filter-group-label">{t("filters.status")}</p>
      <PillGroup
        options={statusOptions}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
        nowrap
      />
    </div>
  ) : null

  const docketField = (
    <div className="filter-group">
      <p className="filter-group-label">
        <Hash className="h-3 w-3 text-dost-500" strokeWidth={2} />
        {t("filters.docket")}
      </p>
      <PillGroup
        options={numberOptions}
        value={filters.caseNumber}
        onChange={(caseNumber) => onChange({ ...filters, caseNumber })}
        nowrap
      />
    </div>
  )

  const renderMobileActions = (showApply) =>
    showApply ? (
      <div className="flex gap-2 pt-1">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => {
            onApply?.()
            onCloseMobile?.()
          }}
        >
          {t("filters.apply")}
        </Button>
        {hasActiveFilters ? (
          <Button size="sm" onClick={onClear}>
            {t("filters.clearAll")}
          </Button>
        ) : null}
      </div>
    ) : null

  const renderCompactForm = ({ showApply = false } = {}) => (
    <div className="filter-panel-body filter-panel-compact">
      <div className="filter-search-row">
        <p className="filter-group-label">
          <Search className="h-3 w-3 text-dost-500" strokeWidth={2} />
          {t("filters.search")}
        </p>
        {searchField}
      </div>

      <div className="filter-groups-row">
        {statusField}
        {docketField}
      </div>

      <ActiveFilterBar
        chips={chips}
        onRemoveChip={removeChip}
        onClear={onClear}
        clearLabel={t("filters.clearAll")}
      />
      {renderMobileActions(showApply)}
    </div>
  )

  const renderStackedForm = ({ showApply = false } = {}) => (
    <div className="filter-panel-body">
      <div className="filter-section">
        <p className="filter-section-title">
          <Search className="h-3.5 w-3.5 text-dost-500" strokeWidth={2} />
          {t("filters.search")}
        </p>
        {searchField}
      </div>

      {!hideStatus ? (
        <div className="filter-section">
          <p className="filter-section-title">{t("filters.status")}</p>
          <PillGroup
            options={statusOptions}
            value={filters.status}
            onChange={(status) => onChange({ ...filters, status })}
          />
        </div>
      ) : null}

      <div className="filter-section">
        <p className="filter-section-title">
          <Hash className="h-3.5 w-3.5 text-dost-500" strokeWidth={2} />
          {t("filters.docket")}
        </p>
        <PillGroup
          options={numberOptions}
          value={filters.caseNumber}
          onChange={(caseNumber) => onChange({ ...filters, caseNumber })}
        />
      </div>

      <ActiveFilterBar
        chips={chips}
        onRemoveChip={removeChip}
        onClear={onClear}
        clearLabel={t("filters.clearAll")}
      />

      {renderMobileActions(showApply)}
    </div>
  )

  if (isSidebar) {
    return (
      <>
        <aside className="filter-panel sticky top-6 hidden lg:block">
          {panelHeader}
          {renderStackedForm()}
        </aside>

        <MobileFilterSheet open={mobileOpen} onClose={onCloseMobile} title={panelTitle}>
          {renderStackedForm()}
        </MobileFilterSheet>
      </>
    )
  }

  if (isPageLayout) {
    return (
      <>
        <div className="filter-panel hidden lg:block">
          {panelHeader}
          {renderCompactForm()}
        </div>

        <MobileFilterSheet open={mobileOpen} onClose={onCloseMobile} title={panelTitle}>
          {renderStackedForm({ showApply: true })}
        </MobileFilterSheet>
      </>
    )
  }

  return (
    <div className="filter-panel">
      {panelHeader}
      {renderStackedForm({ showApply: true })}
    </div>
  )
}
