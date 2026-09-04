import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Edit3,
  AlertCircle,
  FileCheck,
  Info,
  X
} from "lucide-react";
import { validateFinding } from "../services/api";

export default function ValidationGateView({ findings, activeCase, onRefresh }) {
  const [editingFinding, setEditingFinding] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("Accepted");
  const [submitting, setSubmitting] = useState(false);

  const handleQuickStatus = async (finding, newStatus) => {
    try {
      await validateFinding(finding.finding_id, {
        validation_status: newStatus,
        investigator_notes: `Validation updated to ${newStatus} by Lead Examiner.`
      });
      onRefresh();
    } catch (err) {
      alert("Validation update failed: " + err.message);
    }
  };

  const openEditModal = (finding) => {
    setEditingFinding(finding);
    setEditTitle(finding.finding_title);
    setEditNotes(finding.investigator_notes || "");
    setEditStatus(finding.validation_status);
  };

  const saveEdit = async () => {
    if (!editingFinding) return;
    setSubmitting(true);
    try {
      await validateFinding(editingFinding.finding_id, {
        validation_status: editStatus,
        finding_title: editTitle,
        investigator_notes: editNotes
      });
      setEditingFinding(null);
      onRefresh();
    } catch (err) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <ShieldCheck size={20} color="var(--emerald)" />
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc" }}>
              Examiner Validation Gate (Human-in-the-Loop)
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Mandatory forensic governance checkpoint: AI suggests correlations; the lead examiner verifies, accepts, rejects, or modifies findings prior to report compilation.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <span className="badge-tag badge-emerald">
            {findings.filter(f => f.validation_status === "Accepted").length} of {findings.length} Accepted
          </span>
        </div>
      </div>

      {/* Info Notice */}
      <div style={{
        background: "rgba(6, 182, 212, 0.06)",
        border: "1px solid rgba(6, 182, 212, 0.2)",
        borderRadius: "var(--radius-sm)",
        padding: "14px 18px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "13px",
        color: "var(--text-dim)"
      }}>
        <Info size={18} color="var(--cyan)" flexShrink={0} />
        <div>
          <strong>Non-Autonomous Legal Boundary:</strong> Under ISO/IEC 27037 and court admissibility standards, only findings explicitly marked as <strong>"Accepted"</strong> will be codified into the finalized AES-256 encrypted forensic dossier.
        </div>
      </div>

      {/* Findings Grid / Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {findings.map((f) => {
          const isAccepted = f.validation_status === "Accepted";
          const isRejected = f.validation_status === "Rejected";

          return (
            <div
              key={f.finding_id}
              className="forensic-card"
              style={{
                padding: "20px 24px",
                borderColor: isAccepted ? "rgba(16, 185, 129, 0.3)" : isRejected ? "rgba(244, 63, 94, 0.3)" : "var(--border)",
                borderLeft: isAccepted ? "4px solid var(--emerald)" : isRejected ? "4px solid var(--rose)" : "4px solid var(--amber)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span className="badge-tag badge-cyan" style={{ fontSize: "10.5px" }}>
                      {f.finding_type}
                    </span>
                    <span className={`badge-tag ${isAccepted ? "badge-emerald" : isRejected ? "badge-rose" : "badge-amber"}`}>
                      {f.validation_status}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      AI Confidence: {(f.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc" }}>
                    {f.finding_title}
                  </h3>
                </div>

                {/* Examiner Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    className="btn btn-emerald"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={() => handleQuickStatus(f, "Accepted")}
                    disabled={isAccepted}
                  >
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button
                    className="btn btn-rose"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={() => handleQuickStatus(f, "Rejected")}
                    disabled={isRejected}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={() => openEditModal(f)}
                  >
                    <Edit3 size={14} /> Edit & Notes
                  </button>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: "1.6", marginBottom: "12px" }}>
                {f.description}
              </p>

              {/* Footer Citations and Examiner Notes */}
              <div style={{
                background: "rgba(0, 0, 0, 0.2)",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px"
              }}>
                <div style={{ color: "var(--text-muted)" }}>
                  <strong>Linked Event ID:</strong>{" "}
                  <span className="mono" style={{ color: "var(--cyan)" }}>
                    {f.event_id || "Cross-artifact cluster"}
                  </span>
                </div>
                <div style={{ color: "var(--text-dim)" }}>
                  <strong>Examiner Rationale:</strong>{" "}
                  <span>{f.investigator_notes || "Awaiting examiner notes."}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Finding Modal */}
      {editingFinding && (
        <div className="modal-overlay" onClick={() => setEditingFinding(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc" }}>
                Examiner Review: Modify Finding & Attestation
              </h3>
              <button onClick={() => setEditingFinding(null)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                  FINDING TITLE
                </label>
                <input
                  type="text"
                  className="input-control"
                  style={{ width: "100%" }}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                  VALIDATION STATUS
                </label>
                <select
                  className="input-control"
                  style={{ width: "100%" }}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Accepted">Accepted (Included in Final Dossier)</option>
                  <option value="Rejected">Rejected (Excluded)</option>
                  <option value="Modified">Modified (Custom Investigator Narrative)</option>
                  <option value="Pending">Pending Review</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                  EXAMINER VERIFICATION NOTES (LEGAL RECORD)
                </label>
                <textarea
                  className="input-control"
                  rows={4}
                  style={{ width: "100%", resize: "vertical" }}
                  placeholder="Record forensic methodology, tool cross-checks, and reason for acceptance/rejection..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button className="btn btn-secondary" onClick={() => setEditingFinding(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={submitting}>
                {submitting ? "Saving..." : "Save Validation Decision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
