const DEFAULT_PRODUCTION_API_URL = 'https://api.communityservices.org.au';
const DEFAULT_DEVELOPMENT_API_URL = 'http://localhost:5000';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? DEFAULT_PRODUCTION_API_URL
    : DEFAULT_DEVELOPMENT_API_URL);
