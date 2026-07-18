import React, { useMemo, useState } from 'react'
import { useUpdateAvailabilityMutation } from '../redux/features/users/authApiSlice'

const stats = [
    {
        title: 'Blood Group',
        value: 'O+',
        description: 'Universal donor match',
        icon: '🩸',
        accent: 'from-red-500 to-rose-600',
    },
    {
        title: 'Total Donations',
        value: '6',
        description: 'Life-saving donations',
        icon: '❤️',
        accent: 'from-pink-500 to-rose-500',
    },
    {
        title: 'Last Donation',
        value: '12 May 2025',
        description: 'Your last contribution',
        icon: '📅',
        accent: 'from-amber-500 to-orange-500',
    },
    {
        title: 'Eligible Again',
        value: '18 days',
        description: 'Next safe donation window',
        icon: '⏳',
        accent: 'from-emerald-500 to-green-600',
    },
    {
        title: 'Availability',
        value: 'Available',
        description: 'Ready to help save lives',
        icon: '🟢',
        accent: 'from-emerald-500 to-green-600',
    },
    {
        title: 'Donor Level',
        value: 'Gold',
        description: 'Trusted regular donor',
        icon: '🏆',
        accent: 'from-violet-500 to-purple-600',
    },
]

const quickActions = [
    { title: 'Update Donation', icon: '🩸', description: 'Log your recent donation', tone: 'bg-red-500 text-white' },
    { title: 'Edit Profile', icon: '👤', description: 'Refresh your information', tone: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700' },
    { title: 'Emergency Contact', icon: '📞', description: 'Manage urgent support', tone: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700' },
    { title: 'Update Address', icon: '📍', description: 'Keep location current', tone: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700' },
]

const activityTimeline = [
    { title: 'Profile Updated', time: '2h ago', detail: 'Your contact information was refreshed.' },
    { title: 'Donated Blood', time: '1w ago', detail: 'You helped save 3 lives last week.' },
    { title: 'Availability Changed', time: '3d ago', detail: 'Status updated to available.' },
    { title: 'Phone Updated', time: '2w ago', detail: 'Mobile number was verified.' },
]

const tips = [
    '💧 Drink enough water before donating.',
    '🥗 Eat iron-rich food such as spinach, eggs, and red meat.',
    '😴 Sleep well and stay hydrated before your appointment.',
    '❤️ Donate regularly to save lives and support your community.',
]

export default function Dashboard() {

    const [updateAvailability] = useUpdateAvailabilityMutation();

    const [availability, setAvailability] = useState(true)
    const [tipIndex, setTipIndex] = useState(0)

    const progress = useMemo(() => Math.min(100, 70), [])
    const currentTip = tips[tipIndex % tips.length]

    const handleAvailability = async () => {
        const newValue = !availability;

        try {
            await updateAvailability(newValue).unwrap();

            setAvailability(newValue);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/40 px-4 py-6 sm:px-6 lg:px-8 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="rounded-[28px] border border-gray-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">RedPulse Dashboard</p>
                            <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl dark:text-white">
                                Welcome back, Mohammad Sohrab Hossain <span className="text-red-500">❤️</span>
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base dark:text-gray-400">
                                Your donor profile is in great shape. Keep helping save lives with your next donation.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/70">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-lg font-semibold text-white">
                                MS
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Mohammad Sohrab</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Donor since 2022</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.title} className="rounded-[24px] border border-gray-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                            <div className={`inline-flex rounded-2xl bg-gradient-to-br ${stat.accent} px-3 py-2 text-xl`}>{stat.icon}</div>
                            <div className="mt-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                                <div className="text-right text-sm font-medium text-red-500">{stat.description}</div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Profile Summary</p>
                                    <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Your donor profile</h2>
                                </div>
                                <button className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                                    Edit Profile
                                </button>
                            </div>

                            <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
                                <div className="rounded-[24px] bg-gradient-to-br from-red-500 to-rose-600 p-5 text-white">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-semibold">
                                        MS
                                    </div>
                                    <div className="mt-5">
                                        <p className="text-lg font-semibold">Mohammad Sohrab Hossain</p>
                                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm text-red-50">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                                            </svg>
                                            Male
                                        </div>
                                        <p className="mt-2 text-sm text-red-50">Blood Donor • Verified</p>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        ['Blood Group', 'O+'],
                                        ['Age', '28'],
                                        ['Gender', 'Male'],
                                        ['Phone', '+880 1700 000000'],
                                        ['Email', 'sohrab@example.com'],
                                        ['Division', 'Dhaka'],
                                        ['District', 'Dhaka'],
                                        ['Upazila', 'Dhanmondi'],
                                        ['Union', 'Block C'],
                                        ['Member Since', 'Jan 2022'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/70">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{label}</p>
                                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Donation Insights</p>
                                    <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Your donation journey</h2>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {[
                                    ['Last Donation', '12 May 2025'],
                                    ['Next Eligible', '30 May 2025'],
                                    ['Total Donations', '6'],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/70">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{label}</p>
                                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-[24px] border border-red-100 bg-red-50/70 p-5 dark:border-red-900/40 dark:bg-red-950/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Eligibility Status</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">You are eligible to donate now</p>
                                    </div>
                                    <div className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">Eligible</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Availability</p>
                                    <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Ready to donate</h2>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        checked={availability}
                                        onChange={handleAvailability}
                                        type="checkbox"
                                        className="peer sr-only"
                                    />
                                    <div className="h-7 w-12 rounded-full bg-gray-200 transition peer-checked:bg-red-500 dark:bg-gray-700" />
                                    <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
                                </label>
                            </div>

                            <div className="mt-6 rounded-[24px] border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/70">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                                        <p className={`mt-1 text-lg font-semibold ${availability ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                            {availability ? 'Available' : 'Unavailable'}
                                        </p>
                                    </div>
                                    <div className={`h-3 w-3 rounded-full ${availability ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                </div>
                                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Last updated: 10 minutes ago</p>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Quick Actions</p>
                                    <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">What do you want to do?</h2>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3">
                                {quickActions.map((action) => (
                                    <button key={action.title} className={`rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${action.tone}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{action.icon}</span>
                                            <div>
                                                <p className="font-semibold">{action.title}</p>
                                                <p className="text-sm opacity-80">{action.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Recent Activity</p>
                                <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Your latest updates</h2>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {activityTimeline.map((item) => (
                                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/70">
                                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Health Tips</p>
                                <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Stay donation-ready</h2>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[24px] border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-inner dark:border-red-900/40 dark:from-red-950/20 dark:to-gray-900">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">Tip of the moment</p>
                                    <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{currentTip}</p>
                                </div>
                                <button onClick={() => setTipIndex((prev) => prev + 1)} className="rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white dark:border-red-800">
                                    Next
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 rounded-[24px] border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/70">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Donation Journey</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Progress toward your next milestone</p>
                                </div>
                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{progress}%</div>
                            </div>
                            <div className="mt-4 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className="h-2.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="rounded-[24px] border border-gray-200/70 bg-white/80 px-6 py-4 text-center text-sm text-gray-500 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400">
                    © 2026 RedPulse • Save Lives, Donate Blood
                </footer>
            </div>
        </div>
    )
}
