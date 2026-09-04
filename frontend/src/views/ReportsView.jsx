import React, { useState } from "react";
import {
  FileLock2,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Unlock,
  Printer,
  X,
  ExternalLink
} from "lucide-react";
import { generateReport, decryptReport } from "../services/api";

export default function ReportsView({ reports, activeCase, onRefresh }) {
  const [reportTitle, setReportTitle] = useState("Operation Blackout - Courtroom Forensic Dossier");
  const [examinerName, setExaminerName] = useState("Rohan Johny (Lead Forensic Examiner)");
  const [execSummary, setExecSummary] = useState(
    "Targeted multi-stage cyber intrusion against WS-FIN-04 resulting in macro execution, encoded PowerShell payload, registry persistence, credential dumping, SMB lateral movement, and data exfiltration."
  );
  const [generating, setGenerating] = useState(false);
  const [decryptingId, setDecryptingId] = useState(null);
  const [activeDecryptedReport, setActiveDecryptedReport] = useState(null);

  const handleGenerate = async () => {
    if (!reportTitle.trim() || !activeCase) return;
    setGenerating(true);
    try {
      await generateReport(activeCase.case_id, {
        case_id: activeCase.case_id,
        report_name: reportTitle,
        investigator_name: examinerName,
        executive_summary: execSummary,
        include_raw_hashes: true
      });
      alert("Finalized Forensic Dossier compiled, encrypted with Two-Key AES-256-GCM, and stored in the secure vault!");
      onRefresh();
    } catch (err) {
      alert("Report generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDecrypt = async (reportId) => {
    setDecryptingId(reportId);
    try {
      const res = await decryptReport(reportId);
      setActiveDecryptedReport(res);
    } catch (err) {
      alert("Decryption failed: " + err.message);
    } finally {
      setDecryptingId(null);
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <FileLock2 size={20} color="var(--purple)" />
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc" }}>
              Professional Report Generation & Two-Key Encrypted Vault
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Module 6 & 7: Court-ready forensic dossier compilation, Two-Key cryptography (REK + Master Key AES-256-GCM), and SHA-256 tamper-proof ledger.
          </p>
        </div>

        <span className="badge-tag badge-emerald">
          <KeyRound size={13} /> Two-Key Security Active
        </span>
      </div>

      {/* Grid: Generator on Left, Vault on Right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "24px", marginBottom: "30px" }}>
        {/* Compiler Form */}
        <div className="forensic-card">
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={17} color="var(--cyan)" />
            Compile Standardized Forensic Dossier
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "5px" }}>
                REPORT TITLE
              </label>
              <input
                type="text"
                className="input-control"
                style={{ width: "100%" }}
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "5px" }}>
                LEAD FORENSIC EXAMINER SIGN-OFF
              </label>
              <input
                type="text"
                className="input-control"
                style={{ width: "100%" }}
                value={examinerName}
                onChange={(e) => setExaminerName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "5px" }}>
                EXECUTIVE SUMMARY & ATTESTATION
              </label>
              <textarea
                className="input-control"
                rows={4}
                style={{ width: "100%", resize: "vertical" }}
                value={execSummary}
                onChange={(e) => setExecSummary(e.target.value)}
              />
            </div>

            <div style={{ background: "rgba(168, 85, 247, 0.06)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "var(--radius-sm)", padding: "12px", fontSize: "12px", color: "var(--text-dim)" }}>
              🔒 Compiling will automatically extract verified findings, compute the plaintext SHA-256 hash, generate an isolated 256-bit REK, encrypt the payload with AES-256-GCM, and wrap the REK using the Master Key.
            </div>

            <button
              className="btn btn-primary"
              style={{ padding: "12px", width: "100%", marginTop: "4px" }}
              onClick={handleGenerate}
              disabled={generating}
            >
              <FileLock2 size={16} />
              {generating ? "Encrypting & Signing..." : "Finalize, Encrypt & Store in Vault"}
            </button>
          </div>
        </div>

        {/* Encrypted Reports Vault List */}
        <div className="forensic-card">
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Lock size={17} color="var(--purple)" />
            Encrypted Reports Vault Ledger ({reports?.length || 0})
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "450px", overflowY: "auto" }}>
            {(!reports || reports.length === 0) ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "13px" }}>
                No finalized reports in the secure vault yet. Compile a dossier using the generator.
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.report_id}
                  style={{
                    background: "rgba(0, 0, 0, 0.25)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>
                        {rep.report_name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Finalized: {new Date(rep.finalized_at).toUTCString()}
                      </div>
                    </div>
                    <span className="badge-tag badge-emerald" style={{ fontSize: "10px" }}>
                      AES-256-GCM
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <span style={{ color: "var(--text-muted)" }}>SHA-256 Plaintext Hash:</span>
                    <span className="mono" style={{ color: "var(--cyan)" }}>
                      {rep.integrity_hash.substring(0, 18)}...{rep.integrity_hash.substring(50)}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                    <button
                      className="btn btn-emerald"
                      style={{ fontSize: "11.5px", padding: "5px 12px" }}
                      onClick={() => handleDecrypt(rep.report_id)}
                      disabled={decryptingId === rep.report_id}
                    >
                      <Unlock size={13} />
                      {decryptingId === rep.report_id ? "Unwrapping Key..." : "Decrypt & Verify Integrity"}
                    </button>

                    <a
                      href={`http://localhost:8000/api/reports/${rep.report_id}/html`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: "11.5px", padding: "5px 12px", textDecoration: "none" }}
                    >
                      <Printer size={13} /> Courtroom View
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Decrypted Report Modal with Tamper Verification */}
      {activeDecryptedReport && (
        <div className="modal-overlay" onClick={() => setActiveDecryptedReport(null)}>
          <div className="modal-content" style={{ maxWidth: "900px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>
                  {activeDecryptedReport.report_name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                  <span className="badge-tag badge-emerald">
                    <CheckCircle2 size={12} />
                    {activeDecryptedReport.is_tamper_free ? "CRYPTOGRAPHIC INTEGRITY: BIT-STREAM VERIFIED (TAMPER FREE)" : "TAMPER WARNING DETECTED"}
                  </span>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--cyan)" }}>
                    SHA-256: {activeDecryptedReport.integrity_hash}
                  </span>
                </div>
              </div>
              <button onClick={() => setActiveDecryptedReport(null)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            {/* Plaintext Content */}
            <div style={{ maxHeight: "480px", overflowY: "auto", background: "#080c14", padding: "20px", borderRadius: "6px", border: "1px solid var(--border)", marginBottom: "16px" }}>
              <pre style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "#e2e8f0",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap"
              }}>
                {activeDecryptedReport.plaintext_content}
              </pre>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Verified at: {new Date(activeDecryptedReport.verified_at).toUTCString()}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  <Printer size={14} /> Print Legal Copy
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveDecryptedReport(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
