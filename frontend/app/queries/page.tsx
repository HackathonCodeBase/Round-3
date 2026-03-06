"use client";
import { useEffect, useState } from "react";
import { api, type Query } from "@/services/api";
import { MessageSquare, Clock, CheckCircle, Search, Plus, X, Send } from "lucide-react";
import Link from "next/link";

export default function QueriesPage() {
    const [queries, setQueries] = useState<Query[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
    const [showModal, setShowModal] = useState(false);
    const [patientName, setPatientName] = useState("");
    const [patientQuery, setPatientQuery] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const fetchQueries = async () => {
        try {
            const data = await api.getQueries();
            setQueries(data);
        } catch {
            // backend offline
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
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
            showToast("Query submitted!");
            fetchQueries();
        } catch (e: unknown) {
            showToast(e instanceof Error ? e.message : "Error submitting");
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = queries.filter((q) => {
        const matchSearch =
            q.patient_query.toLowerCase().includes(search.toLowerCase()) ||
            q.patient_name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || q.status === filter;
        return matchSearch && matchFilter;
    });

    const formatDate = (d: string) =>
        new Date(d).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div style={{ padding: "40px", maxWidth: "1000px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #f0f0ff, #8888cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Query Inbox
                    </h1>
                    <p style={{ color: "#8888aa", marginTop: "6px", fontSize: "14px" }}>
                        {queries.filter((q) => q.status === "pending").length} pending responses
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

            {/* Search & filter */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <Search size={16} color="#8888aa" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                        type="text"
                        placeholder="Search queries or patients..."
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
                {(["all", "pending", "resolved"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: "11px 18px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            background: filter === f ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)",
                            border: filter === f ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                            color: filter === f ? "#00d4ff" : "#8888aa",
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Query list */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#8888aa" }}>Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
                    <MessageSquare size={48} color="#333355" style={{ margin: "0 auto 16px" }} />
                    <p style={{ color: "#8888aa", margin: 0 }}>
                        {queries.length === 0 ? "No queries yet. Submit the first one!" : "No results match your search."}
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {filtered.map((q, i) => (
                        <Link key={q.id} href={`/queries/${q.id}`} style={{ textDecoration: "none" }}>
                            <div
                                className="glass-card"
                                style={{
                                    padding: "22px 24px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "18px",
                                    cursor: "pointer",
                                    animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                                }}
                            >
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        flexShrink: 0,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(59,130,246,0.2))",
                                        border: "1px solid rgba(0,212,255,0.25)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "16px",
                                        fontWeight: 800,
                                        color: "#00d4ff",
                                    }}
                                >
                                    {(q.patient_name ?? "A")[0].toUpperCase()}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                        <span style={{ fontWeight: 600, fontSize: "15px" }}>{q.patient_name}</span>
                                        <span
                                            style={{
                                                padding: "3px 10px",
                                                borderRadius: "20px",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                background: q.status === "resolved" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                                                color: q.status === "resolved" ? "#22c55e" : "#f59e0b",
                                                border: q.status === "resolved" ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(245,158,11,0.3)",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {q.status === "resolved" ? <CheckCircle size={10} style={{ display: "inline", marginRight: "4px" }} /> : <Clock size={10} style={{ display: "inline", marginRight: "4px" }} />}
                                            {q.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#8888aa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {q.patient_query}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#555577", marginTop: "6px" }}>
                                        {formatDate(q.created_at)} · ID #{q.id}
                                    </div>
                                </div>

                                <div style={{ color: "#444466", fontSize: "18px", flexShrink: 0 }}>›</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
                    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                >
                    <div className="glass-card" style={{ padding: "36px", width: "520px", maxWidth: "90vw", border: "1px solid rgba(0,212,255,0.2)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Submit Patient Query</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8888aa" }}><X size={20} /></button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "13px", color: "#8888aa", marginBottom: "7px" }}>Patient Name (optional)</label>
                                <input type="text" placeholder="e.g. Jane Doe" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0ff", fontSize: "14px", outline: "none" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "13px", color: "#8888aa", marginBottom: "7px" }}>Patient Query *</label>
                                <textarea placeholder="Describe the patient's question..." value={patientQuery} onChange={(e) => setPatientQuery(e.target.value)} rows={4}
                                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0ff", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                            </div>
                            <button className="btn-primary" onClick={handleSubmit} disabled={submitting || !patientQuery.trim()}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
                                {submitting ? "Submitting..." : <><Send size={15} /> Submit Query</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div style={{ position: "fixed", bottom: "32px", right: "32px", background: "rgba(17,17,36,0.95)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: "12px", padding: "14px 20px", fontSize: "14px", color: "#f0f0ff", zIndex: 200, animation: "fadeIn 0.3s ease" }}>
                    ✓ {toast}
                </div>
            )}

            <style>{`input::placeholder,textarea::placeholder{color:#444466}input:focus,textarea:focus{border-color:rgba(0,212,255,0.4)!important}`}</style>
        </div>
    );
}
