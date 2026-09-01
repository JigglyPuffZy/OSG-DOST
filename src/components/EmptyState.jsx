import { FileSearch, Plus } from "lucide-react"
import Button from "./ui/Button"

export default function EmptyState({ onClear, onAdd, variant = "filtered" }) {
  const isEmpty = variant === "empty"
  const isArchived = variant === "archived"

  const heading = isEmpty
    ? "No cases yet"
    : isArchived
      ? "No archived cases"
      : "No matching cases"

  const description = isEmpty
    ? "Start by adding your first case. You only need a title — add a docket number later if needed."
    : isArchived
      ? "Archived cases will appear here when you archive them from All Cases."
      : "Nothing matched your search or filters. Try different keywords or clear filters to see all cases."

  return (
    <div className="surface-card px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dost-50 to-white text-dost-600 shadow-sm ring-1 ring-dost-100">
        <FileSearch className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h3 className="mt-6 text-lg font-bold text-slate-900">{heading}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {isEmpty && onAdd ? (
          <Button variant="primary" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add your first case
          </Button>
        ) : !isArchived ? (
          <Button size="sm" onClick={onClear}>
            Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  )
}
