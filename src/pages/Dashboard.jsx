// import React, { useEffect, useState } from 'react'
// import { useGetUserProfileQuery, useUpdateAvailabilityMutation } from '../redux/features/users/authApiSlice'
// import { useNavigate } from 'react-router-dom';
// import Toast from '../components/Toast';
// import ErrorState from '../components/Error';
// import EmptyState from '../components/Empty';

// const SkeletonPulse = ({ className = "" }) => (
//     <div className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 ${className}`} />
// );

// const ProfileSkeleton = () => (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/40 px-4 py-6 sm:px-6 lg:px-8 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20">
//         <div className="mx-auto max-w-7xl space-y-6">
//             {/* Header Skeleton */}
//             <div className="rounded-[28px] border border-gray-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//                     <div className="space-y-3">
//                         <SkeletonPulse className="h-4 w-40" />
//                         <SkeletonPulse className="h-10 w-80" />
//                         <SkeletonPulse className="h-4 w-96" />
//                     </div>
//                     <SkeletonPulse className="h-16 w-48 rounded-2xl" />
//                 </div>
//             </div>
//             {/* Content Skeleton */}
//             <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
//                 <SkeletonPulse className="h-[500px] rounded-[28px]" />
//                 <SkeletonPulse className="h-[300px] rounded-[28px]" />
//             </div>
//         </div>
//     </div>
// );

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { data: user, isLoading, isError, error, refetch } = useGetUserProfileQuery();
//     const [updateAvailability] = useUpdateAvailabilityMutation();

//     const [availability, setAvailability] = useState(false);
//     const [lastUpdated, setLastUpdated] = useState(null);
//     const [toast, setToast] = useState(null);

//     useEffect(() => {
//         if (user?.data) {
//             setAvailability(user.data.isAvailable);
//             setLastUpdated(new Date());
//         }
//     }, [user]);

//     const showToast = (message, type = 'success') => {
//         setToast({ message, type });
//     };

//     const handleAvailability = async () => {
//         const newValue = !availability;

//         try {
//             await updateAvailability(newValue).unwrap();
//             setAvailability(newValue);
//             setLastUpdated(new Date());
//             showToast(newValue ? 'You are now available for donation!' : 'You are now unavailable for donation.');
//         } catch (err) {
//             console.error(err);
//             showToast(err?.data?.message || 'Failed to update availability. Please try again.', 'error');
//         }
//     };

//     if (isLoading) {
//         return <ProfileSkeleton />;
//     }

//     if (isError) {
//         return <ErrorState error={error} onRetry={refetch} />;
//     }

//     if (!user?.data) {
//         return <EmptyState onRefresh={refetch} />;
//     }

//     const userData = user.data;
//     const initials = userData?.fullName
//         ?.split(" ")
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase() || 'U';

//     const handleEditProfile = () => {
//         navigate('/dashboard/edit-profile');
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/40 px-4 py-6 sm:px-6 lg:px-8 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20">
//             {/* Toast Notification */}
//             {toast && (
//                 <Toast
//                     message={toast.message}
//                     type={toast.type}
//                     onClose={() => setToast(null)}
//                 />
//             )}

//             <div className="mx-auto max-w-7xl space-y-6">
//                 {/* Header */}
//                 <header className="rounded-[28px] border border-gray-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
//                     <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//                         <div>
//                             <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">RedPulse Dashboard</p>
//                             <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl dark:text-white">
//                                 Welcome back, {userData?.fullName} <span className="text-red-500">❤️</span>
//                             </h1>
//                             <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base dark:text-gray-400">
//                                 Your donor profile is in great shape. Keep helping save lives with your next donation.
//                             </p>
//                         </div>

//                         <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/70">
//                             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-lg font-semibold text-white">
//                                 {initials}
//                             </div>
//                             <div>
//                                 <p className="text-sm font-semibold text-gray-900 dark:text-white">{userData?.fullName}</p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                                     {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
//                     {/* Left Column */}
//                     <div className="space-y-6">
//                         <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Profile Summary</p>
//                                     <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Your donor profile</h2>
//                                 </div>
//                                 <button
//                                     onClick={handleEditProfile}
//                                     className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 shadow-sm hover:shadow-md hover:shadow-red-500/25 active:scale-95"
//                                 >
//                                     Edit Profile
//                                 </button>
//                             </div>

