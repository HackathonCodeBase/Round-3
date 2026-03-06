"use client";
import { useEffect, useState, use } from "react";
import { api, type Query } from "@/services/api";
import {
    Sparkles,
    RefreshCw,
    CheckCircle,
    Edit3,
    ArrowLeft,
    User,
    Clock,
    Bot,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface WorkspaceState {
    query: Query | null;
    aiSuggestion: string;
    editedResponse: string;
    loadingAI: boolean;
    sending: boolean;
    error: string | null;
    toast: string | null;
    sent: boolean;
}

export default function ResponseWorkspace({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const queryId = parseInt(resolvedParams.id, 10);

    const [state, setState] = useState<WorkspaceState>({
        query: null,
        aiSuggestion: "",
        editedResponse: "",
        loadingAI: false,
        sending: false,
        error: null,
        toast: null,
        sent: false,
    });

    const set = (patch: Partial<WorkspaceState>) =>
        setState((s) => ({ ...s, ...patch }));

    const showToast = (msg: string) => {
        set({ toast: msg });
        setTimeout(() => set({ toast: null }), 3500);
    };

    // Fetch query details
    useEffect(() => {
        const load = async () => {
            try {
                const queries = await api.getQueries();
                const q = queries.find((q) => q.id === queryId) ?? null;
                set({ query: q });
            } catch {
                set({ error: "Could not load query. Is the backend running?" });
            }
        };
        load();
    }, [queryId]);

    const handleGenerate = async () => {
        set({ loadingAI: true, error: null, aiSuggestion: "" });
        try {
            const res = await api.generateResponse(queryId);
            set({
                aiSuggestion: res.ai_suggestion,
                editedResponse: res.ai_suggestion,
                loadingAI: false,
            });
        } catch (e: unknown) {
            set({
                loadingAI: false,
                error:
                    e instanceof Error
                        ? e.message
                        : "Failed to generate response. Check your Groq API key.",
            });
        }
    };

    const handleApprove = async () => {
        if (!state.editedResponse.trim()) return;
        set({ sending: true });
        try {
            await api.sendResponse(queryId, state.editedResponse);
            set({ sending: false, sent: true });
            showToast("Response approved and sent successfully!");
        } catch (e: unknown) {
            set({
                sending: false,
                error: e instanceof Error ? e.message : "Failed to send response",
            });
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div style={{ padding: "40px", maxWidth: "900px" }}>
            {/* Back */}
            <Link
                href="/queries"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#8888aa",
                    textDecoration: "none",
                    marginBottom: "24px",
                }}
            >
                <ArrowLeft size={14} />
                Back to Query Inbox
            </Link>

            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1
                    style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #f0f0ff, #8888cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Response Workspace
                </h1>
                <p style={{ color: "#8888aa", marginTop: "6px", fontSize: "14px" }}>
                    Review and approve AI-suggested reply before sending
                </p>
            </div>

            {state.error && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "14px 18px",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "12px",
                        color: "#f87171",
                        fontSize: "14px",
                        marginBottom: "24px",
                    }}
                >
                    <AlertCircle size={16} />
                    {state.error}
                </div>
            )}

            {/* Patient query card */}
            <div
                className="glass-card"
                style={{ padding: "28px", marginBottom: "20px" }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "18px",
                    }}
                >
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(59,130,246,0.2))",
                            border: "1px solid rgba(0,212,255,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <User size={15} color="#00d4ff" />
                    </div>
                    <span
                        style={{ fontSize: "14px", fontWeight: 600, color: "#00d4ff" }}
                    >
                        Patient Query
                    </span>
                    {state.query && (
                        <span style={{ marginLeft: "auto", fontSize: "12px", color: "#555577" }}>
                            <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                            {formatDate(state.query.created_at)}
                        </span>
                    )}
                </div>

                {state.query ? (
                    <>
                        <div
                            style={{
                                fontSize: "13px",
                                color: "#8888aa",
                                marginBottom: "10px",
                            }}
                        >
                            From:{" "}
                            <span style={{ color: "#f0f0ff", fontWeight: 500 }}>
                                {state.query.patient_name}
                            </span>
                        </div>
                        <div
                            style={{
                                background: "rgba(0,212,255,0.04)",
                                border: "1px solid rgba(0,212,255,0.1)",
                                borderRadius: "12px",
                                padding: "18px",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#ddddf0",
                            }}
                        >
                            {state.query.patient_query}
                        </div>
                    </>
                ) : (
                    <div style={{ color: "#8888aa" }}>Loading query...</div>
                )}
            </div>

            {/* AI Suggestion */}
            <div
                className="glass-card"
                style={{ padding: "28px", marginBottom: "20px" }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "18px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))",
                                border: "1px solid rgba(168,85,247,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Bot size={15} color="#a855f7" />
                        </div>
                        <span
                            style={{ fontSize: "14px", fontWeight: 600, color: "#a855f7" }}
                        >
                            AI Suggested Response
                        </span>
                        <span
                            style={{
                                fontSize: "11px",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                background: "rgba(168,85,247,0.1)",
                                color: "#a855f7",
                                border: "1px solid rgba(168,85,247,0.2)",
                            }}
                        >
                            Llama 3.3 · Groq
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                        {state.aiSuggestion && (
                            <button
                                className="btn-secondary"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "13px",
                                    padding: "8px 14px",
                                }}
                                onClick={handleGenerate}
                                disabled={state.loadingAI}
                            >
                                <RefreshCw size={13} />
                                Regenerate
                            </button>
                        )}
                        <button
                            className="btn-primary"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "13px",
                                padding: "8px 16px",
                            }}
                            onClick={handleGenerate}
                            disabled={state.loadingAI || state.sent}
                        >
                            {state.loadingAI ? (
                                <>
                                    <div
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                            border: "2px solid rgba(255,255,255,0.3)",
                                            borderTopColor: "#fff",
                                            borderRadius: "50%",
                                            animation: "spin 0.8s linear infinite",
                                        }}
                                    />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={13} />
                                    {state.aiSuggestion ? "Re-generate" : "Generate AI Suggestion"}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* AI suggestion box */}
                {state.loadingAI ? (
                    <div
                        style={{
                            background: "rgba(168,85,247,0.04)",
                            border: "1px solid rgba(168,85,247,0.1)",
                            borderRadius: "12px",
                            padding: "28px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "#a855f7" }}>
                            <div
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "2px solid rgba(168,85,247,0.3)",
                                    borderTopColor: "#a855f7",
                                    borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                }}
                            />
                            <span style={{ fontSize: "14px" }}>
                                Groq is drafting a response...
                            </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#555577", marginTop: "8px" }}>
                            This usually takes a few seconds
                        </p>
                    </div>
                ) : state.aiSuggestion ? (
                    <div
                        style={{
                            background: "rgba(168,85,247,0.04)",
                            border: "1px solid rgba(168,85,247,0.1)",
                            borderRadius: "12px",
                            padding: "18px",
                            fontSize: "14px",
                            lineHeight: "1.7",
                            color: "#ddddf0",
                        }}
                    >
                        {state.aiSuggestion}
                    </div>
                ) : (
                    <div
                        style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px dashed rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "32px",
                            textAlign: "center",
                            color: "#555577",
                            fontSize: "14px",
                        }}
                    >
                        Click "Generate AI Suggestion" to get a draft response
                    </div>
                )}
            </div>

            {/* Editable response */}
            <div
                className="glass-card"
                style={{ padding: "28px", marginBottom: "20px" }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "16px",
                    }}
                >
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(0,212,255,0.2))",
                            border: "1px solid rgba(34,197,94,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Edit3 size={15} color="#22c55e" />
                    </div>
                    <span
                        style={{ fontSize: "14px", fontWeight: 600, color: "#22c55e" }}
                    >
                        Your Response (Editable)
                    </span>
                </div>

                <textarea
                    value={state.editedResponse}
                    onChange={(e) => set({ editedResponse: e.target.value })}
                    placeholder="Edit the AI suggestion above, or type your own response here..."
                    rows={7}
                    disabled={state.sent}
                    style={{
                        width: "100%",
                        padding: "16px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(34,197,94,0.15)",
                        borderRadius: "12px",
                        color: "#f0f0ff",
                        fontSize: "14px",
                        lineHeight: "1.7",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s ease",
                    }}
                />
                <div
                    style={{
                        fontSize: "12px",
                        color: "#555577",
                        marginTop: "8px",
                        textAlign: "right",
                    }}
                >
                    {state.editedResponse.length} characters
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <Link href="/queries">
                    <button className="btn-secondary" style={{ fontSize: "14px" }}>
                        Cancel
                    </button>
                </Link>
                <button
                    className="btn-primary"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                        padding: "12px 24px",
                        background: state.sent
                            ? "linear-gradient(135deg, #22c55e, #16a34a)"
                            : "linear-gradient(135deg, #00d4ff, #3b82f6)",
                    }}
                    onClick={handleApprove}
                    disabled={state.sending || !state.editedResponse.trim() || state.sent}
                >
                    {state.sending ? (
                        <>
                            <div
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "#fff",
                                    borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                }}
                            />
                            Sending...
                        </>
                    ) : state.sent ? (
                        <>
                            <CheckCircle size={16} />
                            Response Sent!
                        </>
                    ) : (
                        <>
                            <CheckCircle size={16} />
                            Approve &amp; Send
                        </>
                    )}
                </button>
            </div>

            {/* Toast */}
            {state.toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "32px",
                        right: "32px",
                        background: "rgba(17,17,36,0.95)",
                        border: "1px solid rgba(34,197,94,0.4)",
                        borderRadius: "12px",
                        padding: "14px 20px",
                        fontSize: "14px",
                        color: "#22c55e",
                        zIndex: 200,
                        animation: "fadeIn 0.3s ease",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                >
                    ✓ {state.toast}
                </div>
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: #444466; }
        textarea:focus { border-color: rgba(34,197,94,0.4) !important; }
      `}</style>
        </div>
    );
}
