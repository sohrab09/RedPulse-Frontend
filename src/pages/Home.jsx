import React from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection.jsx'
import StatsCard from '../components/StatsCard.jsx'
import Button from '../components/Button.jsx'
import { stats } from '../data/mockData.js'

const steps = [
  {
    num: '01',
    title: 'Search Donors',
    desc: 'Enter your required blood group and location. Our platform instantly shows verified donors near you.',
    icon: '🔍',
    color: 'from-red-50 to-rose-50',
  },
  {
    num: '02',
    title: 'Connect Directly',
    desc: 'Contact a donor through our platform. No middlemen — direct communication for faster response.',
    icon: '📞',
    color: 'from-orange-50 to-amber-50',
  },
  {
    num: '03',
    title: 'Save a Life',
    desc: 'Meet at the hospital or blood bank. Your single donation can save up to 3 lives.',
    icon: '❤️',
    color: 'from-pink-50 to-red-50',
  },
]

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function Home() {
  return (
    <div className="dark:bg-gray-950">
      <HeroSection />

      {/* Stats section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              RedPulse has been facilitating life-saving connections since 2020.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <StatsCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-red-500 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-3">
              How RedPulse Works
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Getting help or giving blood has never been easier. Three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-red-200 via-red-300 to-red-200 dark:from-red-900 dark:via-red-700 dark:to-red-900" />

            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center animate-slide-up" style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}>
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} dark:from-gray-800 dark:to-gray-800 mx-auto mb-6 flex items-center justify-center text-3xl shadow-sm relative z-10 border border-white dark:border-gray-700`}>
                  {step.icon}
                </div>
                <div className="text-red-400 font-bold text-xs mb-2 font-display">{step.num}</div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood group quick links */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Find by Blood Group
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Select a blood type to instantly find available donors</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-2xl mx-auto">
            {bloodTypes.map(group => (
              <Link
                key={group}
                to={`/find-donor?blood=${encodeURIComponent(group)}`}
                className="aspect-square flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 font-display font-bold text-gray-700 dark:text-gray-300 transition-all duration-200 text-sm shadow-sm hover:shadow-md card-hover"
              >
                {group}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
              <div className="text-5xl mb-4">🩸</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Save a Life?
              </h2>
              <p className="text-red-100 text-lg max-w-xl mx-auto mb-8">
                Join thousands of heroes across Bangladesh. Register as a donor today and be there when someone needs you most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Become a Donor
                  </Button>
                </Link>
                <Link to="/find-donor">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 shadow-none">
                    Find a Donor Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
