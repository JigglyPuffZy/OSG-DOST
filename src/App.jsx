import { SlidersHorizontal } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createCase, deleteCase, fetchAllCases, updateCase, ensureProfile, saveProfile } from "./api"
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
import {
  buildActivity,
  emptyFilters,
  filterCases,
  getCaseStats,
  sortCasesForDisplay,
} from "./utils/caseHelpers"
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
  const [settings, setSettings] = useState(() =>
    useRemote ? { ...defaultSettings } : loadSettings(),
  )
  const [savedFlash, setSavedFlash] = useState(false)
  const [cases, setCases] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState("")
  const [actionError, setActionError] = useState("")
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(() => {
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
  const [pendingLogout, setPendingLogout] = useState(false)

  const skipSettingsFlash = useRef(true)

  useEffect(() => {
    if (useRemote && !authUser) return

    let cancelled = false
    setDataLoading(true)
    setDataError("")

    const keepLocalData = loadSettings().keepLocalData

    Promise.all([
      fetchAllCases(keepLocalData),
      useRemote && authUser ? ensureProfile(authUser) : ensureProfile(authUser || { email: "admindost@gmail.com" }),
    ])
      .then(([caseRows, profileSettings]) => {
        if (cancelled) return
        setCases(caseRows)
        const merged = withProfileDefaults(profileSettings)
        setSettings(merged)
        if (useRemote) {
          const start = merged.startPage || "dashboard"
          setPage(start === "reports" ? "dashboard" : start)
        }
      })
      .catch((err) => {
        if (!cancelled) setDataError(err.message || "Could not load data.")
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [authUser, useRemote])

  useEffect(() => {
    if (useRemote) return
    saveSettings(settings)
    if (skipSettingsFlash.current) {
      skipSettingsFlash.current = false
      return
    }
    setSavedFlash(true)
    const timer = setTimeout(() => setSavedFlash(false), 1200)
    return () => clearTimeout(timer)
  }, [settings, useRemote])

  useEffect(() => {
    if (useRemote) return
    if (settings.keepLocalData) saveCases(cases)
    else clearSavedCases()
  }, [cases, settings.keepLocalData, useRemote])

  const user = useMemo(
    () => ({
      displayName: settings.displayName,
      role: settings.role,
      initials: initialsFromName(settings.displayName),
      avatarUrl: settings.avatarUrl || PROFILE_AVATAR_URL,
    }),
    [settings.displayName, settings.role, settings.avatarUrl],
  )

  const stats = useMemo(() => getCaseStats(cases), [cases])

  const pageCases = useMemo(() => {
    if (page === "archived") {
      return cases.filter((item) => item.status === "Archived")
    }
    if (page === "cases") {
      return cases.filter((item) => item.status !== "Archived")
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
        .filter((item) => item.status !== "Archived")
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
      if (formMode === "edit" && editingCase) {
        const activity = buildActivity(editingCase, payload, "edit")
        const updated = await updateCase(editingCase, payload, activity, cases)
        setCases((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        )
      } else {
        const activity = buildActivity(null, payload, "add")
        const created = await createCase(payload, activity, cases)
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
      const next = { ...pendingArchive, status: "Archived" }
      const activity = buildActivity(pendingArchive, next, "edit")
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
      if (page === "cases") {
        setPage("archived")
      }
    } catch (err) {
      setActionError(err?.message || "Could not archive the case.")
      setPendingArchive(null)
    }
  }

  const clearFilters = () => {
    setFilters(emptyFilters)
  }

  const handleSettingsChange = (next) => {
    const normalized = withProfileDefaults(next)
    setSettings(normalized)
    saveProfile(normalized)
      .then((savedProfile) => {
        setSettings((current) => withProfileDefaults({ ...current, ...savedProfile }))
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1200)
      })
      .catch(() => {
        setDataError("Could not save settings.")
      })
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(cases, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "osg-dost-cases.json"
    link.click()
    URL.revokeObjectURL(url)
  }

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
  const showDocketPage = showCasesPage || showArchivedPage

  if (dataLoading) {
    return <LoadingScreen message="Loading cases…" />
  }

  if (dataError) {
    return (
      <div className="app-page-bg flex min-h-screen items-center justify-center px-4">
        <div className="surface-card-elevated max-w-md p-8 text-center">
          <p className="text-sm text-red-700">{dataError}</p>
          <button
            type="button"
            className="btn-primary-glow mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Try again
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
                Dismiss
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
                Filters
              </button>
            )}
          </PageHeader>

          {page === "dashboard" && (
              <DashboardPage
                stats={stats}
                recentCases={recentCases}
                onCardSelect={handleCardSelect}
                onAdd={openAdd}
                onView={(item) => setFilesCaseId(item.id)}
                onViewAllCases={() => handleNavigate("cases")}
              />
            )}

          {showDocketPage && (
            <section className="animate-fade-in space-y-4">
              <CaseFilters
                layout="page"
                filters={filters}
                resultCount={visibleCases.length}
                totalCount={pageCases.length}
                onChange={setFilters}
                onApply={() => setMobileFilters(false)}
                onClear={clearFilters}
                mobileOpen={mobileFilters}
                onCloseMobile={() => setMobileFilters(false)}
                hideStatus={showArchivedPage}
                title={showArchivedPage ? "Archived filters" : "Filters"}
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
                    onView={(item) => setFilesCaseId(item.id)}
                    onEdit={openEdit}
                    onDelete={requestDelete}
                    onArchive={showArchivedPage ? undefined : requestArchive}
                  />
                  <CaseCardList
                    cases={visibleCases}
                    onView={(item) => setFilesCaseId(item.id)}
                    onEdit={openEdit}
                    onDelete={requestDelete}
                    onArchive={showArchivedPage ? undefined : requestArchive}
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
          onArchive={requestArchive}
        />
      )}

      {formMode && (
        <CaseFormModal
          mode={formMode}
          caseItem={editingCase}
          onClose={() => {
            setFormMode(null)
            setEditingCase(null)
          }}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this case?"
        message={
          pendingDelete
            ? `“${pendingDelete.caseTitle}” will be removed. The list will renumber automatically (e.g. 22 cases becomes 21). This cannot be undone.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
      <ConfirmDialog
        open={Boolean(pendingArchive)}
        title="Archive this case?"
        message={
          pendingArchive
            ? `“${pendingArchive.caseTitle}” will be moved to Archived. You can find it in the Archived tab.`
            : ""
        }
        confirmLabel="Archive"
        confirmVariant="primary"
        onCancel={() => setPendingArchive(null)}
        onConfirm={confirmArchive}
      />
      <ConfirmDialog
        open={pendingLogout}
        title="Sign out?"
        message="You will need to sign in again to access the case system."
        confirmLabel="Sign out"
        confirmVariant="primary"
        onCancel={() => setPendingLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  )
}

export default function App() {
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
      setAuthUser(session?.user ?? null)
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
    return <LoadingScreen message="Checking session…" />
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
