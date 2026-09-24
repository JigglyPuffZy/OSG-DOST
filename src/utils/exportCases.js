import * as XLSX from "xlsx"
import {
  displayCaseNumber,
  displayCourt,
  formatDate,
  formatMoney,
  getAccomplishmentEntries,
  getPaymentSummary,
  getStatusUpdates,
  normalizeStatus,
  paymentBalance,
  sortCasesForDisplay,
} from "./caseHelpers"

const COLUMNS = [
  { key: "no", header: "No.", width: 6 },
  { key: "caseTitle", header: "Case Title", width: 36 },
  { key: "caseType", header: "Case Type", width: 22 },
  { key: "docket", header: "Docket", width: 14 },
  { key: "court", header: "Court", width: 22 },
  { key: "assignedTo", header: "Assigned To", width: 22 },
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
  return Number(value) || 0
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
    assignedTo: item.assignedTo || "",
    status: normalizeStatus(item.status),
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

function applySheetStyle(worksheet, rowCount) {
  worksheet["!cols"] = COLUMNS.map((col) => ({ wch: col.width }))
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft" }
  worksheet["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: Math.max(rowCount - 1, 0), c: COLUMNS.length - 1 },
    }),
  }
}

export function exportCasesToExcel(cases, filename = "osg-dost-cases.xlsx") {
  const rows = buildSheetRows(cases)
  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  applySheetStyle(worksheet, rows.length)

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

export function exportAccomplishmentReport(cases, filename) {
  const stamp = new Date().toISOString().slice(0, 10)
  const name = filename || `osg-dost-accomplishment-${stamp}.xlsx`
  const entries = getAccomplishmentEntries(cases, 30)

  const rows = [
    ["OSG DOST Task Force — Accomplishment Report (Last 30 Days)"],
    ["Generated", new Date().toLocaleString("en-PH")],
    ["Cases updated", entries.length],
    [],
    ["No.", "Case Title", "Docket", "Status", "Assigned To", "Last Updated", "Updates"],
    ...entries.map((entry, index) => [
      index + 1,
      entry.title,
      entry.docket,
      entry.status,
      entry.assignedTo,
      formatExportDate(entry.lastUpdated),
      entry.updates.join("\n"),
    ]),
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  worksheet["!cols"] = [6, 36, 14, 12, 22, 14, 48].map((wch) => ({ wch }))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Accomplishment")
  XLSX.writeFile(workbook, name)
}

export function exportPaymentSummary(cases, filename) {
  const stamp = new Date().toISOString().slice(0, 10)
  const name = filename || `osg-dost-payments-${stamp}.xlsx`
  const summary = getPaymentSummary(cases)

  const rows = [
    ["OSG DOST Task Force — Payment Summary"],
    ["Generated", new Date().toLocaleString("en-PH")],
    [],
    ["Metric", "Value"],
    ["Total amount due", summary.totalDue],
    ["Total amount paid", summary.totalPaid],
    ["Outstanding balance", summary.totalBalance],
    ["Unpaid cases", summary.unpaidCount],
    ["Partial payment cases", summary.partialCount],
    ["Fully paid cases", summary.paidCount],
    [],
    ["Case Title", "Docket", "Status", "Payment Status", "Due", "Paid", "Balance"],
    ...sortCasesForDisplay(cases)
      .filter((item) => normalizeStatus(item.status) !== "Archived")
      .map((item) => [
        item.caseTitle,
        displayCaseNumber(item),
        normalizeStatus(item.status),
        item.paymentStatus || "Not required",
        Number(item.amountDue) || 0,
        Number(item.amountPaid) || 0,
        paymentBalance(item),
      ]),
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  worksheet["!cols"] = [36, 14, 12, 16, 14, 14, 14].map((wch) => ({ wch }))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments")
  XLSX.writeFile(workbook, name)
}

export function exportCasesSubsetToExcel(cases, filename) {
  exportCasesToExcel(cases, filename)
}

export function downloadJsonBackup(cases, settings) {
  const stamp = new Date().toISOString().slice(0, 10)
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    cases,
    settings,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `osg-dost-backup-${stamp}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function parseJsonBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (!Array.isArray(data.cases)) {
          reject(new Error("Invalid backup file: missing cases array."))
          return
        }
        resolve(data)
      } catch {
        reject(new Error("Could not read backup file."))
      }
    }
    reader.onerror = () => reject(new Error("Could not read backup file."))
    reader.readAsText(file)
  })
}
