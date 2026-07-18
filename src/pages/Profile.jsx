import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUserProfileQuery } from '../redux/features/users/usersApiSlice'
import { IconActivity, IconAward, IconCalendar, IconCheck, IconDroplet, IconEdit, IconHeart, IconMail, IconMapPin, IconPhone, IconShare, IconShield, IconUser } from '../icons/icons';

// ==================== LOADING SKELETON ====================
const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
            <div className="animate-pulse space-y-8">
                <div className="h-64 rounded-3xl bg-gray-200 dark:bg-gray-800" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-800" />
                    <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-800" />
                    <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-800" />
                </div>
            </div>
        </div>
    </div>
);

// ==================== ERROR STATE ====================
const ErrorState = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-6">
                <IconShield className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error?.data?.message || "Unable to load profile"}</p>
            <button
                onClick={onRetry}
                className="rounded-full bg-red-500 hover:bg-red-600 px-8 py-3 text-sm font-semibold text-white transition"
            >
                Try Again
            </button>
        </div>
    </div>
);

// ==================== BLOOD BADGE ====================
const BloodBadge = ({ group }) => {
    const getColor = (g) => {
        if (g?.includes('+')) return 'from-red-500 to-rose-500 shadow-red-500/30';
        if (g?.includes('-')) return 'from-blue-500 to-indigo-500 shadow-blue-500/30';
        return 'from-gray-500 to-gray-600 shadow-gray-500/30';
    };

    return (
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(group)} shadow-lg`}>
            <span className="text-white font-bold text-lg">{group || '?'}</span>
        </div>
    );
};

// ==================== STAT CARD ====================
const StatCard = ({ icon: Icon, value, label, color = "red" }) => {
    const colorMap = {
        red: 'text-red-500 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
        amber: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
        emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400',
        blue: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg hover:shadow-red-500/5 dark:hover:shadow-red-900/10 transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100/50 dark:from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
    );
};

// ==================== INFO ROW ====================
const InfoRow = ({ icon: Icon, label, value, delay = 0 }) => (
    <div
        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all duration-300 group"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-colors">
            <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value || '—'}</p>
        </div>
    </div>
);

// ==================== DONATION TIMELINE ====================
const DonationTimeline = () => {
    const donations = [
        { date: '2024-03-15', location: 'Dhaka Medical College', type: 'Emergency' },
        { date: '2023-11-22', location: 'Square Hospital', type: 'Planned' },
        { date: '2023-07-08', location: 'Popular Diagnostic', type: 'Emergency' },
    ];

    return (
        <div className="space-y-4">
            {donations.map((donation, i) => (
                <div key={i} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-950/50" />
                        {i < donations.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gradient-to-b from-red-300 dark:from-red-800 to-transparent mt-2" />
                        )}
                    </div>
                    <div className="pb-6">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{donation.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{donation.date}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${donation.type === 'Emergency' ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'}`}>
                                {donation.type}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ==================== ACHIEVEMENT BADGE ====================
