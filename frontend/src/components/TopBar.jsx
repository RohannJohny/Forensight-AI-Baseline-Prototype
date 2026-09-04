import React from "react";
import { FolderCheck, ShieldAlert, Sparkles, UserCheck, RotateCcw } from "lucide-react";

export default function TopBar({ activeCase, onReseed, onCorrelate, isCorrelating }) {
  return (
    <header className="top-header">
      {/* Active Case Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(6, 182, 212, 0.08)",
          border: "1px solid rgba(6, 182, 212, 0.25)",
          padding: "6px 14px",
          borderRadius: "var(--radius-sm)"
        }}>
          <FolderCheck size={16} color="var(--cyan)" />
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--cyan)", fontFamily: "var(--font-mono)" }}>
            {activeCase?.case_number || "FS-2026-001"}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>|</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-main)" }}>
            {activeCase?.case_name || "Operation Blackout: APT Spearphishing"}
          </span>
        </div>

        <span className="badge-tag badge-rose">
          <ShieldAlert size={12} />
          {activeCase?.status || "Under Investigation"}
        </span>
      </div>

      {/* Right Controls & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="btn btn-secondary"
          onClick={onCorrelate}
          disabled={isCorrelating}
          title="Run Behavioral Anomaly Correlation across normalized events"
        >
          <Sparkles size={14} color="var(--cyan)" />
          {isCorrelating ? "Correlating..." : "Run AI Correlation"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onReseed}
          title="Reset Operation Blackout demo data"
        >
          <RotateCcw size={14} />
          Reset Demo
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--border)",
          padding: "5px 12px",
          borderRadius: "var(--radius-sm)"
        }}>
          <UserCheck size={15} color="var(--emerald)" />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-main)" }}>Rohan Johny</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Lead Forensic Examiner</div>
          </div>
        </div>
      </div>
    </header>
  );
}
