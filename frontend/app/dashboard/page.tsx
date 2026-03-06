"use client";
import { useEffect, useState } from "react";
import { api, type Stats, type Query } from "@/services/api";
import {
    MessageSquare,
    Clock,
    Sparkles,
    CheckCircle,
    TrendingUp,
    Plus,
    X,
    Send,
} from "lucide-react";
import Link from "next/link";

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    glow,
}: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    glow: string;
}) {
    return (
        <div
            className="glass-card"
            style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "120px",
                    height: "120px",
                    background: `radial-gradient(circle, ${glow}15 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Icon size={22} color={color} />
            </div>
            <div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#f0f0ff" }}>
                    {value}
                </div>
                <div
                    style={{ fontSize: "13px", color: "#8888aa", marginTop: "4px" }}
                >
                    {title}
                </div>
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: `linear-gradient(90deg, ${color}60, transparent)`,
                }}
            />
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentQueries, setRecentQueries] = useState<Query[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [patientName, setPatientName] = useState("");
    const [patientQuery, setPatientQuery] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [statsData, queriesData] = await Promise.all([
                api.getStats(),
                api.getQueries(),
            ]);
            setStats(statsData);
            setRecentQueries(queriesData.slice(0, 5));
        } catch {
            // Backend may not be running yet
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async () => {
        if (!patientQuery.trim()) return;
        setSubmitting(true);
        try {
            await api.submitQuery(patientQuery, patientName || "Anonymous Patient");
            setShowModal(false);
            setPatientName("");
            setPatientQuery("");
            showToast("Patient query submitted successfully!");
            fetchData();
        } catch (e: unknown) {
            showToast(e instanceof Error ? e.message : "Failed to submit query");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: "1200px" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "40px",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "30px",
                            fontWeight: 800,
                            margin: 0,
                            background: "linear-gradient(135deg, #f0f0ff, #8888cc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Dashboard
                    </h1>
                    <p style={{ color: "#8888aa", marginTop: "6px", fontSize: "14px" }}>
                        Hospital AI Response Management System
                    </p>
                </div>
                <button
                    className="btn-primary"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={16} />
                    New Query
                </button>
            </div>

            {/* Stats grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    marginBottom: "40px",
                }}
            >
                <StatCard
                    title="Total Queries"
                    value={stats?.total_queries ?? 0}
                    icon={MessageSquare}
                    color="#00d4ff"
                    glow="#00d4ff"
                />
                <StatCard
                    title="Pending Responses"
                    value={stats?.pending ?? 0}
                    icon={Clock}
                    color="#f59e0b"
                    glow="#f59e0b"
                />
                <StatCard
                    title="AI Suggestions Generated"
                    value={stats?.ai_suggestions_generated ?? 0}
                    icon={Sparkles}
                    color="#a855f7"
                    glow="#a855f7"
                />
                <StatCard
                    title="Resolved"
                    value={stats?.resolved ?? 0}
                    icon={CheckCircle}
                    color="#22c55e"
                    glow="#22c55e"
                />
            </div>

            {/* Recent queries */}
            <div className="glass-card" style={{ padding: "28px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <TrendingUp size={18} color="#00d4ff" />
                        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>
                            Recent Queries
                        </h2>
                    </div>
                    <Link
                        href="/queries"
                        style={{
                            fontSize: "13px",
                            color: "#00d4ff",
                            textDecoration: "none",
                        }}
                    >
                        View all →
                    </Link>
                </div>

                {recentQueries.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#8888aa",
                        }}
                    >
                        <MessageSquare
                            size={40}
                            color="#333355"
                            style={{ margin: "0 auto 12px" }}
                        />
                        <p style={{ margin: 0 }}>No queries yet. Submit one above!</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {recentQueries.map((q) => (
                            <Link
                                key={q.id}
                                href={`/queries/${q.id}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        padding: "16px",
                                        borderRadius: "12px",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "38px",
                                            height: "38px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #00d4ff20, #3b82f620)",
                                            border: "1px solid #00d4ff30",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            fontSize: "14px",
                                            fontWeight: 700,
                                            color: "#00d4ff",
                                        }}
                                    >
                                        {(q.patient_name ?? "A")[0]?.toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                color: "#f0f0ff",
                                            }}
                                        >
                                            {q.patient_name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                color: "#8888aa",
                                                marginTop: "2px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {q.patient_query}
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "20px",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            background:
                                                q.status === "resolved"
                                                    ? "rgba(34,197,94,0.15)"
                                                    : "rgba(245,158,11,0.15)",
                                            color:
                                                q.status === "resolved" ? "#22c55e" : "#f59e0b",
                                            border:
                                                q.status === "resolved"
                                                    ? "1px solid rgba(34,197,94,0.3)"
                                                    : "1px solid rgba(245,158,11,0.3)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {q.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* New Query Modal */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                    }}
                    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                >
                    <div
                        className="glass-card"
                        style={{
                            padding: "36px",
                            width: "520px",
                            maxWidth: "90vw",
                            border: "1px solid rgba(0,212,255,0.2)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "28px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    color: "#f0f0ff",
                                }}
                            >
                                Submit Patient Query
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#8888aa",
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        color: "#8888aa",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Patient Name (optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Smith"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "10px",
                                        color: "#f0f0ff",
                                        fontSize: "14px",
                                        outline: "none",
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        color: "#8888aa",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Patient Query *
                                </label>
                                <textarea
                                    placeholder="Describe the patient's question or concern..."
                                    value={patientQuery}
                                    onChange={(e) => setPatientQuery(e.target.value)}
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "10px",
                                        color: "#f0f0ff",
                                        fontSize: "14px",
                                        outline: "none",
                                        resize: "vertical",
                                        fontFamily: "inherit",
                                    }}
                                />
                            </div>
                            <button
                                className="btn-primary"
                                onClick={handleSubmit}
                                disabled={submitting || !patientQuery.trim()}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    marginTop: "8px",
                                }}
                            >
                                {submitting ? (
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
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Submit Query
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "32px",
                        right: "32px",
                        background: "rgba(17,17,36,0.95)",
                        border: "1px solid rgba(0,212,255,0.3)",
                        borderRadius: "12px",
                        padding: "14px 20px",
                        fontSize: "14px",
                        color: "#f0f0ff",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                        zIndex: 200,
                        animation: "fadeIn 0.3s ease",
                    }}
                >
                    ✓ {toast}
                </div>
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #444466; }
        input:focus, textarea:focus { border-color: rgba(0,212,255,0.4) !important; }
      `}</style>
        </div>
    );
}
