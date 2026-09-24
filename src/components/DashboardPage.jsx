import SummaryCards from "./SummaryCards"
import DashboardRecentTable from "./DashboardRecentTable"
import CaseCardList from "./CaseCardList"
import EmptyState from "./EmptyState"
import AttentionPanel from "./AttentionPanel"
import HearingAlerts from "./HearingAlerts"
import HearingCalendar from "./HearingCalendar"
import { getAttentionItems } from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"

export default function DashboardPage({
  cases,
  stats,
  recentCases,
  onCardSelect,
  onAdd,
  onView,
  onViewAllCases,
  onEnableNotifications,
  notificationStatus,
}) {
  const { t } = useLanguage()
  const attentionItems = getAttentionItems(cases, t)

  return (
    <div className="space-y-6 animate-fade-in">
      <SummaryCards stats={stats} onSelect={onCardSelect} />

      <HearingAlerts
        cases={cases}
        onView={onView}
        onEnableNotifications={onEnableNotifications}
        notificationStatus={notificationStatus}
      />

      <HearingCalendar cases={cases} onView={onView} />

      <AttentionPanel items={attentionItems} onView={onView} />

      {recentCases.length === 0 ? (
        <EmptyState variant="empty" onClear={() => {}} onAdd={onAdd} />
      ) : (
        <>
          <DashboardRecentTable cases={recentCases} onView={onView} onViewAll={onViewAllCases} />
          <CaseCardList cases={recentCases} onView={onView} />
        </>
      )}
    </div>
  )
}
