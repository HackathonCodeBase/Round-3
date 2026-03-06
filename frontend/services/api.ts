const API_BASE = "http://localhost:8000";

export interface Query {
    id: number;
    patient_name: string;
    patient_query: string;
    created_at: string;
    status: "pending" | "resolved";
}

export interface HistoryItem {
    id: number;
    patient_name: string;
    patient_query: string;
    created_at: string;
    status: string;
    ai_suggestion: string | null;
    edited_response: string | null;
    approved_at: string | null;
}

export interface Stats {
    total_queries: number;
    pending: number;
    resolved: number;
    ai_suggestions_generated: number;
}

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...opts,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
}

export const api = {
    submitQuery: (patient_query: string, patient_name?: string) =>
        request<Query>("/query", {
            method: "POST",
            body: JSON.stringify({ patient_query, patient_name }),
        }),

    generateResponse: (query_id: number) =>
        request<{ query_id: number; ai_suggestion: string; response_id: number }>(
            "/generate-response",
            { method: "POST", body: JSON.stringify({ query_id }) }
        ),

    sendResponse: (query_id: number, edited_response: string) =>
        request<{ message: string; query_id: number }>("/send-response", {
            method: "POST",
            body: JSON.stringify({ query_id, edited_response }),
        }),

    getQueries: () => request<Query[]>("/queries"),

    getHistory: () => request<HistoryItem[]>("/history"),

    getStats: () => request<Stats>("/stats"),
};
