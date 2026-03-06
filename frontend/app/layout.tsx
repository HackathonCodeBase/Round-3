import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "MediAssist – AI Response System",
  description: "AI-powered response suggestion system for hospital staff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: "260px", minHeight: "100vh" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
