
const EmptyState = ({ onRefresh }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/40 px-4 py-6 sm:px-6 lg:px-8 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20 flex items-center justify-center">
        <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Profile Data</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your profile information is not available. Please complete your registration or try refreshing.
            </p>
            <button
                onClick={onRefresh}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
            </button>
        </div>
    </div>
);

export default EmptyState;