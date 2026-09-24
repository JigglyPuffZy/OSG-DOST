import {
  displayCaseNumber,
  displayCourt,
  formatDate,
  formatMoney,
  getStatusUpdates,
  hasCaseNumber,
  normalizeStatus,
  paymentBalance,
} from "./caseHelpers"

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function printCaseFile(caseItem) {
  const updates = getStatusUpdates(caseItem)
  const activity = caseItem.activity?.length
    ? caseItem.activity
    : [{ date: caseItem.lastUpdated, label: "Case created", actor: "Staff" }]
  const files = Array.isArray(caseItem.files) ? caseItem.files : []

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(caseItem.caseTitle)} — Case File</title>
  <style>
    body { font-family: "Segoe UI", Arial, sans-serif; color: #0f172a; margin: 32px; line-height: 1.5; }
    h1 { font-size: 24px; margin: 0 0 8px; }
    .meta { color: #64748b; font-size: 14px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .label { font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em; }
    .value { margin-top: 4px; font-weight: 600; }
    section { margin-bottom: 24px; }
    h2 { font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    ul { padding-left: 18px; }
    li { margin-bottom: 6px; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(caseItem.caseTitle)}</h1>
  <p class="meta">OSG DOST Task Force · Case File · Printed ${new Date().toLocaleString("en-PH")}</p>
  <div class="grid">
    <div class="box"><div class="label">Docket</div><div class="value">${escapeHtml(hasCaseNumber(caseItem) ? caseItem.caseNumber : "No docket")}</div></div>
    <div class="box"><div class="label">Status</div><div class="value">${escapeHtml(normalizeStatus(caseItem.status))}</div></div>
    <div class="box"><div class="label">Court</div><div class="value">${escapeHtml(displayCourt(caseItem))}</div></div>
    <div class="box"><div class="label">Assigned to</div><div class="value">${escapeHtml(caseItem.assignedTo || "Unassigned")}</div></div>
    <div class="box"><div class="label">Hearing</div><div class="value">${escapeHtml(caseItem.hearingDate ? formatDate(caseItem.hearingDate) : "Not scheduled")}</div></div>
    <div class="box"><div class="label">Last updated</div><div class="value">${escapeHtml(formatDate(caseItem.lastUpdated))}</div></div>
  </div>
  <section><h2>Parties</h2><p>${escapeHtml(caseItem.parties || "Not recorded.")}</p></section>
  <section><h2>Summary</h2><p>${escapeHtml(caseItem.story || "No summary.")}</p></section>
  <section><h2>Payment</h2><p>Status: ${escapeHtml(caseItem.paymentStatus || "Not required")} · Due: ${escapeHtml(formatMoney(caseItem.amountDue))} · Paid: ${escapeHtml(formatMoney(caseItem.amountPaid))} · Balance: ${escapeHtml(formatMoney(paymentBalance(caseItem)))}</p></section>
  <section><h2>Status / Remarks</h2><ul>${updates.map((line) => `<li>${escapeHtml(line)}</li>`).join("") || "<li>None</li>"}</ul></section>
  <section><h2>Documents (${files.length})</h2><ul>${files.map((f) => `<li>${escapeHtml(f.name)}</li>`).join("") || "<li>No documents attached</li>"}</ul></section>
  <section><h2>Activity log</h2><ul>${activity.map((e) => `<li><strong>${escapeHtml(formatDate(e.date))}</strong> — ${escapeHtml(e.label)}${e.actor ? ` <em>(${escapeHtml(e.actor)})</em>` : ""}</li>`).join("")}</ul></section>
</body>
</html>`

  const win = window.open("", "_blank", "noopener,noreferrer")
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  win.print()
}

export function exportCasePdf(caseItem) {
  printCaseFile(caseItem)
}
