const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";
const AUTH_API_PATH = "/auth";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function withLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function getApiBaseUrl() {
  // Server-side: prefer internal URL for Docker inter-container networking
  if (typeof window === "undefined" && process.env.INTERNAL_API_BASE_URL) {
    return trimTrailingSlash(process.env.INTERNAL_API_BASE_URL);
  }

  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
  );
}

export function createApiUrl(path: string, baseUrl = getApiBaseUrl()) {
  return `${trimTrailingSlash(baseUrl)}${withLeadingSlash(path)}`;
}

export function getAuthApiBaseUrl() {
  return createApiUrl(AUTH_API_PATH);
}
