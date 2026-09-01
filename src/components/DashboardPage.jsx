import SummaryCards from "./SummaryCards"
import DashboardRecentTable from "./DashboardRecentTable"
import CaseCardList from "./CaseCardList"
import EmptyState from "./EmptyState"

export default function DashboardPage({
  stats,
  recentCases,
  onCardSelect,
  onAdd,
  onView,
  onViewAllCases,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <SummaryCards stats={stats} onSelect={onCardSelect} />

      {recentCases.length === 0 ? (
        <EmptyState variant="empty" onClear={() => {}} onAdd={onAdd} />
      ) : (
        <>
          <DashboardRecentTable
            cases={recentCases}
            onView={onView}
            onViewAll={onViewAllCases}
          />
          <CaseCardList cases={recentCases} onView={onView} />
        </>
      )}
    </div>
  )
}
