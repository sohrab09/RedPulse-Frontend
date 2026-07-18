const ErrorState = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/40 px-4 py-6 sm:px-6 lg:px-8 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20 flex items-center justify-center">
        <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connection Error</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {error?.data?.message || error?.message || "Unable to load your profile. Please check your internet connection and try again."}
            </p>
            <button
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
            </button>
        </div>
    </div>
);

export default ErrorState