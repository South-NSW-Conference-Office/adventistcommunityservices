const DEFAULT_PRODUCTION_API_URL = 'https://api.communityservices.org.au';

// Empty string keeps dev requests relative (`/api/...`) so they pass through the
// Vite dev proxy in vite.config.ts. The proxy talks to the API server-side, which
// avoids the production CORS allowlist rejecting `http://localhost:5173`.
// Set VITE_API_URL to hit a backend directly instead (e.g. a local acs-backend).
const DEFAULT_DEVELOPMENT_API_URL = '';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? DEFAULT_PRODUCTION_API_URL
    : DEFAULT_DEVELOPMENT_API_URL);
