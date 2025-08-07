module.exports = {

"[project]/apps/frontend/src/utils/http.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "createHttpClient": ()=>createHttpClient
});
const createHttpClient = (options = {})=>{
    const { baseUrl = "", timeout = 30000, headers: defaultHeaders = {} } = options;
    const request = async (endpoint, options = {})=>{
        const { method = "GET", headers = {}, body, timeout: requestTimeout = timeout } = options;
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), requestTimeout);
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    ...defaultHeaders,
                    ...headers
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
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
    const get = (endpoint, options = {})=>request(endpoint, {
            ...options,
            method: "GET"
        });
    const post = (endpoint, body, options = {})=>request(endpoint, {
            ...options,
            method: "POST",
            body
        });
    const put = (endpoint, body, options = {})=>request(endpoint, {
            ...options,
            method: "PUT",
            body
        });
    const del = (endpoint, options = {})=>request(endpoint, {
            ...options,
            method: "DELETE"
        });
    return {
        request,
        get,
        post,
        put,
        delete: del
    };
};
}),
"[project]/apps/frontend/src/services/api.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "getWorkforceData": ()=>getWorkforceData
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$utils$2f$http$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/src/utils/http.ts [app-rsc] (ecmascript)");
;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const httpClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$utils$2f$http$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createHttpClient"])({
    baseUrl: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});
async function getWorkforceData(filters) {
    const params = new URLSearchParams();
    // Handle state selection
    if (filters.selectedStates.length === 0) {
        // Send "ALL" when empty array (all states selected)
        params.append("states", "ALL");
        params.append("time", filters.selectedQuarter);
        params.append("breakdownBySex", filters.breakdownBySex.toString());
        return httpClient.get(`/v1/workforce?${params.toString()}`);
    }
    // Send each selected state as separate parameter to create array
    filters.selectedStates.forEach((state)=>{
        params.append("states", state);
    });
    params.append("time", filters.selectedQuarter);
    params.append("breakdownBySex", filters.breakdownBySex.toString());
    return httpClient.get(`/v1/workforce?${params.toString()}`);
}
}),
"[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40f562daf003f4f3b7287c5993fba840f31b72a103":"fetchEmploymentData"},"",""] */ __turbopack_context__.s({
    "fetchEmploymentData": ()=>fetchEmploymentData
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/src/services/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function fetchEmploymentData(filters) {
    try {
        if (filters.breakdownBySex && filters.selectedStates.length > 1) {
            const promises = filters.selectedStates.map((state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkforceData"])({
                    ...filters,
                    selectedStates: [
                        state
                    ]
                }));
            const results = await Promise.all(promises);
            const allFailures = results.flatMap((result)=>result.failures || []);
            const totalStates = results.reduce((sum, result)=>sum + (result.totalStates || 0), 0);
            const successfulStates = results.reduce((sum, result)=>sum + (result.successfulStates || 0), 0);
            return {
                data: results.flatMap((result)=>result.data.map((item)=>({
                            state: item.state,
                            stateCode: item.state,
                            totalEmployment: item.employeeCount,
                            maleEmployment: item.maleEmployment,
                            femaleEmployment: item.femaleEmployment,
                            failed: item.failed,
                            error: item.error
                        }))),
                failures: allFailures,
                totalStates,
                successfulStates
            };
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkforceData"])(filters);
        return {
            data: result.data.map((item)=>({
                    state: item.state,
                    stateCode: item.state,
                    totalEmployment: item.employeeCount,
                    maleEmployment: item.maleEmployment,
                    femaleEmployment: item.femaleEmployment,
                    failed: item.failed,
                    error: item.error
                })),
            failures: result.failures || [],
            totalStates: result.totalStates || 0,
            successfulStates: result.successfulStates || 0
        };
    } catch (error) {
        console.error("Error fetching employment data:", error);
        throw new Error(error instanceof Error ? error.message : "An error occurred while fetching data");
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    fetchEmploymentData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchEmploymentData, "40f562daf003f4f3b7287c5993fba840f31b72a103", null);
}),
"[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}),
"[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "40f562daf003f4f3b7287c5993fba840f31b72a103": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchEmploymentData"]
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}),
"[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "40f562daf003f4f3b7287c5993fba840f31b72a103": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40f562daf003f4f3b7287c5993fba840f31b72a103"]
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$frontend$2f$src$2f$actions$2f$census$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/apps/frontend/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/frontend/src/actions/census.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}),
"[project]/apps/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/apps/frontend/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/apps/frontend/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/apps/frontend/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/frontend/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/apps/frontend/src/screens/WorkforceStats.tsx [app-rsc] (client reference proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/frontend/src/screens/WorkforceStats.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/frontend/src/screens/WorkforceStats.tsx <module evaluation>", "default");
}),
"[project]/apps/frontend/src/screens/WorkforceStats.tsx [app-rsc] (client reference proxy)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/frontend/src/screens/WorkforceStats.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/frontend/src/screens/WorkforceStats.tsx", "default");
}),
"[project]/apps/frontend/src/screens/WorkforceStats.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$screens$2f$WorkforceStats$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/frontend/src/screens/WorkforceStats.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$screens$2f$WorkforceStats$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/frontend/src/screens/WorkforceStats.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$screens$2f$WorkforceStats$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/frontend/src/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>Home
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$screens$2f$WorkforceStats$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/src/screens/WorkforceStats.tsx [app-rsc] (ecmascript)");
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$src$2f$screens$2f$WorkforceStats$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/apps/frontend/src/app/page.tsx",
                lineNumber: 7,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/frontend/src/app/page.tsx",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/frontend/src/app/page.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/frontend/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/frontend/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__3ea46338._.js.map