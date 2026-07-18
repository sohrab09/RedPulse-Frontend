import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import FindDonor from './pages/FindDonor.jsx'
import Register from './pages/Register.jsx'
import Contact from './pages/Contact.jsx'
import More from './pages/More.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'

// Protected Pages
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import EditProfile from './pages/EditProfile.jsx'

// Pages without footer
const NO_FOOTER_ROUTES = ['/login']

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('rp-dark') === 'true' } catch { return false }
  })
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem('redpulse_token'))
    } catch {
      return false
    }
  })

  const location = useLocation()
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem('rp-dark', darkMode) } catch { }
  }, [darkMode])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/find-donor" element={<FindDonor />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/more" element={<More />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/edit-profile" element={<EditProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
};