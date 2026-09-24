import { useRef } from "react"
import { FileText, Paperclip, Trash2, Upload } from "lucide-react"
import Button from "./ui/Button"
import { useLanguage } from "../i18n/LanguageContext"

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

function readFile(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`"${file.name}" is too large (max 2 MB).`))
      return
    }
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|webp|doc|docx)$/i)) {
      reject(new Error(`"${file.name}" is not a supported file type.`))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadedAt: new Date().toISOString().slice(0, 10),
        dataUrl: String(reader.result),
      })
    }
    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`))
    reader.readAsDataURL(file)
  })
}

export default function CaseDocuments({ files = [], onChange, readOnly = false }) {
  const { t } = useLanguage()
  const inputRef = useRef(null)
  const list = Array.isArray(files) ? files : []

  const handleFiles = async (event) => {
    const selected = Array.from(event.target.files || [])
    if (!selected.length) return
    try {
      const uploaded = await Promise.all(selected.map(readFile))
      onChange?.([...list, ...uploaded])
    } catch (err) {
      window.alert(err.message)
    } finally {
      event.target.value = ""
    }
  }

  const removeFile = (fileId) => {
    onChange?.(list.filter((item) => item.id !== fileId))
  }

  const openFile = (file) => {
    if (file.dataUrl) {
      window.open(file.dataUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-navy-900">{t("documents.title")}</h2>
        {!readOnly ? (
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              className="hidden"
              onChange={handleFiles}
            />
            <Button size="sm" onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              {t("documents.upload")}
            </Button>
          </>
        ) : null}
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-navy-200 bg-navy-50/40 px-4 py-6 text-center text-sm text-navy-500">
          <Paperclip className="mx-auto mb-2 h-5 w-5 text-navy-400" />
          {t("documents.empty")}
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((file) => (
            <li key={file.id} className="document-row">
              <button type="button" onClick={() => openFile(file)} className="document-row-main">
                <FileText className="h-4 w-4 shrink-0 text-dost-600" />
                <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-navy-900">
                  {file.name}
                </span>
                <span className="text-xs text-navy-500">
                  {Math.max(1, Math.round((file.size || 0) / 1024))} KB
                </span>
              </button>
              {!readOnly ? (
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="document-row-delete"
                  aria-label={`Remove ${file.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
