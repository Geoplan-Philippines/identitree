const DEFAULT_API_BASE_URL = "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly details: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      DEFAULT_API_BASE_URL;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers } = options;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const data = await this.parseResponse(response);

    if (!response.ok) {
      const message =
        this.extractErrorMessage(data) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(response.status, data, message);
    }

    return data as T;
  }

  post<T>(path: string, body: unknown, headers?: HeadersInit) {
    return this.request<T>(path, { method: "POST", body, headers });
  }

  private async parseResponse(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  private extractErrorMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") return null;
    if ("message" in payload && typeof payload.message === "string") {
      return payload.message;
    }
    if ("error" in payload && typeof payload.error === "string") {
      return payload.error;
    }

    return null;
  }
}

export const apiClient = new ApiClient();
