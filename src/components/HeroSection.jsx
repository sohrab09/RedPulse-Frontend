import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button.jsx'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-pattern dark:bg-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-500/8 rounded-full blur-3xl" />
        {/* Floating blood drop decorations */}
        <div className="absolute top-32 right-1/4 w-3 h-3 bg-red-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 right-16 w-2 h-2 bg-red-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-red-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-red-100 dark:border-red-900">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Donor Network — Bangladesh
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Every Drop
              <br />
              <span className="text-gradient">Saves a</span>
              <br />
              Life
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              RedPulse connects blood donors with patients in critical need — instantly, safely, and with compassion. Be the reason someone's family stays together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/find-donor">
                <Button size="lg" className="min-w-48">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Find a Donor
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="secondary" className="min-w-48">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  Register as Donor
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {['R','F','K','N','T'].map((initial, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-red-300 to-red-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {initial}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">12,400+</span> donors ready to help
              </p>
            </div>
          </div>

          {/* Right visual */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Central blood group display */}
            <div className="relative">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute -inset-4 rounded-full bg-red-500/5" />

              <div className="w-64 h-64 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-red-500/40 animate-float">
                <div className="text-white/60 text-sm font-semibold mb-1">Give</div>
                <div className="text-white font-display text-6xl font-bold">🩸</div>
                <div className="text-white/60 text-sm font-semibold mt-1">Save Lives</div>
              </div>

              {/* Orbiting blood group tags */}
              {[
                { group: 'A+',  angle: 0,   color: 'bg-rose-100 text-rose-700' },
                { group: 'O+',  angle: 60,  color: 'bg-red-100 text-red-700' },
                { group: 'B+',  angle: 120, color: 'bg-orange-100 text-orange-700' },
                { group: 'AB+', angle: 180, color: 'bg-purple-100 text-purple-700' },
                { group: 'O-',  angle: 240, color: 'bg-pink-100 text-pink-700' },
                { group: 'AB-', angle: 300, color: 'bg-indigo-100 text-indigo-700' },
              ].map(({ group, angle, color }, i) => {
                const rad = (angle * Math.PI) / 180
                const r = 160
                const x = Math.cos(rad) * r
                const y = Math.sin(rad) * r
                return (
                  <div
                    key={group}
                    className={`absolute px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${color}`}
                    style={{ left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 14px)` }}
                  >
                    {group}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 30C1440 30 1080 80 720 60C360 40 0 80 0 80Z" fill="currentColor" className="text-gray-50 dark:text-gray-950" />
        </svg>
      </div>
    </section>
  )
}
