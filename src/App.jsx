import { SlidersHorizontal } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createCase, deleteCase, fetchAllCases, replaceAllCases, updateCase, ensureProfile, saveProfile } from "./api"
import AppSidebar from "./components/layout/AppSidebar"
import PageHeader from "./components/layout/PageHeader"
import MobileNav from "./components/layout/MobileNav"
import DashboardPage from "./components/DashboardPage"
import CaseFilters from "./components/CaseFilters"
import CaseTable from "./components/CaseTable"
import CaseCardList from "./components/CaseCardList"
import CaseRecordModal from "./components/CaseRecordModal"
import CaseFormModal from "./components/CaseFormModal"
import SettingsPage from "./components/SettingsPage"
import LoginPage from "./components/LoginPage"
import EmptyState from "./components/EmptyState"
import ConfirmDialog from "./components/ui/ConfirmDialog"
import BulkActionBar from "./components/BulkActionBar"
import {
  buildActivity,
  emptyFilters,
  filterCases,
  findDuplicateDocket,
  getCaseStats,
  getUniqueCourts,
  normalizeCaseRecord,
  normalizeStatus,
  sortCasesForDisplay,
} from "./utils/caseHelpers"
import {
  downloadJsonBackup,
  exportAccomplishmentReport,
  exportCasesSubsetToExcel,
  exportCasesToExcel,
  exportPaymentSummary,
  parseJsonBackup,
} from "./utils/exportCases"
import { checkHearingReminders, getNotificationPermissionStatus, requestNotificationPermission } from "./utils/hearingReminders"
import {
  clearSavedCases,
  defaultSettings,
  initialsFromName,
  loadSettings,
  PROFILE_AVATAR_URL,
  saveCases,
  saveSettings,
  withProfileDefaults,
} from "./utils/settings"
import { isSupabaseConfigured, supabase } from "./lib/supabase"
import {
  clearLocalSession,
  loadLocalSession,
  tryLocalLogin,
} from "./utils/auth"
import DostLogo from "./components/ui/DostLogo"
import { useLanguage } from "./i18n/LanguageContext"

const UI_STATE_KEY = "osg-dost-ui-state"