//                             <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
//                                 {/* Profile Card */}
//                                 <div className="rounded-[24px] bg-gradient-to-br from-red-500 to-rose-600 p-5 text-white">
//                                     <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-semibold">
//                                         {initials}
//                                     </div>
//                                     <div className="mt-5">
//                                         <p className="text-lg font-semibold">{userData?.fullName || 'Unknown'}</p>
//                                         <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm text-red-50">
//                                             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
//                                             </svg>
//                                             {userData?.gender || 'Not specified'}
//                                         </div>
//                                         <p className="mt-2 text-sm text-red-50">Blood Donor • Verified</p>
//                                     </div>
//                                 </div>

//                                 {/* Info Grid */}
//                                 <div className="grid gap-3 sm:grid-cols-2">
//                                     {[
//                                         ["Blood Group", userData?.bloodGroup],
//                                         ["Age", userData?.age],
//                                         ["Gender", userData?.gender],
//                                         ["Phone", userData?.phoneNumber],
//                                         ["Email", userData?.email],
//                                         ["Division", userData?.division],
//                                         ["District", userData?.district],
//                                         ["Upazila", userData?.upazila],
//                                         ["Union", userData?.union],
//                                         ["Member Since", userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'],
//                                     ].map(([label, value]) => (
//                                         <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/70 hover:border-red-200 dark:hover:border-red-800 transition-colors group">
//                                             <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors">{label}</p>
//                                             <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{value || '—'}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Column */}
//                     <div className="space-y-6">
//                         <div className="rounded-[28px] border border-gray-200/70 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Availability</p>
//                                     <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Ready to donate</h2>
//                                 </div>
//                                 <label className="relative inline-flex cursor-pointer items-center">
//                                     <input
//                                         checked={availability}
//                                         onChange={handleAvailability}
//                                         type="checkbox"
//                                         className="peer sr-only"
//                                     />
//                                     <div className="h-7 w-12 rounded-full bg-gray-200 transition-all duration-300 peer-checked:bg-red-500 dark:bg-gray-700" />
//                                     <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-5" />
//                                 </label>
//                             </div>

//                             <div className="mt-6 rounded-[24px] border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/70">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
//                                         <p className={`mt-1 text-lg font-semibold transition-colors ${availability ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
//                                             {availability ? 'Available' : 'Unavailable'}
//                                         </p>
//                                     </div>
//                                     <div className={`h-3 w-3 rounded-full transition-colors ${availability ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
//                                 </div>
//                                 <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//                                     Last updated: {availability ? 'Online' : 'Offline'}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUserProfileQuery, useUpdateAvailabilityMutation } from '../redux/features/users/usersApiSlice'
import Toast from '../components/Toast';
import ErrorState from '../components/Error';
import EmptyState from '../components/Empty';

// ==================== ICONS ====================
const IconHeart = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const IconDroplet = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
    </svg>
);

const IconUsers = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const IconTrendingUp = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const IconCalendar = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const IconMapPin = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconBell = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const IconEdit = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const IconEye = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const IconCheck = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const IconClock = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconAlert = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const IconArrowUp = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

const IconArrowDown = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

