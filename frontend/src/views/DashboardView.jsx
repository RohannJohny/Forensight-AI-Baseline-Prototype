import React from "react";
import {
  HardDrive,
  Clock,
  AlertTriangle,
  ShieldCheck,
  FileLock2,
  Cpu,
  ArrowRight,
  Database,
  KeyRound,
  ExternalLink
} from "lucide-react";

export default function DashboardView({ stats, activeCase, setCurrentTab }) {
  const killChainStages = [
    { name: "Initial Access", technique: "T1566: Phishing", color: "var(--amber)" },
    { name: "Execution", technique: "T1059: PowerShell", color: "var(--rose)" },
    { name: "Persistence", technique: "T1547: Registry Run", color: "var(--purple)" },
    { name: "Privilege Escalation", technique: "T1003: LSASS Dump", color: "var(--rose)" },
    { name: "Lateral Movement", technique: "T1021: SMB Admin$", color: "var(--indigo)" },
    { name: "Exfiltration", technique: "T1048: 84.5 MB Cloud", color: "var(--rose)" },
  ];

  return (
    <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)",
        border: "1px solid rgba(6, 182, 212, 0.25)",
        borderRadius: "var(--radius-lg)",
        padding: "26px 30px",
        marginBottom: "28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span className="badge-tag badge-cyan">Active Investigation</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Case Ref: {activeCase?.case_number}
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#f8fafc", marginBottom: "8px" }}>
            {activeCase?.case_name || "Operation Blackout"}
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "13.5px", maxWidth: "750px", lineHeight: "1.5" }}>
            {activeCase?.description}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-primary" onClick={() => setCurrentTab("ai_assistant")}>
            Ask AI Assistant
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentTab("reports")}>
            View Final Dossier
          </button>
        </div>
      </div>

      {/* 5 High-Level Telemetry Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "30px" }}>
        <div className="stat-widget" onClick={() => setCurrentTab("evidence")} style={{ cursor: "pointer" }}>
          <div>
            <div className="stat-title">Digital Evidence Items</div>
            <div className="stat-value" style={{ color: "var(--cyan)" }}>{stats?.evidence_count || 4}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Disk, RAM, EVTX, PCAP</div>
          </div>
          <HardDrive size={32} color="var(--cyan)" opacity={0.8} />
        </div>

        <div className="stat-widget" onClick={() => setCurrentTab("timeline")} style={{ cursor: "pointer" }}>
          <div>
            <div className="stat-title">Normalized CEM Events</div>
            <div className="stat-value" style={{ color: "#38bdf8" }}>{stats?.event_count || 8}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Common Event Model</div>
          </div>
          <Clock size={32} color="#38bdf8" opacity={0.8} />
        </div>

        <div className="stat-widget" onClick={() => setCurrentTab("timeline")} style={{ cursor: "pointer" }}>
          <div>
            <div className="stat-title">Flagged Anomalies</div>
            <div className="stat-value" style={{ color: "var(--rose)" }}>{stats?.anomalous_events_count || 7}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Score &ge; 0.70 Threshold</div>
          </div>
          <AlertTriangle size={32} color="var(--rose)" opacity={0.8} />
        </div>

        <div className="stat-widget" onClick={() => setCurrentTab("validation")} style={{ cursor: "pointer" }}>
          <div>
            <div className="stat-title">Validated Findings</div>
            <div className="stat-value" style={{ color: "var(--emerald)" }}>
              {stats?.validated_findings || 6} / {stats?.total_findings || 6}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Examiner Approved</div>
          </div>
          <ShieldCheck size={32} color="var(--emerald)" opacity={0.8} />
        </div>

        <div className="stat-widget" onClick={() => setCurrentTab("reports")} style={{ cursor: "pointer" }}>
          <div>
            <div className="stat-title">Two-Key Vault Reports</div>
            <div className="stat-value" style={{ color: "var(--purple)" }}>{stats?.finalized_reports || 1}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>AES-256-GCM Encrypted</div>
          </div>
          <FileLock2 size={32} color="var(--purple)" opacity={0.8} />
        </div>
      </div>

      {/* Reconstructed Kill-Chain Progression Summary */}
      <div className="forensic-card" style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc" }}>
              MITRE ATT&CK Intrusion Progression (Kill Chain)
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
              Correlated sequential attack path derived from validated host and network evidence
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => setCurrentTab("attack_path")}>
            Interactive Graph <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {killChainStages.map((stage, idx) => (
            <div
              key={stage.name}
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: `1px solid var(--border)`,
                borderTop: `3px solid ${stage.color}`,
                borderRadius: "var(--radius-sm)",
                padding: "14px",
                position: "relative"
              }}
            >
              <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Stage {idx + 1}
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#f8fafc", margin: "4px 0" }}>
                {stage.name}
              </div>
              <div style={{ fontSize: "11px", color: stage.color, fontFamily: "var(--font-mono)" }}>
                {stage.technique}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: 7-Module Architecture Status & Quick Workflows */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }}>
        {/* Module Operational Status */}
        <div className="forensic-card">
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Cpu size={18} color="var(--cyan)" />
            7-Module Engineering Architecture Status
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { mod: "Module 1", name: "Case & Evidence Management", desc: "SHA-256 bit-stream integrity & chain-of-custody", status: "ONLINE", color: "var(--emerald)" },
              { mod: "Module 2", name: "Forensic Artifact Extraction", desc: "Common Event Model normalization across TSK/Sysmon/Zeek", status: "ONLINE", color: "var(--emerald)" },
              { mod: "Module 3", name: "Forensic Analysis & Correlation", desc: "Behavioral heuristics & multi-source chronological timeline", status: "ONLINE", color: "var(--emerald)" },
              { mod: "Module 4", name: "AI Investigation Assistant", desc: "Evidence-grounded conversational RAG with strict event citations", status: "ONLINE", color: "var(--emerald)" },
              { mod: "Module 5", name: "Attack-Path Reconstruction", desc: "MITRE ATT&CK mapping with examiner validation gate", status: "ONLINE", color: "var(--emerald)" },
              { mod: "Module 6", name: "Professional Report Generation", desc: "Court-ready standardized forensic dossiers & legal attestation", status: "ONLINE", color: "var(--emerald)" },
              { mod: "Module 7", name: "Secure Report Storage", desc: "Two-Key cryptography (AES-256-GCM REK wrapped with Master Key)", status: "ONLINE", color: "var(--emerald)" },
            ].map((m) => (
              <div
                key={m.mod}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--cyan)", fontFamily: "var(--font-mono)" }}>
                      {m.mod}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>
                      {m.name}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {m.desc}
                  </div>
                </div>
                <span className="badge-tag badge-emerald" style={{ fontSize: "10px" }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Cryptographic Vault Specifications */}
        <div className="forensic-card">
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <KeyRound size={18} color="var(--purple)" />
            Two-Key Cryptographic Vault Spec
          </h3>
          <div style={{
            background: "rgba(168, 85, 247, 0.05)",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            borderRadius: "var(--radius-sm)",
            padding: "16px",
            marginBottom: "16px"
          }}>
            <div style={{ fontSize: "12.5px", color: "var(--text-dim)", lineHeight: "1.6" }}>
              <strong>Two-Key Architecture:</strong> Finalized reports are encrypted using a 256-bit <em>Report Encryption Key (REK)</em> via AES-256-GCM. The REK is subsequently wrapped by the system <em>Master Key (MK)</em> and stored in the secure vault.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "var(--text-dim)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
              <span>Cipher Algorithm:</span>
              <span className="mono" style={{ color: "var(--cyan)" }}>AES-256-GCM (Authenticated)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
              <span>Integrity Verification:</span>
              <span className="mono" style={{ color: "var(--emerald)" }}>SHA-256 Plaintext Ledger</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
              <span>Database Backend:</span>
              <span className="mono" style={{ color: "var(--text-main)" }}>SQLite (Development) / PostgreSQL</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span>Human-in-the-Loop:</span>
              <span className="mono" style={{ color: "var(--amber)" }}>Examiner Validation Gate</span>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button className="btn btn-emerald" style={{ width: "100%" }} onClick={() => setCurrentTab("reports")}>
              <FileLock2 size={16} /> Open Encrypted Reports Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
