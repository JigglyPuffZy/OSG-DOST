import { Calendar, Clock3, Scale, TriangleAlert } from "lucide-react"
import {
  daysUntil,
  formatDateShort,
  hasCaseNumber,
  isPreCourtStage,
  resolveCaseHearingDate,
} from "../utils/caseHelpers"
import { useLanguage } from "../i18n/LanguageContext"

export default function CaseMetaChips({ caseItem, showSoonBadge = true, compactLabels = false }) {
  const { t } = useLanguage()
  const hearingDate = resolveCaseHearingDate(caseItem)
  const hearingDays = hearingDate ? daysUntil(hearingDate) : null
  const hearingPast = hearingDays !== null && hearingDays < 0
  const hearingSoon = hearingDays !== null && hearingDays >= 0 && hearingDays <= 3
  const preCourt = isPreCourtStage(caseItem)
  const noDocketLabel = compactLabels ? t("cases.noDocketShort") : t("cases.noDocket")

  return (
    <div className="case-card-meta">
      {hasCaseNumber(caseItem) ? (
        <span className="case-chip case-chip-docket font-semibold text-slate-800">
          {caseItem.caseNumber}
        </span>
      ) : preCourt ? (
        <span className="case-chip case-chip-stage">
          <Scale className="h-3 w-3 shrink-0" />
          {t("cases.notYetFiled")}
        </span>
      ) : (
        <span className="case-chip case-chip-warn">
          <TriangleAlert className="h-3 w-3" />
          {noDocketLabel}
        </span>
      )}

      {hearingDate ? (
        <span className={`case-chip case-chip-hearing ${hearingSoon ? "case-chip-hearing-urgent" : ""} ${hearingPast ? "case-chip-hearing-past" : ""}`}>
          <Calendar className="h-3 w-3 shrink-0" />
          <span className="case-chip-label">
            {hearingPast ? t("cases.lastHearing") : t("cases.hearing")}
          </span>
          <span className="case-chip-value">{formatDateShort(hearingDate)}</span>
          {showSoonBadge && hearingDays !== null && hearingDays >= 0 && hearingDays <= 7 ? (
            <span className="case-chip-soon">
              {hearingDays === 0
                ? t("hearing.today")
                : hearingDays === 1
                  ? t("hearing.tomorrow")
                  : t("hearing.daysLeft", { count: hearingDays })}
            </span>
          ) : null}
        </span>
      ) : preCourt ? (
        <span className="case-chip case-chip-stage">
          <Calendar className="h-3 w-3 shrink-0" />
          {t("cases.preLitigationStage")}
        </span>
      ) : (
        <span className="case-chip case-chip-no-hearing">
          <Calendar className="h-3 w-3 shrink-0" />
          <span className="case-chip-label">{t("cases.noHearing")}</span>
        </span>
      )}

      <span className="case-chip case-chip-updated">
        <Clock3 className="h-3 w-3 shrink-0" />
        <span className="case-chip-label">{t("cases.updated")}</span>
        <span className="case-chip-value">{formatDateShort(caseItem.lastUpdated)}</span>
      </span>
    </div>
  )
}
