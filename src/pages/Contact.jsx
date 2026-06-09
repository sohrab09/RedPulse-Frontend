import React, { useState } from 'react'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Toast from '../components/Toast.jsx'
import { faqs } from '../data/mockData.js'

const initialForm = { name: '', email: '', subject: '', message: '' }

function validate(form) {
  const errs = {}
  if (!form.name.trim())    errs.name    = 'Name is required'
  if (!form.email.trim())   errs.email   = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
  if (!form.message.trim()) errs.message = 'Message is required'
  else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters'
  return errs
}

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white pr-4">{item.q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isOpen ? 'border-red-500 bg-red-500 rotate-45' : 'border-gray-300 dark:border-gray-600'}`}>
          <svg className={`w-3 h-3 ${isOpen ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
          </svg>
        </span>
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''} bg-gray-50 dark:bg-gray-800/50`}>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Contact() {
  const [form, setForm]       = useState(initialForm)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [toast, setToast]     = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    setToast({ message: 'Message sent! We\'ll respond within 24 hours.', type: 'success' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Have a question or need help? Reach out to our team — we respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact info sidebar */}
          <div className="space-y-5">
            {/* Info cards */}
            {[
              { icon: '📍', title: 'Address', detail: '123 Banani Road\nDhaka-1213, Bangladesh' },
              { icon: '📧', title: 'Email', detail: 'help@redpulse.org\nsupport@redpulse.org' },
              { icon: '📞', title: 'Phone', detail: '+880 1700 000000\nMon–Fri, 9am–6pm' },
            ].map(({ icon, title, detail }) => (
              <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex gap-4">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</div>
                  {detail.split('\n').map((line, i) => (
                    <p key={i} className="text-xs text-gray-500 dark:text-gray-400">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social media */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Follow Us</h4>
              <div className="flex gap-2">
                {[
                  { label: 'Facebook',  color: 'hover:bg-blue-600' },
                  { label: 'Twitter',   color: 'hover:bg-sky-400' },
                  { label: 'Instagram', color: 'hover:bg-pink-600' },
                ].map(({ label, color }) => (
                  <a
                    key={label}
                    href="#"
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${color} hover:text-white transition-all duration-200`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-7 sm:p-10 shadow-sm">
              {sent ? (
                <div className="text-center py-10">
                  <div className="text-6xl mb-4">✉️</div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Thank you for reaching out. Our team will reply to <span className="font-semibold text-gray-700 dark:text-gray-300">{form.email}</span> within 24 hours.</p>
                  <Button onClick={() => { setForm(initialForm); setErrors({}); setSent(false) }} variant="secondary">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Your Name" name="name" value={form.name} onChange={handleChange} placeholder="Rahim Uddin" error={errors.name} required />
                    <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahim@email.com" error={errors.email} required />
                  </div>
                  <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" />
                  <Input label="Message" name="message" as="textarea" value={form.message} onChange={handleChange} placeholder="Tell us about your query..." error={errors.message} required rows={5} />
                  <Button type="submit" fullWidth size="lg" loading={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400">Quick answers to common questions about blood donation.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                item={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