const AchievementBadge = ({ icon: Icon, title, desc, unlocked, color }) => (
    <div className={`relative rounded-xl p-4 border transition-all duration-300 ${unlocked
        ? 'bg-white dark:bg-white/[0.05] border-gray-100 dark:border-white/[0.1] shadow-sm'
        : 'bg-gray-50 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.04] opacity-60'
        }`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${unlocked ? color : 'bg-gray-200 dark:bg-gray-800'}`}>
            <Icon className={`w-5 h-5 ${unlocked ? 'text-white' : 'text-gray-400 dark:text-gray-600'}`} />
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
        {unlocked && (
            <div className="absolute top-2 right-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            </div>
        )}
    </div>
);

// ==================== MAIN PROFILE COMPONENT ====================
const Profile = () => {
    const { data: user, isLoading, isError, error, refetch } = useGetUserProfileQuery();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading) return <ProfileSkeleton />;
    if (isError) return <ErrorState error={error} onRetry={refetch} />;
    if (!user?.data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No profile data found</p>
                    <button onClick={refetch} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">Refresh</button>
                </div>
            </div>
        );
    }

    const userData = user.data;
    const initials = userData?.fullName
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || 'U';

    const memberSince = userData?.createdAt
        ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'N/A';

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Activity' },
        { id: 'achievements', label: 'Achievements' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            {/* ==================== HERO SECTION ==================== */}
            <div className="relative overflow-hidden">
                {/* Background gradient - adapts to theme */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-50 dark:from-red-950/20 via-gray-50 dark:via-gray-950 to-gray-50 dark:to-gray-950" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-200/50 dark:bg-red-600/10 rounded-full blur-[100px]" />

                <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Top actions */}
                    <div className="flex justify-end gap-3 mb-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition shadow-sm"
                        >
                            <IconActivity className="w-4 h-4" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => {
                                navigate('/dashboard/edit-profile');
                            }}
                            className="flex items-center gap-2 rounded-full bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white transition shadow-lg shadow-red-500/25 dark:shadow-red-900/20"
                        >
                            <IconEdit className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>

                    {/* Profile header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 p-[3px] shadow-2xl shadow-red-500/20 dark:shadow-red-900/30">
                                <div className="w-full h-full rounded-[21px] bg-white dark:bg-[#1a1a1a] flex items-center justify-center">
                                    <span className="text-4xl font-bold bg-gradient-to-br from-red-600 to-red-400 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                        {initials}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-gray-50 dark:border-[#0f0f0f] flex items-center justify-center">
                                <IconCheck className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                {userData?.fullName}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-center sm:justify-start gap-2">
                                <IconMapPin className="w-4 h-4" />
                                {[userData?.upazila, userData?.district, userData?.division].filter(Boolean).join(', ') || 'Location not set'}
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Donor
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-3 py-1 text-xs font-medium border border-gray-200 dark:border-gray-800">
                                    <IconCalendar className="w-3 h-3" />
                                    Since {memberSince}
                                </span>
                            </div>
                        </div>

                        {/* Blood badge */}
                        <div className="flex flex-col items-center gap-2">
                            <BloodBadge group={userData?.bloodGroup} />
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Blood Type</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== STATS BAR ==================== */}
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={IconHeart} value="12" label="Lives Saved" color="red" />
                    <StatCard icon={IconDroplet} value="8" label="Donations" color="amber" />
                    <StatCard icon={IconAward} value="5" label="Badges" color="emerald" />
                    <StatCard icon={IconActivity} value="2 yrs" label="Experience" color="blue" />
                </div>
            </div>

            {/* ==================== TABS ==================== */}
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex gap-1 p-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 w-fit mb-6 shadow-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-gray-100 dark:bg-white/[0.1] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ==================== TAB CONTENT ==================== */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                        {/* Left column - Personal Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <IconUser className="w-5 h-5 text-red-500" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <InfoRow icon={IconUser} label="Full Name" value={userData?.fullName} delay={0} />
                                    <InfoRow icon={IconCalendar} label="Age" value={`${userData?.age} years`} delay={50} />
                                    <InfoRow icon={IconUser} label="Gender" value={userData?.gender} delay={100} />
                                    <InfoRow icon={IconDroplet} label="Blood Group" value={userData?.bloodGroup} delay={150} />
                                    <InfoRow icon={IconPhone} label="Phone" value={userData?.phoneNumber} delay={200} />
                                    <InfoRow icon={IconMail} label="Email" value={userData?.email} delay={250} />
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <IconMapPin className="w-5 h-5 text-red-500" />
                                    Location Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <InfoRow icon={IconMapPin} label="Division" value={userData?.division} delay={0} />
                                    <InfoRow icon={IconMapPin} label="District" value={userData?.district} delay={50} />
                                    <InfoRow icon={IconMapPin} label="Upazila" value={userData?.upazila} delay={100} />
                                    <InfoRow icon={IconMapPin} label="Union" value={userData?.union} delay={150} />
                                </div>
                            </div>
                        </div>

                        {/* Right column - Quick Actions */}
                        <div className="space-y-6">
                            <div className="rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-600/20 dark:to-rose-600/10 border border-red-100 dark:border-red-500/20 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center gap-3 rounded-xl bg-white/60 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.1] p-3 text-left transition group shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                                            <IconDroplet className="w-5 h-5 text-red-500 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition">Schedule Donation</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Book your next appointment</p>
                                        </div>
                                    </button>
                                    <button className="w-full flex items-center gap-3 rounded-xl bg-white/60 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.1] p-3 text-left transition group shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                                            <IconShare className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">Share Profile</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Let others find you</p>
                                        </div>
                                    </button>
                                    <button className="w-full flex items-center gap-3 rounded-xl bg-white/60 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.1] p-3 text-left transition group shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                            <IconShield className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">Privacy Settings</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Control visibility</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Availability</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Available</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ready to donate</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Donation History</h3>
                            <DonationTimeline />
                        </div>
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Impact</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500 dark:text-gray-400">Goal Progress</span>
                                        <span className="text-gray-900 dark:text-white font-medium">8/20</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 dark:bg-white/[0.05] overflow-hidden">
                                        <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-red-500 to-rose-400" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500 dark:text-gray-400">This Year</span>
                                        <span className="text-gray-900 dark:text-white font-medium">3 donations</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 dark:bg-white/[0.05] overflow-hidden">
                                        <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="pb-12">
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Badges & Achievements</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <AchievementBadge
                                    icon={IconHeart}
                                    title="First Drop"
                                    desc="First donation"
                                    unlocked={true}
                                    color="bg-red-500"
                                />
                                <AchievementBadge
                                    icon={IconDroplet}
                                    title="Regular"
                                    desc="5 donations"
                                    unlocked={true}
                                    color="bg-amber-500"
                                />
                                <AchievementBadge
                                    icon={IconAward}
                                    title="Hero"
                                    desc="10 donations"
                                    unlocked={false}
                                    color="bg-emerald-500"
                                />
                                <AchievementBadge
                                    icon={IconShield}
                                    title="Guardian"
                                    desc="20 donations"
                                    unlocked={false}
                                    color="bg-blue-500"
                                />
                                <AchievementBadge
                                    icon={IconActivity}
                                    title="Lifesaver"
                                    desc="Emergency donation"
                                    unlocked={true}
                                    color="bg-rose-500"
                                />
                                <AchievementBadge
                                    icon={IconCalendar}
                                    title="Consistent"
                                    desc="1 year streak"
                                    unlocked={true}
                                    color="bg-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;