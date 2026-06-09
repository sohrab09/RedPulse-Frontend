import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'

const team = [
  { name: 'Dr. Aisha Rahman',  role: 'Medical Advisor',     initial: 'A', color: 'from-red-400 to-rose-600' },
  { name: 'Tahmid Hossain',    role: 'Founder & CEO',       initial: 'T', color: 'from-orange-400 to-red-500' },
  { name: 'Lamia Begum',       role: 'Community Manager',   initial: 'L', color: 'from-pink-400 to-red-500' },
  { name: 'Rifat Islam',       role: 'Tech Lead',           initial: 'R', color: 'from-red-500 to-rose-700' },
]

const reasons = [
  { title: 'One donation, three lives', desc: 'A single whole blood donation can be separated into red cells, plasma, and platelets — each saving a different patient.' },
  { title: 'Blood cannot be manufactured', desc: 'There is no synthetic substitute for human blood. The only source is generous volunteers like you.' },
  { title: 'Someone needs blood every 2 seconds', desc: 'Accident victims, surgery patients, cancer patients — the demand for blood never stops.' },
  { title: 'It\'s good for your health too', desc: 'Regular donation keeps iron levels balanced, stimulates blood cell production, and provides a free health screening.' },
]

const milestones = [
  { year: '2020', event: 'RedPulse founded in Dhaka with 50 donors' },
  { year: '2021', event: 'Expanded to all 8 divisions of Bangladesh' },
  { year: '2022', event: '5,000 donors registered; launched mobile site' },
  { year: '2023', event: 'Partnered with 200+ hospitals across the country' },
  { year: '2024', event: '10,000+ donors; 7,000+ lives saved' },
  { year: '2025', event: 'Launched real-time donor matching system' },
]

export default function More() {
  return (
    <div className="dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-rose-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">About RedPulse</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Saving Lives,<br />One Drop at a Time
          </h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            RedPulse is Bangladesh's leading digital blood donation platform, connecting compassionate donors with patients in critical need since 2020.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"><Button variant="outline" size="lg">Become a Donor</Button></Link>
            <Link to="/find-donor"><Button size="lg" className="bg-white text-red-600 hover:bg-red-50 shadow-none">Find Donors</Button></Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Our Mission</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
                No Patient Should Wait for Blood
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                In Bangladesh, thousands of patients need blood transfusions daily — but finding the right donor quickly enough is a constant challenge. RedPulse was born to solve this.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                We connect verified donors with patients and hospitals through our real-time platform, making blood donation simple, safe, and swift.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[['12K+', 'Donors'], ['8.9K+', 'Lives Saved'], ['64', 'Districts']].map(([val, label]) => (
                  <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700">
                    <div className="font-display text-2xl font-bold text-gradient">{val}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['🩸 Verified Donors', '🏥 Hospital Network', '⚡ Fast Matching', '🔒 Safe & Private'].map(item => (
                <div key={item} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 card-hover">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Importance</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-3">Why Blood Donation Matters</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Understanding why every donation is priceless.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {reasons.map((r, i) => (
              <div key={r.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 card-hover animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
                <div className="w-10 h-10 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center text-red-500 mb-4 text-lg">
                  {['🩸', '🚫', '⏱️', '💪'][i]}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{r.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Our Journey</h2>
            <p className="text-gray-500 dark:text-gray-400">From a small initiative to a national platform.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 to-red-500 dark:from-red-900 dark:to-red-600" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex gap-6 items-start ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse sm:text-right'} relative`}>
                  <div className="flex-1 hidden sm:block" />
                  <div className="flex-shrink-0 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-red-500 text-white flex items-center justify-center font-display font-bold text-sm shadow-lg shadow-red-500/25">
                      {m.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="text-xs font-bold text-red-500 mb-1 sm:hidden">{m.year}</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{m.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Meet the Team</h2>
            <p className="text-gray-500 dark:text-gray-400">The passionate people behind RedPulse.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map(member => (
              <div key={member.name} className="text-center card-hover group">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} mx-auto mb-3 flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg group-hover:shadow-red-500/30 transition-shadow`}>
                  {member.initial}
                </div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{member.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Ready to Make a Difference?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-7">Join our growing community of life-savers across Bangladesh.</p>
          <Link to="/register"><Button size="lg">Register as Donor Today</Button></Link>
        </div>
      </section>
    </div>
  )
}
