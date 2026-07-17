import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png';
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/find-donor', label: 'Find Donor' },
  { to: '/register', label: 'Register' },
  { to: '/more', label: 'More' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ darkMode, setDarkMode, isLoggedIn, setIsLoggedIn }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem('redpulse_token')
    } catch { }
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
        : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 mr-2">
                <img src={logo} alt="logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Red

                <span className="relative text-red-500 inline-block ml-1">
                  Pulse

                  {/* heartbeat line through text */}
                  <svg
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-5 text-red-500 pointer-events-none"
                    viewBox="0 0 100 20"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 10 H20 L25 4 L30 16 L35 10 L45 10 L50 4 L55 16 L60 10 H100"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `nav-link-underline text-sm font-semibold transition-colors duration-200 py-1
                    ${isActive
                      ? 'text-red-500 active'
                      : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">U</div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-red-500/25"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200
                  ${isActive
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              {isLoggedIn ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl text-left transition-colors cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 bg-red-500 text-white text-sm font-semibold rounded-xl text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}
