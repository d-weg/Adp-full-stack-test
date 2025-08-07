interface HttpClientOptions {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export const createHttpClient = (options: HttpClientOptions = {}) => {
  const {
    baseUrl = "",
    timeout = 30000,
    headers: defaultHeaders = {},
  } = options;

  const request = async <T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> => {
    const {
      method = "GET",
      headers = {},
      body,
      timeout: requestTimeout = timeout,
    } = options;

    const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

    try {
      const response = await fetch(url, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${requestTimeout}ms`);
        }
        throw error;
      }

      throw new Error("Unknown error occurred");
    }
  };

  const get = <T = unknown>(
    endpoint: string,
    options: Omit<RequestOptions, "method"> = {}
  ) => request<T>(endpoint, { ...options, method: "GET" });

  const post = <T = unknown>(
    endpoint: string,
    body?: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ) => request<T>(endpoint, { ...options, method: "POST", body });

  const put = <T = unknown>(
    endpoint: string,
    body?: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ) => request<T>(endpoint, { ...options, method: "PUT", body });

  const del = <T = unknown>(
    endpoint: string,
    options: Omit<RequestOptions, "method"> = {}
  ) => request<T>(endpoint, { ...options, method: "DELETE" });

  return { request, get, post, put, delete: del };
};
