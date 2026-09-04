import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import DashboardView from "./views/DashboardView";
import EvidenceView from "./views/EvidenceView";
import TimelineView from "./views/TimelineView";
import AttackPathView from "./views/AttackPathView";
import ValidationGateView from "./views/ValidationGateView";
import AIAssistantView from "./views/AIAssistantView";
import ReportsView from "./views/ReportsView";
import AuditLogView from "./views/AuditLogView";

import {
  getCases,
  getCaseStats,
  getEvidence,
  getTimeline,
  getAttackPath,
  getFindings,
  getReports,
  getAuditLogs,
  runCorrelation,
  reseedDatabase
} from "./services/api";

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [activeCase, setActiveCase] = useState(null);
  const [stats, setStats] = useState(null);

  const [evidenceList, setEvidenceList] = useState([]);
  const [events, setEvents] = useState([]);
  const [filterParams, setFilterParams] = useState({ search: "", event_type: "", only_anomalous: false });
  const [attackPathData, setAttackPathData] = useState(null);
  const [findings, setFindings] = useState([]);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isCorrelating, setIsCorrelating] = useState(false);

  // Load all initial case telemetry
  const loadCaseData = async (caseId) => {
    try {
      const [
        statsData,
        evidenceData,
        timelineData,
        attackData,
        findingsData,
        reportsData,
        logsData
      ] = await Promise.all([
        getCaseStats(caseId),
        getEvidence(caseId),
        getTimeline(caseId, filterParams),
        getAttackPath(caseId),
        getFindings(caseId),
        getReports(caseId),
        getAuditLogs(caseId)
      ]);

      setStats(statsData);
      setEvidenceList(evidenceData);
      setEvents(timelineData);
      setAttackPathData(attackData);
      setFindings(findingsData);
      setReports(reportsData);
      setAuditLogs(logsData);
    } catch (err) {
      console.error("Error loading case data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const cases = await getCases();
        if (cases && cases.length > 0) {
          const firstCase = cases[0];
          setActiveCase(firstCase);
          await loadCaseData(firstCase.case_id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setLoading(false);
      }
    }
    init();
  }, []);

  // Handle timeline filter change
  const handleTimelineFilter = async (newFilters) => {
    setFilterParams(newFilters);
    if (!activeCase) return;
    try {
      const filtered = await getTimeline(activeCase.case_id, newFilters);
      setEvents(filtered);
    } catch (err) {
      console.error("Timeline filtering error:", err);
    }
  };

  // Run AI Correlation
  const handleCorrelate = async () => {
    if (!activeCase) return;
    setIsCorrelating(true);
    try {
      const res = await runCorrelation(activeCase.case_id);
      alert(`AI Correlation Complete! Scanned ${res.events_scanned} events, updated ${res.anomalous_events_flagged} anomalies.`);
      await loadCaseData(activeCase.case_id);
    } catch (err) {
      alert("Correlation failed: " + err.message);
    } finally {
      setIsCorrelating(false);
    }
  };

  // Reset Demo Case
  const handleReseed = async () => {
    if (!confirm("Reset Operation Blackout demo dataset to initial state?")) return;
    setLoading(true);
    try {
      const res = await reseedDatabase();
      const cases = await getCases();
      if (cases.length > 0) {
        setActiveCase(cases[0]);
        await loadCaseData(cases[0].case_id);
      }
      alert("Operation Blackout demo dataset successfully re-seeded!");
    } catch (err) {
      alert("Reseed failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshActiveCase = () => {
    if (activeCase) {
      loadCaseData(activeCase.case_id);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
      />

      <div className="main-content">
        <TopBar
          activeCase={activeCase}
          onReseed={handleReseed}
          onCorrelate={handleCorrelate}
          isCorrelating={isCorrelating}
        />

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh", color: "var(--cyan)", gap: "12px", fontSize: "16px" }}>
            <span>Initializing Forensight AI Environment...</span>
          </div>
        ) : (
          <>
            {currentTab === "dashboard" && (
              <DashboardView
                stats={stats}
                activeCase={activeCase}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === "evidence" && (
              <EvidenceView
                evidenceList={evidenceList}
                activeCase={activeCase}
                onRefresh={refreshActiveCase}
              />
            )}

            {currentTab === "timeline" && (
              <TimelineView
                events={events}
                activeCase={activeCase}
                onFilterChange={handleTimelineFilter}
                filterParams={filterParams}
              />
            )}

            {currentTab === "attack_path" && (
              <AttackPathView
                attackPathData={attackPathData}
                activeCase={activeCase}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === "validation" && (
              <ValidationGateView
                findings={findings}
                activeCase={activeCase}
                onRefresh={refreshActiveCase}
              />
            )}

            {currentTab === "ai_assistant" && (
              <AIAssistantView
                activeCase={activeCase}
              />
            )}

            {currentTab === "reports" && (
              <ReportsView
                reports={reports}
                activeCase={activeCase}
                onRefresh={refreshActiveCase}
              />
            )}

            {currentTab === "audit_log" && (
              <AuditLogView
                auditLogs={auditLogs}
                activeCase={activeCase}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
