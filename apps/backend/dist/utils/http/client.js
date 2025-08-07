"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpClient = void 0;
const createHttpClient = (options = {}) => {
    const { baseUrl = "", timeout = 30000, headers: defaultHeaders = {}, } = options;
    const request = async (endpoint, options = {}) => {
        const { method = "GET", headers = {}, body, timeout: requestTimeout = timeout, } = options;
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
        }
        catch (error) {
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
    const get = (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" });
    const post = (endpoint, body, options = {}) => request(endpoint, { ...options, method: "POST", body });
    const put = (endpoint, body, options = {}) => request(endpoint, { ...options, method: "PUT", body });
    const del = (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" });
    return { request, get, post, put, delete: del };
};
exports.createHttpClient = createHttpClient;
//# sourceMappingURL=client.js.map