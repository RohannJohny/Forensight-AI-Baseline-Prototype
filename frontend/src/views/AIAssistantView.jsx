import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Link2,
  ShieldCheck,
  Cpu,
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { queryAI } from "../services/api";

export default function AIAssistantView({ activeCase }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Greetings, Examiner Rohan. I am your **Forensight AI Investigation Assistant** for Case **${activeCase?.case_number || "FS-2026-001"}**.\n\nAll my responses are strictly grounded in normalized digital evidence (Windows Event logs, Sysmon, Registry hives, Volatility memory records, and Zeek PCAP flows). I cite verifiable Event IDs for every claim.\n\nHow can I assist your investigation?`,
      citations: [],
      confidence: 1.0,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Summarize the complete incident timeline and attack sequence",
    "Show suspicious PowerShell activity and commands",
    "Which evidence indicates registry persistence?",
    "Show network connections related to data exfiltration",
    "What credentials were targeted and harvested?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || loading || !activeCase) return;

    const userMsg = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await queryAI(activeCase.case_id, textToSend);
      const aiMsg = {
        sender: "ai",
        text: res.response,
        citations: res.citations || [],
        confidence: res.confidence_score || 0.90,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        sender: "ai",
        text: `Error connecting to AI reasoning service: ${err.message}. Ensure backend is running.`,
        citations: [],
        confidence: 0.0,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1200px", margin: "0 auto", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexShrink: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Bot size={20} color="var(--cyan)" />
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc" }}>
              Evidence-Grounded AI Assistant (RAG Engine)
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Module 4: Zero-hallucination conversational interface citing precise event IDs, sources, and timestamps.
          </p>
        </div>

        <span className="badge-tag badge-cyan">
          <ShieldCheck size={13} /> Strict Artifact Grounding
        </span>
      </div>

      {/* Suggested Quick Queries */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "10px", flexShrink: 0 }}>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            className="btn btn-secondary"
            style={{ fontSize: "11.5px", padding: "6px 12px", whiteSpace: "nowrap", borderRadius: "16px" }}
            onClick={() => handleSend(prompt)}
            disabled={loading}
          >
            <Sparkles size={12} color="var(--cyan)" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="forensic-card" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px", padding: "20px", marginBottom: "16px" }}>
        {messages.map((m, idx) => {
          const isUser = m.sender === "user";

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
                gap: "6px",
                maxWidth: "92%",
                alignSelf: isUser ? "flex-end" : "flex-start"
              }}
            >
              {/* Sender Name & Time */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
                {isUser ? (
                  <>
                    <span>Examiner Rohan</span>
                    <User size={12} />
                  </>
                ) : (
                  <>
                    <Bot size={13} color="var(--cyan)" />
                    <span style={{ color: "var(--cyan)", fontWeight: "600" }}>Forensight Assistant</span>
                    {m.confidence > 0 && (
                      <span className="badge-tag badge-emerald" style={{ fontSize: "9px", padding: "1px 5px" }}>
                        Confidence: {(m.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </>
                )}
                <span>• {m.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div style={{
                background: isUser ? "rgba(6, 182, 212, 0.15)" : "rgba(15, 23, 42, 0.9)",
                border: `1px solid ${isUser ? "rgba(6, 182, 212, 0.35)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                fontSize: "13.5px",
                color: "#f8fafc",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap"
              }}>
                {m.text}

                {/* Evidence Citations Section */}
                {m.citations && m.citations.length > 0 && (
                  <div style={{ marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Link2 size={13} />
                      Verifiable Forensic Evidence Citations ({m.citations.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {m.citations.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(6, 182, 212, 0.2)",
                            borderRadius: "var(--radius-sm)",
                            padding: "8px 12px",
                            fontSize: "11.5px"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                            <span className="mono" style={{ color: "var(--cyan)", fontWeight: "600" }}>
                              Event ID: {c.event_id.substring(0, 8)}...
                            </span>
                            <span className="mono" style={{ color: "var(--emerald)" }}>
                              {c.timestamp}
                            </span>
                          </div>
                          <div style={{ color: "var(--text-dim)" }}>
                            <strong style={{ color: "#e2e8f0" }}>{c.source_entity}:</strong> {c.summary}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--cyan)", fontSize: "13px" }}>
            <Cpu size={16} className="spin" />
            <span>Cross-correlating normalized forensic artifacts and building evidence citations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
        <input
          type="text"
          className="input-control"
          style={{ flex: 1, padding: "12px 18px", fontSize: "13.5px" }}
          placeholder="Ask a forensic question (e.g. 'Show encoded PowerShell commands', 'Which registry key was altered?')..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button className="btn btn-primary" style={{ padding: "0 22px" }} onClick={() => handleSend()} disabled={loading || !inputText.trim()}>
          <Send size={16} /> Send Query
        </button>
      </div>
    </div>
  );
}
