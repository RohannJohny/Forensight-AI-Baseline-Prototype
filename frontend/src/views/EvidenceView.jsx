import React, { useState } from "react";
import {
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  UploadCloud,
  FileCode,
  Layers,
  Database
} from "lucide-react";
import { verifyEvidenceIntegrity } from "../services/api";

export default function EvidenceView({ evidenceList, activeCase, onRefresh }) {
  const [verifyingId, setVerifyingId] = useState(null);
  const [integrityResult, setIntegrityResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const handleVerify = async (evidenceId) => {
    setVerifyingId(evidenceId);
    try {
      const res = await verifyEvidenceIntegrity(evidenceId);
      setIntegrityResult(res);
    } catch (err) {
      alert("Integrity verification check failed: " + err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatSize = (bytesStr) => {
    if (!bytesStr) return "N/A";
    const bytes = parseInt(bytesStr);
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "DISK_IMAGE":
        return <span className="badge-tag badge-cyan">Disk Image (E01)</span>;
      case "MEMORY_DUMP":
        return <span className="badge-tag badge-indigo">Memory Dump (RAW)</span>;
      case "EVTX":
        return <span className="badge-tag badge-emerald">Windows EVTX</span>;
      case "PCAP":
        return <span className="badge-tag badge-amber">Network PCAP</span>;
      default:
        return <span className="badge-tag badge-cyan">{type}</span>;
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <HardDrive size={20} color="var(--cyan)" />
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc" }}>
              Digital Evidence Vault & Integrity Engine
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Module 1 & 2: Bit-stream acquisition records, cryptographic SHA-256 verification, and extracted forensic artifacts.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <span className="badge-tag badge-emerald">
            <ShieldCheck size={13} /> Strict Chain of Custody
          </span>
        </div>
      </div>

      {/* Integrity Verification Result Banner (if triggered) */}
      {integrityResult && (
        <div style={{
          background: integrityResult.is_valid ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
          border: `1px solid ${integrityResult.is_valid ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)"}`,
          borderRadius: "var(--radius-md)",
          padding: "18px 24px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {integrityResult.is_valid ? (
              <CheckCircle2 size={32} color="var(--emerald)" />
            ) : (
              <AlertCircle size={32} color="var(--rose)" />
            )}
            <div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: integrityResult.is_valid ? "var(--emerald)" : "var(--rose)" }}>
                Cryptographic Integrity Check: {integrityResult.status}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                Target: {integrityResult.source_name} | SHA-256: {integrityResult.stored_hash_sha256}
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setIntegrityResult(null)}>
            Dismiss
          </button>
        </div>
      )}

      {/* Evidence Table */}
      <div className="forensic-card" style={{ padding: "0", overflow: "hidden", marginBottom: "30px" }}>
        <table className="forensic-table">
          <thead>
            <tr>
              <th>Evidence Container</th>
              <th>Artifact Category</th>
              <th>File Size</th>
              <th>Acquisition SHA-256 Hash</th>
              <th>Ingested At</th>
              <th style={{ textAlign: "right" }}>Integrity Action</th>
            </tr>
          </thead>
          <tbody>
            {evidenceList?.map((ev) => (
              <tr key={ev.evidence_id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border)"
                    }}>
                      <HardDrive size={16} color="var(--cyan)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "13.5px" }}>
                        {ev.source_name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                        {ev.storage_path}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{getTypeBadge(ev.evidence_type)}</td>
                <td className="mono">{formatSize(ev.byte_size)}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="mono" style={{ fontSize: "11.5px", color: "var(--cyan)" }}>
                      {ev.hash_sha256.substring(0, 16)}...{ev.hash_sha256.substring(48)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(ev.hash_sha256)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: copiedHash === ev.hash_sha256 ? "var(--emerald)" : "var(--text-muted)" }}
                      title="Copy full SHA-256 hash"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </td>
                <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {new Date(ev.ingested_at).toLocaleString()}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-emerald"
                    style={{ fontSize: "11.5px", padding: "6px 12px" }}
                    onClick={() => handleVerify(ev.evidence_id)}
                    disabled={verifyingId === ev.evidence_id}
                  >
                    <ShieldCheck size={14} />
                    {verifyingId === ev.evidence_id ? "Hashing..." : "Verify SHA-256"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forensic Tool Orchestration Note (from Presentation Section 12) */}
      <div className="forensic-card">
        <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Layers size={17} color="var(--cyan)" />
          Integrated Forensic Tool Orchestration & Coverage
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: "1.6", marginBottom: "14px" }}>
          Forensight AI executes automated forensic artifact extraction without altering master disk images:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--cyan)" }}>The Sleuth Kit / Autopsy</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>NTFS $MFT parsing, file-system metadata, and deleted record carving.</div>
          </div>
          <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--indigo)" }}>Volatility 3 Engine</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>Volatile memory process trees (pstree), code injection (malfind), and DLLs.</div>
          </div>
          <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--purple)" }}>RegRipper 3.0</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>Windows registry autorun keys, UserAssist execution history, and SAM hives.</div>
          </div>
          <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--amber)" }}>Zeek & Network Parsers</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>PCAP protocol dissection, TCP stream reconstruction, and exfiltration tracking.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
