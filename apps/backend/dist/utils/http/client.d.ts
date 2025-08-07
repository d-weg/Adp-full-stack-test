interface HttpClientOptions {
    baseUrl?: string;
    timeout?: number;
    headers?: Record<string, string>;
}
interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}
declare const createHttpClient: (options?: HttpClientOptions) => {
    request: <T = any>(endpoint: string, options?: RequestOptions) => Promise<T>;
    get: <T = any>(endpoint: string, options?: Omit<RequestOptions, "method">) => Promise<T>;
    post: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">) => Promise<T>;
    put: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method" | "body">) => Promise<T>;
    delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, "method">) => Promise<T>;
};
export { createHttpClient };
//# sourceMappingURL=client.d.ts.map