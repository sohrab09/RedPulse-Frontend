import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Toast from '../components/Toast.jsx'

const MOCK_CREDENTIALS = { email: 'donor@redpulse.org', password: 'blood123' }

function validate(form) {
  const errs = {}
  if (!form.email.trim())   errs.email    = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
  if (!form.password)       errs.password = 'Password is required'
  else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
  return errs
}

export default function Login({ setIsLoggedIn }) {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast]   = useState(null)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)

    if (form.email === MOCK_CREDENTIALS.email && form.password === MOCK_CREDENTIALS.password) {
      setIsLoggedIn(true)
      setToast({ message: 'Welcome back to RedPulse! 🩸', type: 'success' })
      setTimeout(() => navigate('/'), 1000)
    } else {
      setErrors({ password: 'Invalid email or password. Try: donor@redpulse.org / blood123' })
    }
  }

  const fillDemo = () => {
    setForm({ email: MOCK_CREDENTIALS.email, password: MOCK_CREDENTIALS.password })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white text-2xl">🩸</span>
            </div>
            <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Red<span className="text-red-500">Pulse</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-1">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to manage your donor profile</p>
        </div>

        {/* Demo credentials banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <span className="text-amber-500 text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-amber-800 dark:text-amber-300 text-xs font-semibold mb-1">Demo credentials</p>
            <p className="text-amber-700 dark:text-amber-400 text-xs">
              Email: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">donor@redpulse.org</code><br/>
              Password: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">blood123</code>
            </p>
            <button onClick={fillDemo} className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline mt-1 cursor-pointer">
              Fill automatically →
            </button>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm animate-slide-up">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              error={errors.email}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                {showPass ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-red-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-xs text-red-500 hover:text-red-600 font-semibold">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-500 hover:text-red-600 font-semibold">
                Register as Donor
              </Link>
            </p>
          </div>
        </div>

        {/* Back home */}
        <div className="text-center mt-5">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
