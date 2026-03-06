"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    History,
    Activity,
    Cross,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/queries", label: "Query Inbox", icon: MessageSquare },
    { href: "/history", label: "Query History", icon: History },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "260px",
                height: "100vh",
                background: "rgba(10, 10, 25, 0.95)",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px)",
                display: "flex",
                flexDirection: "column",
                zIndex: 50,
                padding: "0",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: "28px 24px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #00d4ff, #3b82f6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
                        }}
                    >
                        <Cross size={20} color="white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: "17px",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #00d4ff, #3b82f6)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-0.3px",
                            }}
                        >
                            MediAssist
                        </div>
                        <div style={{ fontSize: "11px", color: "#556", marginTop: "1px" }}>
                            AI Response System
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: "16px 12px" }}>
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 14px",
                                borderRadius: "12px",
                                marginBottom: "4px",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: active ? 600 : 450,
                                color: active ? "#00d4ff" : "#8888aa",
                                background: active
                                    ? "rgba(0, 212, 255, 0.08)"
                                    : "transparent",
                                border: active
                                    ? "1px solid rgba(0, 212, 255, 0.15)"
                                    : "1px solid transparent",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Status indicator */}
            <div
                style={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        color: "#8888aa",
                    }}
                >
                    <Activity size={14} color="#22c55e" />
                    <span>System Online</span>
                    <div
                        style={{
                            marginLeft: "auto",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#22c55e",
                            boxShadow: "0 0 8px #22c55e",
                            animation: "pulseGlow 2s ease-in-out infinite",
                        }}
                    />
                </div>
                <div
                    style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        color: "#444466",
                    }}
                >
                    AI: Llama 3.3 · Groq
                </div>
            </div>
        </aside>
    );
}
