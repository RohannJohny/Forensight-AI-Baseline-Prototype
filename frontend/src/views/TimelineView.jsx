import React, { useState } from "react";
import {
  Clock,
  Search,
  Filter,
  AlertTriangle,
  Terminal,
  Wifi,
  FileCode,
  Key,
  User,
  Server,
  Maximize2,
  X
} from "lucide-react";

export default function TimelineView({ events, activeCase, onFilterChange, filterParams }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventIcon = (type) => {
    switch (type) {
      case "PROCESS_CREATE":
        return <Terminal size={15} color="var(--rose)" />;
      case "NETWORK_CONNECTION":
        return <Wifi size={15} color="var(--cyan)" />;
      case "REGISTRY_PERSISTENCE":
      case "REGISTRY_WRITE":
        return <Key size={15} color="var(--purple)" />;
      case "FILE_DROP":
        return <FileCode size={15} color="var(--amber)" />;
      default:
        return <Clock size={15} color="var(--emerald)" />;
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header & Description */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Clock size={20} color="var(--cyan)" />
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc" }}>
              Unified Chronological Forensic Timeline
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Module 3: Multi-source event sequencing normalized to Common Event Model (CEM) with behavioral anomaly scoring.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="badge-tag badge-cyan">
            {events?.length || 0} Chronological Events
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="forensic-card" style={{ padding: "16px 20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}>
          {/* Search bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 300px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "11px" }} />
              <input
                type="text"
                className="input-control"
                style={{ width: "100%", paddingLeft: "36px" }}
                placeholder="Search commands, hashes, IPs, users, or event IDs..."
                value={filterParams.search || ""}
                onChange={(e) => onFilterChange({ ...filterParams, search: e.target.value })}
              />
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <select
              className="input-control"
              value={filterParams.event_type || ""}
              onChange={(e) => onFilterChange({ ...filterParams, event_type: e.target.value })}
            >
              <option value="">All Event Types</option>
              <option value="PROCESS_CREATE">Process Execution</option>
              <option value="REGISTRY_PERSISTENCE">Registry Persistence</option>
              <option value="NETWORK_CONNECTION">Network Connections</option>
              <option value="FILE_DROP">File Drops</option>
            </select>

            <button
              className={`btn ${filterParams.only_anomalous ? "btn-rose" : "btn-secondary"}`}
              onClick={() => onFilterChange({ ...filterParams, only_anomalous: !filterParams.only_anomalous })}
            >
              <AlertTriangle size={14} />
              {filterParams.only_anomalous ? "Showing Anomalies Only" : "Filter Anomalies"}
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div style={{ position: "relative", paddingLeft: "30px" }}>
        {/* Continuous timeline line */}
        <div style={{
          position: "absolute",
          left: "11px",
          top: "10px",
          bottom: "10px",
          width: "2px",
          background: "linear-gradient(to bottom, var(--cyan), rgba(99, 102, 241, 0.4), var(--border))"
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {events?.map((ev, index) => {
            const isAnom = ev.is_anomalous === 1;
            const details = ev.details || {};
            const timeFormatted = new Date(ev.timestamp).toUTCString().replace("GMT", "UTC");

            return (
              <div
                key={ev.event_id}
                className="forensic-card"
                style={{
                  position: "relative",
                  padding: "18px 22px",
                  borderColor: isAnom ? "rgba(244, 63, 94, 0.35)" : "var(--border)",
                  borderLeft: isAnom ? "4px solid var(--rose)" : "4px solid var(--cyan)",
                  transition: "all 0.18s ease"
                }}
              >
                {/* Node icon on timeline */}
                <div style={{
                  position: "absolute",
                  left: "-37px",
                  top: "22px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: isAnom ? "var(--rose)" : "var(--cyan)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isAnom ? "0 0 10px var(--rose)" : "0 0 10px var(--cyan)"
                }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffffff" }} />
                </div>

                {/* Event Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontSize: "12px", color: "var(--cyan)", fontWeight: "600" }}>
                      {timeFormatted}
                    </span>
                    <span className="badge-tag badge-cyan" style={{ gap: "6px" }}>
                      {getEventIcon(ev.event_type)}
                      {ev.event_type}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      Source: {ev.source_entity}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {isAnom && (
                      <span className="badge-tag badge-rose">
                        <AlertTriangle size={12} /> Threat Score: {(ev.anomaly_score * 100).toFixed(0)}%
                      </span>
                    )}
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "4px 8px", fontSize: "11px" }}
                      onClick={() => setSelectedEvent(ev)}
                      title="Inspect full normalized record"
                    >
                      <Maximize2 size={12} /> Details
                    </button>
                  </div>
                </div>

                {/* Event Summary / Command Line / Details */}
                <div style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12.5px",
                  fontFamily: "var(--font-mono)",
                  color: isAnom ? "#fecdd3" : "#e2e8f0",
                  marginBottom: "10px",
                  wordBreak: "break-all"
                }}>
                  {details.command_line || details.decoded_command || details.value_data || details.target_filename ||
                   (details.dst_ip ? `Connection: ${details.src_ip}:${details.src_port} -> ${details.dst_ip}:${details.dst_port} (${details.protocol})` : JSON.stringify(details))}
                </div>

                {/* Event Footer Tags */}
                <div style={{ display: "flex", gap: "16px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <User size={13} color="var(--text-dim)" />
                    <span>User: <strong style={{ color: "var(--text-dim)" }}>{ev.user_account || "SYSTEM"}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Server size={13} color="var(--text-dim)" />
                    <span>Host: <strong style={{ color: "var(--text-dim)" }}>{ev.host_ip || "127.0.0.1"}</strong></span>
                  </div>
                  <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                    ID: {ev.event_id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Event Inspection Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {getEventIcon(selectedEvent.event_type)}
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc" }}>
                  Forensic Event Inspector (CEM Record)
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
              <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "10px", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>EVENT ID:</span>
                <div className="mono" style={{ fontSize: "12px", color: "var(--cyan)" }}>{selectedEvent.event_id}</div>
              </div>
              <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "10px", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>TIMESTAMP (UTC):</span>
                <div className="mono" style={{ fontSize: "12px", color: "var(--emerald)" }}>{new Date(selectedEvent.timestamp).toUTCString()}</div>
              </div>
              <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "10px", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>SOURCE ARTIFACT:</span>
                <div style={{ fontSize: "12px", color: "#f8fafc" }}>{selectedEvent.source_entity}</div>
              </div>
              <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "10px", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>BEHAVIORAL THREAT SCORE:</span>
                <div style={{ fontSize: "12px", color: selectedEvent.is_anomalous ? "var(--rose)" : "var(--emerald)", fontWeight: "700" }}>
                  {(selectedEvent.anomaly_score * 100).toFixed(0)}% {selectedEvent.is_anomalous ? "(Anomalous)" : "(Normal)"}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: "600" }}>STRUCTURED JSON ATTRIBUTES:</span>
              <pre style={{
                background: "#080c14",
                border: "1px solid var(--border)",
                padding: "14px",
                borderRadius: "6px",
                marginTop: "6px",
                fontSize: "12px",
                color: "#38bdf8",
                maxHeight: "300px",
                overflowY: "auto"
              }}>
                {JSON.stringify(selectedEvent.details, null, 2)}
              </pre>
            </div>

            <div style={{ textAlign: "right" }}>
              <button className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
