import { useState } from "react"
import { ArrowRight, Lock, Mail } from "lucide-react"
import { supabase, isSupabaseConfigured } from "../lib/supabase"
import { DEFAULT_LOGIN_EMAIL, tryLocalLogin } from "../utils/auth"
import DostLogo from "./ui/DostLogo"

export default function LoginPage({ onLocalLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError("Enter your email and password.")
      return
    }

    setLoading(true)

    if (isSupabaseConfigured && supabase) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })
      setLoading(false)
      if (signInError) setError(signInError.message)
      return
    }

    const user = tryLocalLogin(trimmedEmail, password)
    setLoading(false)
    if (user) onLocalLogin?.(user)
    else setError("Invalid email or password.")
  }

  return (
    <div className="login-page-bg flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="modal-enter w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <DostLogo className="h-12 w-12" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-slate-900">
            OSG DOST Task Force
          </h1>
          <p className="mt-1 text-sm text-dost-600">
            Case Monitoring &amp; Management System
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">
              Authorized personnel only
            </p>
          </div>

          <form className="space-y-5 p-6" onSubmit={handleSubmit} noValidate>
            <div className="login-input-group">
              <label htmlFor="login-email" className="field-label">
                Email address
              </label>
              <div className="relative mt-1.5">
                <Mail
                  className="login-input-icon pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  strokeWidth={1.75}
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder={DEFAULT_LOGIN_EMAIL}
                />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="login-password" className="field-label">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock
                  className="login-input-icon pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  strokeWidth={1.75}
                />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-glow flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Department of Science and Technology · Republic of the Philippines
        </p>
      </div>
    </div>
  )
}
