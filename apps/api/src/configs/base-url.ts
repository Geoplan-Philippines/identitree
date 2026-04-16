const DEFAULT_API_PATH = '/api';
const DEFAULT_AUTH_ORIGIN = 'http://localhost:8000';

function normalizeBasePath(value: string | undefined, fallback: string) {
  if (!value) return fallback;

  try {
    const pathname = new URL(value).pathname.replace(/\/+$/, '');
    return pathname || fallback;
  } catch {
    if (value.startsWith('/')) {
      const pathname = value.replace(/\/+$/, '');
      return pathname || fallback;
    }

    return fallback;
  }
}

export function getAuthBaseURL(value: string | undefined) {
  if (value) {
    try {
      const parsed = new URL(value);
      const pathname = parsed.pathname.replace(/\/+$/, '') || DEFAULT_API_PATH;
      const authPath = pathname.endsWith('/auth')
        ? pathname
        : `${pathname}/auth`;
      return `${parsed.origin}${authPath}`;
    } catch {
      if (value.startsWith('/')) {
        const path = normalizeBasePath(value, DEFAULT_API_PATH);
        const authPath = path.endsWith('/auth') ? path : `${path}/auth`;
        return `${DEFAULT_AUTH_ORIGIN}${authPath}`;
      }
    }
  }

  const apiBasePath = normalizeBasePath(undefined, DEFAULT_API_PATH);
  const authPath = apiBasePath.endsWith('/auth')
    ? apiBasePath
    : `${apiBasePath}/auth`;

  return `${DEFAULT_AUTH_ORIGIN}${authPath}`;
}
