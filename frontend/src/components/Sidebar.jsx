import React from "react";
import {
  LayoutDashboard,
  HardDrive,
  Clock,
  GitBranch,
  ShieldCheck,
  Bot,
  FileLock2,
  FileText,
  Activity,
  Terminal
} from "lucide-react";

export default function Sidebar({ currentTab, setCurrentTab, stats }) {
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, badge: null },
    { id: "evidence", label: "Evidence Vault", icon: HardDrive, badge: stats?.evidence_count },
    { id: "timeline", label: "Forensic Timeline", icon: Clock, badge: stats?.event_count },
    { id: "attack_path", label: "Attack Path (MITRE)", icon: GitBranch, badge: "6 Stages" },
    { id: "validation", label: "Examiner Validation", icon: ShieldCheck, badge: stats?.total_findings },
    { id: "ai_assistant", label: "AI Assistant (RAG)", icon: Bot, badge: "Grounded" },
    { id: "reports", label: "Reports & Crypto Vault", icon: FileLock2, badge: stats?.finalized_reports },
    { id: "audit_log", label: "Chain of Custody", icon: FileText, badge: null },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: "20px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #06b6d4, #6366f1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)"
        }}>
          <Terminal size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "1px", color: "#f8fafc" }}>
            FORENSIGHT<span style={{ color: "var(--cyan)" }}>.AI</span>
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            DFIR Investigation OS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: "16px 0", flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "0 22px 10px 22px", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Forensic Modules
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={18} color={isActive ? "var(--cyan)" : "currentColor"} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== null && item.badge !== undefined && (
                <span style={{
                  fontSize: "10px",
                  padding: "2px 7px",
                  borderRadius: "10px",
                  background: isActive ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.06)",
                  color: isActive ? "var(--cyan)" : "var(--text-muted)",
                  fontWeight: "600"
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* System Engine Status Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "rgba(0, 0, 0, 0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--emerald)", boxShadow: "0 0 8px var(--emerald)" }} />
          <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-dim)" }}>Two-Key Vault Armed</span>
        </div>
        <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
          AES-256-GCM • SHA-256 Ledger
        </div>
      </div>
    </aside>
  );
}
