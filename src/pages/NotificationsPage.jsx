// pages/NotificationsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyContactRequestsQuery, useUpdateRequestStatusMutation } from '../redux/features/auth/authApiSlice';

const IconUser = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
    </svg>
);

const IconCheck = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const IconX = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const IconClock = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconPhone = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const IconEmail = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const IconMapPin = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { data: contactRequests, isLoading } = useGetMyContactRequestsQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateRequestStatusMutation();

    // Directly use API response with sender object
    const requests = contactRequests?.data || [];
    const pendingRequests = requests.filter(r => r.status === "PENDING");
    const acceptedRequests = requests.filter(r => r.status === "ACCEPTED");
    const rejectedRequests = requests.filter(r => r.status === "REJECTED");

    const handleAccept = async (requestId) => {
        try {
            await updateStatus({ requestId, status: "ACCEPTED" }).unwrap();
        } catch (err) {
            console.error("Failed to accept:", err);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await updateStatus({ requestId, status: "REJECTED" }).unwrap();
        } catch (err) {
            console.error("Failed to reject:", err);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            You have {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-red-300 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            Pending Requests
                        </h2>
                        <div className="space-y-4">
                            {pendingRequests.map((request) => {
                                // Directly access sender from request object
                                const sender = request.sender || {};
                                const senderName = sender.fullName || "Unknown User";
                                const senderBlood = sender.bloodGroup || "—";
                                const senderDistrict = sender.district || "—";
                                const senderUpazila = sender.upazila || "";
                                const senderPhone = sender.phoneNumber || "—"; // ← API field name
                                const senderAge = sender.age || "—";
                                const senderGender = sender.gender || "—";
                                const senderEmail = sender.email || "—";

                                return (
                                    <div
                                        key={request.id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                            {/* Avatar */}
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                                {senderName.charAt(0)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {senderName}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <span className="px-2 py-0.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full border border-red-100 dark:border-red-800">
                                                                {senderBlood}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <IconUser className="w-3 h-3" />
                                                                {senderAge} yrs • {senderGender}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <IconClock className="w-3 h-3" />
                                                                {formatTime(request.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Message */}
                                                {request.message && (
                                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            "{request.message}"
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Location */}
                                                <div className="mt-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <IconMapPin className="w-4 h-4" />
                                                    {senderUpazila ? `${senderUpazila}, ` : ''}{senderDistrict}
                                                </div>

                                                {/* Contact Info - Phone & Email */}
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    {/* Phone Number - এখন কাজ করবে! */}
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-200 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/30">
                                                        <IconPhone className="w-4 h-4 text-green-500" />
                                                        <span className="font-semibold">{senderPhone}</span>
                                                    </div>

                                                    {/* Email */}
                                                    {senderEmail !== "—" && (
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-blue-950/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                                            <IconEmail className="w-4 h-4 text-blue-500" />
                                                            <span className="font-semibold">{senderEmail}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleAccept(request.id)}
                                                    disabled={isUpdating}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition shadow-sm hover:shadow-emerald-500/25 disabled:opacity-50"
                                                >
                                                    <IconCheck className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request.id)}
                                                    disabled={isUpdating}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold transition border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                                                >
                                                    <IconX className="w-4 h-4" />
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Accepted Requests */}
                {acceptedRequests.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            Accepted
                        </h2>
                        <div className="space-y-3">
                            {acceptedRequests.map((request) => {
                                const sender = request.sender || {};
                                return (
                                    <div
                                        key={request.id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <IconCheck className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {sender.fullName || "Unknown"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Blood: {sender.bloodGroup || "—"} • Phone: {sender.phoneNumber || "—"}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Accepted {formatTime(request.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Rejected Requests */}
                {rejectedRequests.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            Declined
                        </h2>
                        <div className="space-y-3">
                            {rejectedRequests.map((request) => {
                                const sender = request.sender || {};
                                return (
                                    <div
                                        key={request.id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 opacity-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                                <IconX className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {sender.fullName || "Unknown"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Blood: {sender.bloodGroup || "—"} • Declined {formatTime(request.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {requests.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            When someone contacts you, you'll see their request here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}