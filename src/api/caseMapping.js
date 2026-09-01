export function mapRowToCase(row) {
  const updates = Array.isArray(row.updates) ? row.updates : []
  const activity = Array.isArray(row.activity) ? row.activity : []
  const files = Array.isArray(row.files) ? row.files : []

  return {
    id: row.code,
    dbId: row.id,
    caseTitle: row.case_title,
    caseType: row.case_type,
    caseNumber: row.case_number,
    court: row.court,
    status: row.status,
    remarks: row.remarks,
    filingDate: row.filing_date,
    lastUpdated: row.last_updated,
    hearingDate: row.hearing_date,
    parties: row.parties,
    story: row.story,
    paymentStatus: row.payment_status,
    amountDue: Number(row.amount_due) || 0,
    amountPaid: Number(row.amount_paid) || 0,
    updates,
    activity: activity.map((entry) => ({
      date: entry.date,
      label: entry.label,
    })),
    files: files.map((file) => ({
      id: file.id,
      name: file.name,
      kind: file.kind,
    })),
  }
}

export function mapCaseToRow(payload, code) {
  return {
    code,
    case_title: payload.caseTitle,
    case_type: payload.caseType || "Civil Case",
    case_number: payload.caseNumber || null,
    court: payload.court || null,
    status: payload.status,
    remarks: payload.remarks || null,
    filing_date: payload.filingDate || new Date().toISOString().slice(0, 10),
    last_updated: new Date().toISOString().slice(0, 10),
    hearing_date: payload.hearingDate || null,
    parties: payload.parties || null,
    story: payload.story || null,
    payment_status: payload.paymentStatus,
    amount_due: payload.amountDue ?? 0,
    amount_paid: payload.amountPaid ?? 0,
  }
}

export function mapProfileToSettings(row) {
  if (!row) return null
  return {
    profileId: row.id,
    displayName: row.display_name,
    role: row.role,
    organization: row.organization,
    startPage: row.start_page,
    compactTable: row.compact_table,
    keepLocalData: row.keep_local_data,
  }
}

export function mapSettingsToProfile(settings) {
  return {
    display_name: settings.displayName,
    role: settings.role,
    organization: settings.organization,
    start_page: settings.startPage,
    compact_table: settings.compactTable,
    keep_local_data: settings.keepLocalData,
  }
}
