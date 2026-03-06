"use client";
import { useEffect, useState } from "react";
import { api, type HistoryItem } from "@/services/api";
import {
    History,
    User,
    Bot,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Search,
} from "lucide-react";

function HistoryCard({ item, index }: { item: HistoryItem; index: number }) {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (d: string | null) =>
        d
            ? new Date(d).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "—";

    return (
        <div
            className="glass-card"
            style={{
                overflow: "hidden",
                animation: `fadeIn 0.35s ease ${index * 0.06}s both`,
            }}
        >
            {/* Header row */}
            <div
                style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    cursor: "pointer",
                }}
                onClick={() => setExpanded((p) => !p)}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background:
                            "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(59,130,246,0.2))",
                        border: "1px solid rgba(0,212,255,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#00d4ff",
                        flexShrink: 0,
                    }}
                >
                    {item.patient_name[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontWeight: 600,
                            fontSize: "15px",
                            marginBottom: "4px",
                        }}
                    >
                        {item.patient_name}
                    </div>
                    <div
                        style={{
                            fontSize: "13px",
                            color: "#8888aa",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {item.patient_query}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: "rgba(34,197,94,0.15)",
                            color: "#22c55e",
                            border: "1px solid rgba(34,197,94,0.3)",
                        }}
                    >
                        <CheckCircle size={10} />
                        Resolved
                    </span>
                    <span style={{ fontSize: "12px", color: "#555577" }}>
                        {formatDate(item.approved_at)}
                    </span>
                    {expanded ? (
                        <ChevronUp size={16} color="#8888aa" />
                    ) : (
                        <ChevronDown size={16} color="#8888aa" />
                    )}
                </div>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {/* Patient query */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "10px",
                            }}
                        >
                            <User size={13} color="#00d4ff" />
                            <span
                                style={{ fontSize: "12px", fontWeight: 600, color: "#00d4ff" }}
                            >
                                ORIGINAL QUERY
                            </span>
                        </div>
                        <div
                            style={{
                                background: "rgba(0,212,255,0.04)",
                                border: "1px solid rgba(0,212,255,0.1)",
                                borderRadius: "10px",
                                padding: "14px",
                                fontSize: "14px",
                                lineHeight: "1.6",
                                color: "#ddddf0",
                            }}
                        >
                            {item.patient_query}
                        </div>
                    </div>

                    {/* AI suggestion */}
                    {item.ai_suggestion && (
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "10px",
                                }}
                            >
                                <Bot size={13} color="#a855f7" />
                                <span
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#a855f7",
                                    }}
                                >
                                    AI SUGGESTION
                                </span>
                            </div>
                            <div
                                style={{
                                    background: "rgba(168,85,247,0.04)",
                                    border: "1px solid rgba(168,85,247,0.1)",
                                    borderRadius: "10px",
                                    padding: "14px",
                                    fontSize: "14px",
                                    lineHeight: "1.6",
                                    color: "#ddddf0",
                                }}
                            >
                                {item.ai_suggestion}
                            </div>
                        </div>
                    )}

                    {/* Final response */}
                    {item.edited_response && (
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "10px",
                                }}
                            >
                                <CheckCircle size={13} color="#22c55e" />
                                <span
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#22c55e",
                                    }}
                                >
                                    FINAL SENT RESPONSE
                                </span>
                            </div>
                            <div
                                style={{
                                    background: "rgba(34,197,94,0.04)",
                                    border: "1px solid rgba(34,197,94,0.12)",
                                    borderRadius: "10px",
                                    padding: "14px",
                                    fontSize: "14px",
                                    lineHeight: "1.6",
                                    color: "#ddddf0",
                                }}
                            >
                                {item.edited_response}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api
            .getHistory()
            .then(setHistory)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = history.filter(
        (h) =>
            h.patient_query.toLowerCase().includes(search.toLowerCase()) ||
            h.patient_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: "40px", maxWidth: "900px" }}>
            <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                    <History size={24} color="#00d4ff" />
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: 800,
                            margin: 0,
                            background: "linear-gradient(135deg, #f0f0ff, #8888cc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Query History
                    </h1>
                </div>
                <p style={{ color: "#8888aa", fontSize: "14px" }}>
                    {history.length} resolved conversation{history.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "24px" }}>
                <Search size={16} color="#8888aa" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                    type="text"
                    placeholder="Search history..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "11px 14px 11px 40px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "#f0f0ff",
                        fontSize: "14px",
                        outline: "none",
                    }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#8888aa" }}>Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
                    <History size={48} color="#333355" style={{ margin: "0 auto 16px" }} />
                    <p style={{ color: "#8888aa", margin: 0 }}>
                        {history.length === 0
                            ? "No resolved queries yet. Approve a response to see it here."
                            : "No results match your search."}
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {filtered.map((item, i) => (
                        <HistoryCard key={item.id} item={item} index={i} />
                    ))}
                </div>
            )}

            <style>{`input::placeholder{color:#444466}input:focus{border-color:rgba(0,212,255,0.4)!important}`}</style>
        </div>
    );
}
