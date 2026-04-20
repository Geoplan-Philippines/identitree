const DEFAULT_API_PATH = "/api/v1";
const DEFAULT_LOCAL_ORIGIN = "http://localhost:8000";

function isLocalHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0"
  );
}

function withAuthPath(pathname: string) {
  return pathname.endsWith("/auth") ? pathname : `${pathname}/auth`;
}

function normalizeBasePath(value: string | undefined, fallback: string) {
  if (!value) return fallback;

  try {
    const pathname = new URL(value).pathname.replace(/\/+$/, "");
    return pathname || fallback;
  } catch {
    if (value.startsWith("/")) {
      const pathname = value.replace(/\/+$/, "");
      return pathname || fallback;
    }

    return fallback;
  }
}

export function getApiBasePath() {
  return normalizeBasePath(
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL,
    DEFAULT_API_PATH,
  );
}

export function getApiBaseURL() {
  // Server-side: prefer internal URL for Docker inter-container networking
  if (typeof window === "undefined" && process.env.INTERNAL_API_BASE_URL) {
    return process.env.INTERNAL_API_BASE_URL.replace(/\/+$/, "");
  }

  const configuredBaseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

  if (configuredBaseURL) {
    try {
      const parsed = new URL(configuredBaseURL);
      const pathname = parsed.pathname.replace(/\/+$/, "") || DEFAULT_API_PATH;
      return `${parsed.origin}${pathname}`;
    } catch {
      const path = normalizeBasePath(configuredBaseURL, DEFAULT_API_PATH);

      if (typeof window !== "undefined") {
        if (isLocalHostname(window.location.hostname)) {
          return `${DEFAULT_LOCAL_ORIGIN}${path}`;
        }

        return path;
      }

      return `${DEFAULT_LOCAL_ORIGIN}${path}`;
    }
  }

  if (typeof window !== "undefined") {
    if (isLocalHostname(window.location.hostname)) {
      return `${DEFAULT_LOCAL_ORIGIN}${DEFAULT_API_PATH}`;
    }

    return DEFAULT_API_PATH;
  }

  return `${DEFAULT_LOCAL_ORIGIN}${DEFAULT_API_PATH}`;
}

export function getAuthBasePath() {
  const apiBasePath = getApiBasePath();

  return withAuthPath(apiBasePath);
}

export function getAuthBaseURL() {
  // Server-side: prefer internal URL for Docker inter-container networking
  if (typeof window === "undefined" && process.env.INTERNAL_API_BASE_URL) {
    const internalBase = process.env.INTERNAL_API_BASE_URL.replace(/\/+$/, "");
    return withAuthPath(internalBase);
  }

  const authPath = getAuthBasePath();
  const configuredBaseURL =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  if (configuredBaseURL) {
    try {
      const parsed = new URL(configuredBaseURL);
      const pathname = parsed.pathname.replace(/\/+$/, "");
      const basePath = pathname || DEFAULT_API_PATH;
      return `${parsed.origin}${withAuthPath(basePath)}`;
    } catch {
      if (configuredBaseURL.startsWith("/") && typeof window !== "undefined") {
        if (isLocalHostname(window.location.hostname)) {
          return `${DEFAULT_LOCAL_ORIGIN}${authPath}`;
        }

        return `${window.location.origin}${authPath}`;
      }
    }
  }

  if (typeof window !== "undefined") {
    if (isLocalHostname(window.location.hostname)) {
      return `${DEFAULT_LOCAL_ORIGIN}${authPath}`;
    }

    return `${window.location.origin}${authPath}`;
  }

  return `${DEFAULT_LOCAL_ORIGIN}${authPath}`;
}
