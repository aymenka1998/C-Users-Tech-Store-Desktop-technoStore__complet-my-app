/**
 * Production-safe logging utility
 * Only logs in development environment
 */

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },

  error: (message: string, error?: unknown) => {
    // Always log errors, but avoid sensitive data in production
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`, { message: errorMsg });
    }
  },

  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },
};