function loadUiState() {
  try {
    const raw = sessionStorage.getItem(UI_STATE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveUiState(state) {
  try {
    sessionStorage.setItem(UI_STATE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

function LoadingScreen({ message = "Loading…" }) {
  return (
    <div className="app-page-bg flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-slate-200/80 bg-white px-10 py-12 shadow-xl shadow-slate-200/40">
        <div className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100">
          <DostLogo className="h-12 w-12" />
        </div>
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-dost-200 border-t-dost-500" />
          <span className="text-sm font-medium text-slate-600">{message}</span>
        </div>
      </div>
    </div>
  )
}

function AppShell({ authUser, useRemote, onLogout }) {
  const { t, language } = useLanguage()
  const savedUi = useRef(loadUiState())
  const [settings, setSettings] = useState(() =>
    useRemote ? { ...defaultSettings } : loadSettings(),
  )
  const [savedFlash, setSavedFlash] = useState(false)
  const [cases, setCases] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState("")
  const [actionError, setActionError] = useState("")
  const [filters, setFilters] = useState(() => savedUi.current?.filters || emptyFilters)
  const [page, setPage] = useState(() => {
    if (savedUi.current?.page) return savedUi.current.page
    const start = useRemote ? defaultSettings.startPage : loadSettings().startPage || "dashboard"
    return start === "reports" ? "dashboard" : start
  })
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [filesCaseId, setFilesCaseId] = useState(null)
  const [formMode, setFormMode] = useState(null)
  const [editingCase, setEditingCase] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [pendingArchive, setPendingArchive] = useState(null)
  const [pendingUnarchive, setPendingUnarchive] = useState(null)
  const [pendingLogout, setPendingLogout] = useState(false)
  const [selectedIds, setSelectedIds] = useState(() => new Set())

  const savedFlashTimer = useRef(null)
  const skipSettingsPersist = useRef(true)
  const hasHydratedRef = useRef(false)
  const authUserKey = useRemote ? authUser?.id : authUser?.email ?? "local"
  const [hasHydrated, setHasHydrated] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const flashSaved = () => {
    if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current)
    setSavedFlash(true)
    savedFlashTimer.current = setTimeout(() => setSavedFlash(false), 1200)
  }

  useEffect(() => {
    if (useRemote && !authUser) return

    let cancelled = false
    const isInitialLoad = !hasHydratedRef.current
    if (isInitialLoad) setDataLoading(true)
    setDataError("")

    const keepLocalData = loadSettings().keepLocalData

    Promise.all([
      fetchAllCases(keepLocalData),
      isInitialLoad
        ? useRemote && authUser
          ? ensureProfile(authUser)
          : ensureProfile(authUser || { email: "admindost@gmail.com" })
        : Promise.resolve(null),
    ])
      .then(([caseRows, profileSettings]) => {
        if (cancelled) return
        setCases(caseRows.map(normalizeCaseRecord))
        if (profileSettings && isInitialLoad) {
          skipSettingsPersist.current = true
          const merged = withProfileDefaults(profileSettings)
          setSettings(merged)
          if (useRemote) {
            const start = merged.startPage || "dashboard"
            setPage(start === "reports" ? "dashboard" : start)
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setDataError(err.message || "Could not load data.")
      })
      .finally(() => {
        if (!cancelled) {
          setDataLoading(false)
          hasHydratedRef.current = true
          setHasHydrated(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [authUserKey, useRemote, reloadKey])

  useEffect(() => {
    saveUiState({ page, filters })
  }, [page, filters])

  useEffect(() => {
    if (useRemote) return undefined
    if (skipSettingsPersist.current) {
      skipSettingsPersist.current = false
      return undefined
    }
    const timer = setTimeout(() => saveSettings(settings), 400)
    return () => clearTimeout(timer)
  }, [settings, useRemote])

  useEffect(() => {
    if (useRemote) return undefined
    const timer = setTimeout(() => {
      if (settings.keepLocalData) saveCases(cases)
      else clearSavedCases()
    }, 500)
    return () => clearTimeout(timer)
  }, [cases, settings.keepLocalData, useRemote])

  useEffect(() => {
    if (!settings.hearingReminders || cases.length === 0) return undefined

    const run = () => checkHearingReminders(cases, settings.hearingReminders, language)
    const timer = setInterval(run, 30 * 60 * 1000)
    let lastVisibleCheck = 0

    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      const now = Date.now()
      if (now - lastVisibleCheck < 5 * 60 * 1000) return
      lastVisibleCheck = now
      run()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
      if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current)
    }
  }, [cases, settings.hearingReminders, language])

  const user = useMemo(
    () => ({
      displayName: settings.displayName,
      role: settings.role,
      initials: initialsFromName(settings.displayName),
      avatarUrl: settings.avatarUrl || PROFILE_AVATAR_URL,
    }),
    [settings.displayName, settings.role, settings.avatarUrl],
  )

  const courtOptions = useMemo(() => getUniqueCourts(cases), [cases])

  const stats = useMemo(() => getCaseStats(cases), [cases])

  const pageCases = useMemo(() => {
    if (page === "archived") {
      return cases.filter((item) => normalizeStatus(item.status) === "Archived")
    }
    if (page === "deleted") {
      return []
    }
    if (page === "cases") {
      return cases.filter((item) => normalizeStatus(item.status) !== "Archived")
    }
    return cases
  }, [cases, page])

  const visibleCases = useMemo(
    () => sortCasesForDisplay(filterCases(pageCases, filters)),
    [pageCases, filters],
  )
  const filesCase = useMemo(
    () => cases.find((item) => item.id === filesCaseId) || null,
    [cases, filesCaseId],
  )
  const recentCases = useMemo(
    () =>
      [...cases]
        .filter((item) => normalizeStatus(item.status) !== "Archived")
        .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
        .slice(0, 6),
    [cases],
  )

  const openAdd = () => {
    setEditingCase(null)
    setFormMode("add")
  }

  const openEdit = (item) => {
    setEditingCase(item)
    setFormMode("edit")
  }

  const handleNavigate = (id) => {
    setPage(id)
    setMobileSidebar(false)
    setSelectedIds(new Set())
    if (id === "cases" || id === "archived") setFilters(emptyFilters)
  }

  const handleCardSelect = (key) => {
    if (key === "archived") {
      setFilters(emptyFilters)
      setPage("archived")
      return
    }
    if (key === "pending") {
      setFilters({ ...emptyFilters, status: "Pending" })
    } else if (key === "ongoing") {
      setFilters({ ...emptyFilters, status: "Ongoing" })
    } else if (key === "closed") {
      setFilters({ ...emptyFilters, status: "Closed" })
    } else if (key === "withoutNumber") {
      setFilters({ ...emptyFilters, caseNumber: "without" })
    } else {
      setFilters(emptyFilters)
    }
    setPage("cases")
  }

  const handleSave = async (payload) => {
    setActionError("")
    try {
      const duplicate = findDuplicateDocket(
        cases,
        payload.caseNumber,
        formMode === "edit" ? editingCase?.id : null,
      )
      if (duplicate) {
        throw new Error(t("form.duplicateDocket", { title: duplicate.caseTitle }))
      }

      if (formMode === "edit" && editingCase) {
        const activity = buildActivity(editingCase, payload, "edit", user.displayName)
        const updated = normalizeCaseRecord(await updateCase(editingCase, payload, activity, cases))
        setCases((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        )
      } else {
        const activity = buildActivity(null, payload, "add", user.displayName)
        const created = normalizeCaseRecord(await createCase(payload, activity, cases))
        setCases((current) => [created, ...current])
        setFilters(emptyFilters)
        setPage("cases")
      }
      setFormMode(null)
      setEditingCase(null)
    } catch (err) {
      const message = err?.message || "Could not save the case."
      setActionError(message)
      throw new Error(message)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setActionError("")
    try {
      await deleteCase(pendingDelete.id, cases)
      setCases((current) => current.filter((item) => item.id !== pendingDelete.id))
      if (filesCaseId === pendingDelete.id) setFilesCaseId(null)
      setPendingDelete(null)
    } catch (err) {
      setActionError(err?.message || "Could not delete the case.")
      setPendingDelete(null)
    }
  }

  const requestDelete = (item) => {
    setPendingDelete(item)
    if (filesCaseId === item.id) setFilesCaseId(null)
  }

  const requestArchive = (item) => {
    setPendingArchive(item)
    if (filesCaseId === item.id) setFilesCaseId(null)
  }

  const confirmArchive = async () => {
    if (!pendingArchive) return
    setActionError("")
    try {
      const activity = buildActivity(
        pendingArchive,
        { ...pendingArchive, status: "Archived" },
        "edit",
        user.displayName,
      )
      const updated = await updateCase(
        pendingArchive,
        { status: "Archived" },
        activity,
        cases,
      )
      setCases((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setPendingArchive(null)
      setSelectedIds(new Set())
      if (page === "cases") setPage("archived")
    } catch (err) {
      setActionError(err?.message || "Could not archive the case.")
      setPendingArchive(null)
    }
  }

  const requestUnarchive = (item) => {
    setPendingUnarchive(item)
    if (filesCaseId === item.id) setFilesCaseId(null)
  }

  const confirmUnarchive = async () => {
    if (!pendingUnarchive) return
    setActionError("")
    try {
      const activity = buildActivity(
        pendingUnarchive,
        { ...pendingUnarchive, status: "Pending" },
        "edit",
        user.displayName,
      )
      const updated = await updateCase(
        pendingUnarchive,
        { status: "Pending" },
        activity,
        cases,
      )
      setCases((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setPendingUnarchive(null)
      if (page === "archived") setPage("cases")
    } catch (err) {
      setActionError(err?.message || "Could not restore the case.")
      setPendingUnarchive(null)
    }
  }

  const handleUpdateFiles = async (caseItem, files) => {
    setActionError("")
    try {
      const activity = [
        ...(caseItem.activity || []),
        {
          date: new Date().toISOString().slice(0, 10),
          label: "Documents updated",
          actor: user.displayName,
        },
      ]
      const updated = await updateCase(caseItem, { files }, activity, cases)
      setCases((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setActionError(err?.message || "Could not update documents.")
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedCases = useMemo(
    () => cases.filter((item) => selectedIds.has(item.id)),
    [cases, selectedIds],
  )

  const bulkArchive = async () => {
    setActionError("")
    try {
      let current = cases
      for (const item of selectedCases) {
        if (normalizeStatus(item.status) === "Archived") continue
        const activity = buildActivity(
          item,
          { ...item, status: "Archived" },
          "edit",
          user.displayName,
        )
        const updated = await updateCase(item, { status: "Archived" }, activity, current)
        current = current.map((row) => (row.id === updated.id ? updated : row))
      }
      setCases(current)
      setSelectedIds(new Set())
    } catch (err) {
      setActionError(err?.message || "Could not archive selected cases.")
    }
  }

  const bulkExport = () => {
    const stamp = new Date().toISOString().slice(0, 10)
    exportCasesSubsetToExcel(selectedCases, `osg-dost-selected-${stamp}.xlsx`)
  }

  const clearFilters = () => {
    setFilters(emptyFilters)
  }

  const handleSettingsChange = (next) => {
    const normalized = withProfileDefaults(next)
    setSettings(normalized)

    if (useRemote) {
      saveProfile(normalized)
        .then((savedProfile) => {
          setSettings((current) => withProfileDefaults({ ...current, ...savedProfile }))
          flashSaved()
        })
        .catch(() => {
          setDataError("Could not save settings.")
        })
      return
    }

    flashSaved()
  }

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10)
    exportCasesToExcel(cases, `osg-dost-cases-${stamp}.xlsx`)
  }

  const handleExportAccomplishment = () => exportAccomplishmentReport(cases)
  const handleExportPayment = () => exportPaymentSummary(cases)

  const handleBackup = () => downloadJsonBackup(cases, settings)

  const handleRestore = async (file) => {
    const backup = await parseJsonBackup(file)
    const restored = await replaceAllCases(backup.cases)
    setCases(restored.map(normalizeCaseRecord))
    if (backup.settings) {
      handleSettingsChange(withProfileDefaults(backup.settings))
    }
  }

  const handleEnableReminders = async (enabled) => {
    if (enabled) {
      const permission = await requestNotificationPermission()
      if (permission !== "granted") {
        setActionError(t("settings.remindersBlocked"))
        return
      }
    }
    handleSettingsChange({ ...settings, hearingReminders: enabled })
  }

  const handleEnableNotificationsFromHome = async () => {
    const permission = await requestNotificationPermission()
    if (permission === "granted") {
      handleSettingsChange({ ...settings, hearingReminders: true })
      checkHearingReminders(cases, true, language)
    } else {
      setActionError(t("settings.remindersBlocked"))
    }
  }

  const notificationStatus = getNotificationPermissionStatus()

  const handleLogout = async () => {
    setPendingLogout(false)
    await onLogout()
    setPage(() => {
      const start = settings.startPage || "dashboard"
      return start === "reports" ? "dashboard" : start
    })
  }

  const showCasesPage = page === "cases"
  const showArchivedPage = page === "archived"
  const showDeletedPage = page === "deleted"
  const showDocketPage = showCasesPage || showArchivedPage || showDeletedPage

  if (!hasHydrated && dataLoading) {
    return <LoadingScreen message={t("app.loadingCases")} />
  }

  if (dataError && !hasHydrated) {
    return (
      <div className="app-page-bg flex min-h-screen items-center justify-center px-4">
        <div className="surface-card-elevated max-w-md p-8 text-center">
          <p className="text-sm text-red-700">{dataError}</p>
          <button
            type="button"
            className="btn-primary-glow mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => {
              setDataError("")
              setReloadKey((value) => value + 1)
            }}
          >
            {t("app.tryAgain")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell flex min-h-screen">
      <AppSidebar
        page={page}
        onNavigate={handleNavigate}
        user={user}
        onRequestLogout={() => setPendingLogout(true)}
        mobileOpen={mobileSidebar}
        onCloseMobile={() => setMobileSidebar(false)}
        archivedCount={stats.archived}
      />

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <main className="app-main mx-auto w-full max-w-[1280px] flex-1 px-4 py-5 sm:px-6 lg:px-8">
          {actionError ? (
            <div
              role="alert"
              className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <p>{actionError}</p>
              <button
                type="button"
                onClick={() => setActionError("")}
                className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                {t("app.dismiss")}
              </button>
            </div>
          ) : null}
          <PageHeader
            page={page}
            onOpenMenu={() => setMobileSidebar(true)}
            onAdd={openAdd}
            showAdd={page === "cases"}
          >
            {showDocketPage && (
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-dost-200 hover:text-dost-700 sm:w-auto lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 text-dost-500" />
                {t("page.filters")}
              </button>
            )}
          </PageHeader>

          {page === "dashboard" && (
              <DashboardPage
                cases={cases}
                stats={stats}
                recentCases={recentCases}
                onCardSelect={handleCardSelect}
                onAdd={openAdd}
                onView={(item) => setFilesCaseId(item.id)}
                onViewAllCases={() => handleNavigate("cases")}
                onEnableNotifications={handleEnableNotificationsFromHome}
                notificationStatus={notificationStatus}
              />
            )}

          {showDocketPage && (
            <section className="animate-fade-in space-y-4">
              <BulkActionBar
                count={selectedIds.size}
                onClear={() => setSelectedIds(new Set())}
                onArchive={showArchivedPage ? undefined : bulkArchive}
                onExport={bulkExport}
                showArchive={!showArchivedPage}
              />
              <CaseFilters
                layout="page"
                filters={filters}
                resultCount={visibleCases.length}
                totalCount={pageCases.length}
                courtOptions={courtOptions}
                onChange={setFilters}
                onApply={() => setMobileFilters(false)}
                onClear={clearFilters}
                mobileOpen={mobileFilters}
                onCloseMobile={() => setMobileFilters(false)}
                hideStatus={showArchivedPage}
                title={showArchivedPage ? t("filters.archivedTitle") : undefined}
              />
              {visibleCases.length === 0 ? (
                <EmptyState
                  variant={showArchivedPage ? "archived" : "filtered"}
                  onClear={clearFilters}
                  onAdd={showArchivedPage ? undefined : openAdd}
                />
              ) : (
                <>
                  <CaseTable
                    cases={visibleCases}
                    compact={settings.compactTable}
                    selectable
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    isArchivedPage={showArchivedPage}
                    onView={(item) => setFilesCaseId(item.id)}
                    onEdit={openEdit}
                    onDelete={requestDelete}
                    onArchive={showArchivedPage ? undefined : requestArchive}
                    onUnarchive={showArchivedPage ? requestUnarchive : undefined}
                  />
                  <CaseCardList
                    cases={visibleCases}
                    isArchivedPage={showArchivedPage}
                    onView={(item) => setFilesCaseId(item.id)}
                    onEdit={openEdit}
                    onDelete={requestDelete}
                    onArchive={showArchivedPage ? undefined : requestArchive}
                    onUnarchive={showArchivedPage ? requestUnarchive : undefined}
                  />
                </>
              )}
            </section>
          )}

            {page === "settings" && (
              <SettingsPage
                settings={settings}
                onChange={handleSettingsChange}
                onExport={handleExport}
                onExportAccomplishment={handleExportAccomplishment}
                onExportPayment={handleExportPayment}
                onBackup={handleBackup}
                onRestore={handleRestore}
                onEnableReminders={handleEnableReminders}
                saved={savedFlash}
                remoteData={useRemote}
              />
            )}
        </main>
      </div>

      <MobileNav page={page} onNavigate={handleNavigate} />

      {filesCase && (
        <CaseRecordModal
          caseItem={filesCase}
          onClose={() => setFilesCaseId(null)}
          onEdit={openEdit}
          onDelete={requestDelete}
          onArchive={normalizeStatus(filesCase.status) === "Archived" ? undefined : requestArchive}
          onUnarchive={normalizeStatus(filesCase.status) === "Archived" ? requestUnarchive : undefined}
          onUpdateFiles={handleUpdateFiles}
        />
      )}

      {formMode && (
        <CaseFormModal
          mode={formMode}
          caseItem={editingCase}
          existingCases={cases}
          onClose={() => {
            setFormMode(null)
            setEditingCase(null)
          }}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("confirm.deleteTitle")}
        message={
          pendingDelete
            ? t("confirm.deleteMessage", { title: pendingDelete.caseTitle })
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
      <ConfirmDialog
        open={Boolean(pendingArchive)}
        title={t("confirm.archiveTitle")}
        message={
          pendingArchive
            ? t("confirm.archiveMessage", { title: pendingArchive.caseTitle })
            : ""
        }
        confirmLabel={t("confirm.archive")}
        confirmVariant="primary"
        onCancel={() => setPendingArchive(null)}
        onConfirm={confirmArchive}
      />
      <ConfirmDialog
        open={Boolean(pendingUnarchive)}
        title={t("confirm.unarchiveTitle")}
        message={
          pendingUnarchive
            ? t("confirm.unarchiveMessage", { title: pendingUnarchive.caseTitle })
            : ""
        }
        confirmLabel={t("cases.unarchive")}
        confirmVariant="primary"
        onCancel={() => setPendingUnarchive(null)}
        onConfirm={confirmUnarchive}
      />
      <ConfirmDialog
        open={pendingLogout}
        title={t("confirm.logoutTitle")}
        message={t("confirm.logoutMessage")}
        confirmLabel={t("confirm.logoutButton")}
        confirmVariant="primary"
        onCancel={() => setPendingLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  )
}

export default function App() {
  const { t } = useLanguage()
  const [authUser, setAuthUser] = useState(null)
  const [localSession, setLocalSession] = useState(() => loadLocalSession())
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured)
  const useRemote = isSupabaseConfigured

  useEffect(() => {
    if (!useRemote || !supabase) {
      setAuthLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setAuthUser(data.session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser((previous) => {
        const next = session?.user ?? null
        if (previous?.id === next?.id) return previous
        return next
      })
    })

    return () => listener.subscription.unsubscribe()
  }, [useRemote])

  const isAuthenticated = useRemote ? Boolean(authUser) : Boolean(localSession)

  const handleLogout = async () => {
    clearLocalSession()
    setLocalSession(null)
    if (supabase) {
      await supabase.auth.signOut()
    }
    setAuthUser(null)
  }

  const handleLocalLogin = (user) => {
    setLocalSession(user)
  }

  if (authLoading) {
    return <LoadingScreen message={t("app.checkingSession")} />
  }

  if (!isAuthenticated) {
    return <LoginPage onLocalLogin={handleLocalLogin} />
  }

  return (
    <AppShell
      authUser={useRemote ? authUser : localSession}
      useRemote={useRemote}
      onLogout={handleLogout}
    />
  )
}