// ==================== SKELETON ====================
const SkeletonPulse = ({ className = "" }) => (
    <div className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 ${className}`} />
);

const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <SkeletonPulse key={i} className="h-32 rounded-2xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonPulse className="h-80 rounded-2xl lg:col-span-2" />
                <SkeletonPulse className="h-80 rounded-2xl" />
            </div>
        </div>
    </div>
);

// ==================== MINI CHART COMPONENT ====================
const MiniChart = ({ data, color = "red" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const colorClasses = {
        red: 'bg-red-500',
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        amber: 'bg-amber-500',
    };

    return (
        <div className="flex items-end gap-1 h-16">
            {data.map((val, i) => (
                <div
                    key={i}
                    className={`flex-1 rounded-t-sm ${colorClasses[color]} opacity-80 hover:opacity-100 transition-opacity`}
                    style={{ height: `${((val - min) / range) * 100}%`, minHeight: '4px' }}
                />
            ))}
        </div>
    );
};

// ==================== CIRCULAR PROGRESS ====================
const CircularProgress = ({ value, max, size = 80, strokeWidth = 8, color = "red" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (value / max) * 100;
    const dashoffset = circumference - (progress / 100) * circumference;

    const colorMap = {
        red: 'stroke-red-500',
        emerald: 'stroke-emerald-500',
        blue: 'stroke-blue-500',
        amber: 'stroke-amber-500',
    };

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-gray-200 dark:stroke-gray-700"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    className={`${colorMap[color]} transition-all duration-1000 ease-out`}
                />
            </svg>
            <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
        </div>
    );
};

// ==================== STAT CARD ====================
const StatCard = ({ icon: Icon, title, value, change, changeType, chartData, color }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'red' ? 'bg-red-50 dark:bg-red-950/30 text-red-500' :
                color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' :
                    color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-500' :
                        'bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                }`}>
                <Icon className="w-5 h-5" />
            </div>
            {change && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${changeType === 'up'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                    }`}>
                    {changeType === 'up' ? <IconArrowUp className="w-3 h-3" /> : <IconArrowDown className="w-3 h-3" />}
                    {change}%
                </div>
            )}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{title}</p>
        {chartData && <MiniChart data={chartData} color={color} />}
    </div>
);

// ==================== ACTIVITY ITEM ====================
const ActivityItem = ({ icon: Icon, title, desc, time, type }) => {
    const typeColors = {
        success: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500',
        warning: 'bg-amber-50 dark:bg-amber-950/30 text-amber-500',
        info: 'bg-blue-50 dark:bg-blue-950/30 text-blue-500',
        alert: 'bg-red-50 dark:bg-red-950/30 text-red-500',
    };

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[type]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{time}</span>
        </div>
    );
};

// ==================== NEARBY DONOR CARD ====================
const NearbyDonorCard = ({ name, bloodGroup, distance, status }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{distance} away</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-500">{bloodGroup}</span>
            <div className={`w-2 h-2 rounded-full ${status === 'available' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
        </div>
    </div>
);

// ==================== MAIN DASHBOARD ====================
const Dashboard = () => {
    const navigate = useNavigate();
    const { data: user, isLoading, isError, error, refetch } = useGetUserProfileQuery();
    const [updateAvailability] = useUpdateAvailabilityMutation();

    const [availability, setAvailability] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (user?.data) setAvailability(user.data.isAvailable);
    }, [user]);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const handleAvailability = async () => {
        const newValue = !availability;
        try {
            await updateAvailability(newValue).unwrap();
            setAvailability(newValue);
            showToast(newValue ? 'You are now available for donation!' : 'You are now unavailable for donation.');
        } catch (err) {
            showToast(err?.data?.message || 'Failed to update availability.', 'error');
        }
    };

    if (isLoading) return <DashboardSkeleton />;
    if (isError) return <ErrorState error={error} onRetry={refetch} />;
    if (!user?.data) return <EmptyState onRefresh={refetch} />;

    const userData = user.data;
    const initials = userData?.fullName?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || 'U';

    // Mock data for dashboard feel
    const stats = [
        { icon: IconHeart, title: 'Total Donations', value: '12', change: '20', changeType: 'up', chartData: [3, 5, 4, 7, 6, 8, 12], color: 'red' },
        { icon: IconUsers, title: 'Lives Impacted', value: '36', change: '15', changeType: 'up', chartData: [10, 15, 20, 25, 28, 32, 36], color: 'emerald' },
        { icon: IconDroplet, title: 'Blood Given (L)', value: '4.8', change: '8', changeType: 'up', chartData: [1, 1.5, 2, 2.8, 3.2, 4, 4.8], color: 'blue' },
        { icon: IconTrendingUp, title: 'Response Rate', value: '94%', change: '5', changeType: 'down', chartData: [98, 95, 92, 96, 94, 95, 94], color: 'amber' },
    ];

    const recentActivity = [
        { icon: IconCheck, title: 'Donation Completed', desc: 'Dhaka Medical College Hospital', time: '2h ago', type: 'success' },
        { icon: IconAlert, title: 'Emergency Request', desc: 'O+ blood needed in Mirpur', time: '5h ago', type: 'alert' },
        { icon: IconCalendar, title: 'Scheduled Donation', desc: 'Square Hospital - Tomorrow 10 AM', time: '1d ago', type: 'info' },
        { icon: IconHeart, title: 'New Badge Earned', desc: 'You earned "Lifesaver" badge', time: '2d ago', type: 'success' },
        { icon: IconMapPin, title: 'Location Updated', desc: 'Changed to Dhanmondi, Dhaka', time: '3d ago', type: 'warning' },
    ];

    const nearbyDonors = [
        { name: 'Rahim Uddin', bloodGroup: 'A+', distance: '2.3 km', status: 'available' },
        { name: 'Sadia Akter', bloodGroup: 'O-', distance: '4.1 km', status: 'available' },
        { name: 'Kamal Hossain', bloodGroup: 'B+', distance: '5.7 km', status: 'unavailable' },
        { name: 'Nusrat Jahan', bloodGroup: 'AB+', distance: '3.2 km', status: 'available' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* ==================== TOP HEADER ==================== */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Welcome back, <span className="font-medium text-red-500">{userData?.fullName}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 transition shadow-sm">
                            <IconBell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/profile')}
                            className="flex items-center gap-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-2.5 text-sm font-medium hover:border-red-300 dark:hover:border-red-800 transition shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-xs">
                                {initials}
                            </div>
                            <span className="hidden sm:inline text-gray-700 dark:text-gray-300">View Profile</span>
                        </button>
                    </div>
                </div>

                {/* ==================== STATS GRID ==================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>

                {/* ==================== MAIN GRID ==================== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Availability & Status Card */}
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-[2px]">
                                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-900 flex items-center justify-center">
                                                <span className="text-xl font-bold text-red-500">{userData?.bloodGroup}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.fullName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${availability
                                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${availability ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                                                {availability ? 'Available to Donate' : 'Currently Unavailable'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            checked={availability}
                                            onChange={handleAvailability}
                                            type="checkbox"
                                            className="peer sr-only"
                                        />
                                        <div className="h-8 w-14 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 peer-checked:bg-red-500" />
                                        <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-6" />
                                    </label>
                                    <button
                                        onClick={() => navigate('/dashboard/edit-profile')}
                                        className="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition shadow-sm"
                                    >
                                        <IconEdit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bars */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="text-center">
                                    <CircularProgress value={8} max={20} color="red" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Donation Goal</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">8 of 20</p>
                                </div>
                                <div className="text-center">
                                    <CircularProgress value={3} max={4} color="emerald" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This Year</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">3 donations</p>
                                </div>
                                <div className="text-center">
                                    <CircularProgress value={94} max={100} color="blue" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Response Rate</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">94%</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                                <button className="text-sm text-red-500 hover:text-red-600 font-medium">View All</button>
                            </div>
                            <div className="space-y-1">
                                {recentActivity.map((activity, i) => (
                                    <ActivityItem key={i} {...activity} />
                                ))}
                            </div>
                        </div>

                        {/* Monthly Donation Chart (Visual) */}
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Donation Analytics</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly donation trend</p>
                                </div>
                                <select className="text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300">
                                    <option>Last 6 Months</option>
                                    <option>Last Year</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-2 h-40">
                                {[
                                    { month: 'Jan', value: 1, height: '20%' },
                                    { month: 'Feb', value: 2, height: '40%' },
                                    { month: 'Mar', value: 1, height: '20%' },
                                    { month: 'Apr', value: 3, height: '60%' },
                                    { month: 'May', value: 2, height: '40%' },
                                    { month: 'Jun', value: 3, height: '60%' },
                                ].map((bar, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="w-full relative">
                                            <div
                                                className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-red-400 opacity-80 group-hover:opacity-100 transition-all duration-300"
                                                style={{ height: '120px' }}
                                            >
                                                <div
                                                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-red-600 to-rose-400"
                                                    style={{ height: bar.height }}
                                                />
                                            </div>
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">{bar.value}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{bar.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (1/3) */}
                    <div className="space-y-6">
                        {/* Quick Profile Summary */}
                        <div className="rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-lg shadow-red-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                                    {initials}
                                </div>
                                <div>
                                    <p className="font-semibold">{userData?.fullName}</p>
                                    <p className="text-xs text-red-100">Blood Donor • Verified</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/10 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold">{userData?.age}</p>
                                    <p className="text-xs text-red-100">Years</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold">{userData?.bloodGroup}</p>
                                    <p className="text-xs text-red-100">Blood</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/profile')}
                                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                                <IconEye className="w-4 h-4" />
                                View Full Profile
                            </button>
                        </div>

                        {/* Nearby Donors */}
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nearby Donors</h3>
                                <button
                                    onClick={() => navigate('/find-donor')}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                    Find More
                                </button>
                            </div>
                            <div className="space-y-2">
                                {nearbyDonors.map((donor, i) => (
                                    <NearbyDonorCard key={i} {...donor} />
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Schedule */}
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                        <IconCalendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Next Donation</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Square Hospital • Jul 25, 2026</p>
                                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1">65 days since last donation</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <IconClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Eligibility Check</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Available in 12 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Health Tip */}
                        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/20">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <IconHeart className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm mb-1">Health Tip</p>
                                    <p className="text-xs text-emerald-100 leading-relaxed">
                                        Drink plenty of water before donating. Stay hydrated for the next 24 hours after donation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;