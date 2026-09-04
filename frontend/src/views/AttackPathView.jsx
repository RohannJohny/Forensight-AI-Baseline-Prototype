import React, { useState } from "react";
import {
  GitBranch,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Terminal,
  Key,
  Wifi,
  FileSpreadsheet
} from "lucide-react";

export default function AttackPathView({ attackPathData, activeCase, setCurrentTab }) {
  const [selectedStage, setSelectedStage] = useState(0);

  const stages = attackPathData?.stages || [];
  const currentStage = stages[selectedStage] || stages[0];

  const getStageColor = (order) => {
    switch (order) {
      case 1: return "var(--amber)";
      case 2: return "var(--rose)";
      case 3: return "var(--purple)";
      case 4: return "var(--rose)";
      case 5: return "var(--indigo)";
      case 6: return "var(--rose)";
      default: return "var(--cyan)";
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <GitBranch size={20} color="var(--cyan)" />
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc" }}>
              Attack-Path Reconstruction & MITRE ATT&CK Mapping
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Module 5: Sequential kill-chain progression bound directly to validated digital forensic evidence.
          </p>
        </div>

        <button className="btn btn-emerald" onClick={() => setCurrentTab("validation")}>
          <ShieldCheck size={14} />
          Examiner Validation Gate
        </button>
      </div>

      {/* Visual Kill-Chain Stepper Bar */}
      <div className="forensic-card" style={{ marginBottom: "26px", padding: "24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          {stages.map((st, idx) => {
            const isSelected = selectedStage === idx;
            const stageColor = getStageColor(st.stage_order);
            const isValidated = st.finding?.validation_status === "Accepted";

            return (
              <React.Fragment key={st.node_id}>
                {/* Stage Step Node */}
                <div
                  onClick={() => setSelectedStage(idx)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    zIndex: 2,
                    flex: "1 1 0",
                    maxWidth: "180px",
                    textAlign: "center",
                    opacity: isSelected ? 1 : 0.75,
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: isSelected ? stageColor : "rgba(15, 23, 42, 0.8)",
                    border: `2px solid ${stageColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isSelected ? `0 0 15px ${stageColor}` : "none",
                    marginBottom: "8px"
                  }}>
                    <span style={{
                      color: isSelected ? "#ffffff" : stageColor,
                      fontWeight: "800",
                      fontSize: "14px",
                      fontFamily: "var(--font-mono)"
                    }}>
                      {st.stage_order}
                    </span>
                  </div>

                  <div style={{ fontSize: "13px", fontWeight: "700", color: isSelected ? "#f8fafc" : "var(--text-dim)" }}>
                    {st.stage_name}
                  </div>

                  <div style={{ fontSize: "10.5px", color: stageColor, fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                    {st.mitre_technique.split(":")[0]}
                  </div>

                  <div style={{ marginTop: "6px" }}>
                    {isValidated ? (
                      <span className="badge-tag badge-emerald" style={{ fontSize: "9px", padding: "2px 6px" }}>
                        Validated
                      </span>
                    ) : (
                      <span className="badge-tag badge-amber" style={{ fontSize: "9px", padding: "2px 6px" }}>
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow connector between stages */}
                {idx < stages.length - 1 && (
                  <div style={{
                    flex: "0 0 30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--border)",
                    zIndex: 1
                  }}>
                    <ArrowRight size={18} color="var(--text-muted)" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Deep Stage Inspector */}
      {currentStage && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px" }}>
          {/* Left: MITRE Technique & Finding Info */}
          <div className="forensic-card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span className="badge-tag" style={{
                background: `rgba(255, 255, 255, 0.05)`,
                border: `1px solid ${getStageColor(currentStage.stage_order)}`,
                color: getStageColor(currentStage.stage_order),
                fontWeight: "700"
              }}>
                Stage {currentStage.stage_order} of {stages.length}
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>
                {currentStage.stage_name}
              </h3>
            </div>

            <div style={{
              background: "rgba(0, 0, 0, 0.25)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "16px",
              marginBottom: "18px"
            }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>
                MITRE ATT&CK Technique
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                {currentStage.mitre_technique}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "8px", lineHeight: "1.5" }}>
                {currentStage.description}
              </p>
            </div>

            {/* Correlated Finding Details */}
            {currentStage.finding && (
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", marginBottom: "6px" }}>
                  Correlated Investigative Finding
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>
                      {currentStage.finding.title}
                    </div>
                    <span className={`badge-tag ${currentStage.finding.validation_status === "Accepted" ? "badge-emerald" : "badge-amber"}`}>
                      {currentStage.finding.validation_status}
                    </span>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "var(--text-dim)", lineHeight: "1.5", marginBottom: "10px" }}>
                    {currentStage.finding.description}
                  </p>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                    <strong>Examiner Notes:</strong> {currentStage.finding.notes || "None"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Direct Evidence Citation Link */}
          <div className="forensic-card">
            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ExternalLink size={16} color="var(--emerald)" />
              Supporting Digital Forensic Evidence Link
            </h4>

            {currentStage.evidence_link ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{
                  background: "rgba(16, 185, 129, 0.04)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  padding: "14px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>NORMALIZED EVENT ID</span>
                    <span className="mono" style={{ fontSize: "11px", color: "var(--cyan)" }}>
                      {currentStage.evidence_link.event_id}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>TIMESTAMP (UTC)</span>
                    <span className="mono" style={{ fontSize: "11px", color: "var(--emerald)" }}>
                      {currentStage.evidence_link.timestamp}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>SOURCE ARTIFACT</span>
                    <span style={{ fontSize: "11px", color: "#f8fafc" }}>
                      {currentStage.evidence_link.source}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
                    RAW EXECUTED ATTRIBUTES / COMMAND
                  </div>
                  <pre style={{
                    background: "#080c14",
                    border: "1px solid var(--border)",
                    padding: "12px",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                    color: "#38bdf8",
                    fontFamily: "var(--font-mono)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all"
                  }}>
                    {JSON.stringify(currentStage.evidence_link.details, null, 2)}
                  </pre>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "var(--text-muted)" }}>
                  <span>User: <strong style={{ color: "var(--text-dim)" }}>{currentStage.evidence_link.user}</strong></span>
                  <span>Host IP: <strong style={{ color: "var(--text-dim)" }}>{currentStage.evidence_link.host}</strong></span>
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "20px 0" }}>
                No direct single event bound to this stage.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
