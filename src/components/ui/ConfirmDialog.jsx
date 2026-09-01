import Button from "./Button"

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="modal-enter w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-navy-900">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
