const BLOCK_KEY = 'redpulse_rate_limit';
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export const rateLimitStorage = {
    // Check if currently blocked
    isBlocked() {
        const data = localStorage.getItem(BLOCK_KEY);
        if (!data) return false;

        const { blockedUntil } = JSON.parse(data);
        const now = Date.now();

        if (now > blockedUntil) {
            // Block expired, clean up
            localStorage.removeItem(BLOCK_KEY);
            return false;
        }

        return true;
    },

    // Get remaining block time in seconds
    getRemainingTime() {
        const data = localStorage.getItem(BLOCK_KEY);
        if (!data) return 0;

        const { blockedUntil } = JSON.parse(data);
        const remaining = Math.ceil((blockedUntil - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
    },

    // Get remaining time formatted (e.g., "9m 45s")
    getFormattedRemainingTime() {
        const seconds = this.getRemainingTime();
        if (seconds <= 0) return '';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    },

    // Set block (called on 429 error)
    setBlock() {
        const blockedUntil = Date.now() + BLOCK_DURATION_MS;
        localStorage.setItem(BLOCK_KEY, JSON.stringify({
            blockedUntil,
            blockedAt: Date.now(),
            attempts: 5 // max attempts used
        }));
    },

    // Get attempt count
    getAttempts() {
        const data = localStorage.getItem(BLOCK_KEY);
        if (!data) return 0;
        return JSON.parse(data).attempts || 0;
    },

    // Clear block (manual or after expiry)
    clearBlock() {
        localStorage.removeItem(BLOCK_KEY);
    }
};