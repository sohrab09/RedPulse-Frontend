// components/NotificationBadge.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyContactRequestsQuery, useGetUsersQuery } from '../redux/features/auth/authApiSlice';

const IconBell = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export default function NotificationBadge() {
    const navigate = useNavigate();
    const { data: contactRequests } = useGetMyContactRequestsQuery();
    const { data: usersData } = useGetUsersQuery();

    // Create a map of users by ID for quick lookup
    const usersMap = useMemo(() => {
        const users = usersData?.data?.users || [];
        const map = {};
        users.forEach(user => {
            map[user.id] = user;
        });
        return map;
    }, [usersData]);

    // Enrich requests with sender details
    const enrichedRequests = useMemo(() => {
        const requests = contactRequests?.data || [];
        return requests.map(req => ({
            ...req,
            sender: usersMap[req.senderId] || null
        }));
    }, [contactRequests, usersMap]);

    const pendingCount = enrichedRequests.filter(r => r.status === "PENDING").length;

    return (
        <button
            onClick={() => navigate('/dashboard/notifications')}
            className="relative p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 transition shadow-sm"
        >
            <IconBell className="w-5 h-5" />
            {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    {pendingCount > 99 ? '99+' : pendingCount}
                </span>
            )}
        </button>
    );
}