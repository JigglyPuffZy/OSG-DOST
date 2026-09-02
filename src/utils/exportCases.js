import * as XLSX from "xlsx"
import {
  displayCaseNumber,
  displayCourt,
  formatDate,
  getStatusUpdates,
  paymentBalance,
  sortCasesForDisplay,
} from "./caseHelpers"

const COLUMNS = [
  { key: "no", header: "No.", width: 6 },
  { key: "caseTitle", header: "Case Title", width: 36 },
  { key: "caseType", header: "Case Type", width: 22 },
  { key: "docket", header: "Docket", width: 14 },
  { key: "court", header: "Court", width: 22 },
  { key: "status", header: "Status", width: 12 },
  { key: "paymentStatus", header: "Payment Status", width: 16 },
  { key: "amountDue", header: "Amount Due (PHP)", width: 16 },
  { key: "amountPaid", header: "Amount Paid (PHP)", width: 16 },
  { key: "balance", header: "Balance (PHP)", width: 16 },
  { key: "filingDate", header: "Filing Date", width: 14 },
  { key: "lastUpdated", header: "Last Updated", width: 14 },
  { key: "hearingDate", header: "Hearing Date", width: 14 },
  { key: "parties", header: "Parties", width: 40 },
  { key: "latestRemark", header: "Latest Remark", width: 36 },
  { key: "statusRemarks", header: "Status / Remarks", width: 48 },
  { key: "caseSummary", header: "Case Summary", width: 52 },
]

function formatExportDate(value) {
  if (!value) return ""
  return formatDate(value)
}

function formatAmount(value) {
  const amount = Number(value) || 0
  return amount
}

function caseToRow(item, index) {
  const updates = getStatusUpdates(item)
  const latestRemark = updates[0] || item.remarks || ""

  return {
    no: index + 1,
    caseTitle: item.caseTitle || "",
    caseType: item.caseType || "",
    docket: displayCaseNumber(item),
    court: displayCourt(item),
    status: item.status || "",
    paymentStatus: item.paymentStatus || "Not required",
    amountDue: formatAmount(item.amountDue),
    amountPaid: formatAmount(item.amountPaid),
    balance: formatAmount(paymentBalance(item)),
    filingDate: formatExportDate(item.filingDate),
    lastUpdated: formatExportDate(item.lastUpdated),
    hearingDate: formatExportDate(item.hearingDate),
    parties: item.parties || "",
    latestRemark,
    statusRemarks: updates.length ? updates.map((line) => `• ${line}`).join("\n") : "",
    caseSummary: (item.story || "").replace(/\r\n/g, "\n").trim(),
  }
}

function buildSheetRows(cases) {
  const headerRow = COLUMNS.map((col) => col.header)
  const dataRows = sortCasesForDisplay(cases).map((item, index) => {
    const row = caseToRow(item, index)
    return COLUMNS.map((col) => row[col.key])
  })
  return [headerRow, ...dataRows]
}

export function exportCasesToExcel(cases, filename = "osg-dost-cases.xlsx") {
  const rows = buildSheetRows(cases)
  const worksheet = XLSX.utils.aoa_to_sheet(rows)

  worksheet["!cols"] = COLUMNS.map((col) => ({ wch: col.width }))
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft" }
  worksheet["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: Math.max(rows.length - 1, 0), c: COLUMNS.length - 1 },
    }),
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Case Docket")

  const infoRows = [
    ["OSG DOST Task Force — Case Export"],
    ["Exported", new Date().toLocaleString("en-PH")],
    ["Total cases", cases.length],
    [],
  ]
  const infoSheet = XLSX.utils.aoa_to_sheet(infoRows)
  infoSheet["!cols"] = [{ wch: 28 }, { wch: 36 }]
  XLSX.utils.book_append_sheet(workbook, infoSheet, "Export Info")

  XLSX.writeFile(workbook, filename)
}
