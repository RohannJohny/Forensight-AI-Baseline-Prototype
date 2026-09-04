import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Float, Integer, DateTime, ForeignKey, JSON, LargeBinary
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), default="Investigator")  # "Admin", "Investigator"
    created_at = Column(DateTime, default=datetime.utcnow)

    cases = relationship("Case", back_populates="user", cascade="all, delete-orphan")


class Case(Base):
    __tablename__ = "cases"

    case_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    case_number = Column(String(50), unique=True, nullable=False, index=True)
    case_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="Active")  # "Active", "Under Investigation", "Closed"
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cases")
    evidence_items = relationship("Evidence", back_populates="case", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="case", cascade="all, delete-orphan")
    attack_nodes = relationship("AttackNode", back_populates="case", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="case", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidence"

    evidence_id = Column(String(36), primary_key=True, default=generate_uuid)
    case_id = Column(String(36), ForeignKey("cases.case_id"), nullable=False, index=True)
    source_name = Column(String(255), nullable=False)
    evidence_type = Column(String(50), nullable=False)  # "DISK_IMAGE", "MEMORY_DUMP", "EVTX", "REGISTRY", "PCAP"
    storage_path = Column(String(500), nullable=False)
    hash_sha256 = Column(String(64), nullable=False)
    hash_sha1 = Column(String(40), nullable=True)
    hash_md5 = Column(String(32), nullable=True)
    byte_size = Column(String(50), nullable=True)
    ingested_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="evidence_items")
    artifacts = relationship("Artifact", back_populates="evidence", cascade="all, delete-orphan")


class Artifact(Base):
    __tablename__ = "artifacts"

    artifact_id = Column(String(36), primary_key=True, default=generate_uuid)
    evidence_id = Column(String(36), ForeignKey("evidence.evidence_id"), nullable=False, index=True)
    artifact_type = Column(String(50), nullable=False)  # "LOG", "REGISTRY", "PROCESS", "NETWORK", "FILESYSTEM"
    parser_used = Column(String(100), nullable=False)
    raw_data = Column(JSON, nullable=True)
    extracted_at = Column(DateTime, default=datetime.utcnow)

    evidence = relationship("Evidence", back_populates="artifacts")
    events = relationship("Event", back_populates="artifact", cascade="all, delete-orphan")


class Event(Base):
    __tablename__ = "events"

    event_id = Column(String(36), primary_key=True, default=generate_uuid)
    artifact_id = Column(String(36), ForeignKey("artifacts.artifact_id"), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)  # Normalized to UTC
    event_type = Column(String(100), nullable=False, index=True)
    source_entity = Column(String(150), nullable=False)
    user_account = Column(String(100), nullable=True)
    host_ip = Column(String(100), nullable=True)
    details = Column(JSON, nullable=True)
    is_anomalous = Column(Integer, default=0)  # 0 or 1
    anomaly_score = Column(Float, default=0.0)

    artifact = relationship("Artifact", back_populates="events")
    findings = relationship("Finding", back_populates="event")


class Finding(Base):
    __tablename__ = "findings"

    finding_id = Column(String(36), primary_key=True, default=generate_uuid)
    case_id = Column(String(36), ForeignKey("cases.case_id"), nullable=False, index=True)
    event_id = Column(String(36), ForeignKey("events.event_id"), nullable=True, index=True)
    finding_title = Column(String(255), nullable=False)
    finding_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.85)
    validation_status = Column(String(30), default="Pending")  # "Pending", "Accepted", "Rejected", "Modified"
    investigator_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="findings")
    event = relationship("Event", back_populates="findings")
    attack_nodes = relationship("AttackNode", back_populates="finding")


class AttackNode(Base):
    __tablename__ = "attack_nodes"

    node_id = Column(String(36), primary_key=True, default=generate_uuid)
    case_id = Column(String(36), ForeignKey("cases.case_id"), nullable=False, index=True)
    finding_id = Column(String(36), ForeignKey("findings.finding_id"), nullable=True, index=True)
    mitre_technique = Column(String(100), nullable=False)
    stage_name = Column(String(100), nullable=False)  # e.g., "Initial Access", "Execution", "Persistence"
    stage_order = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)

    case = relationship("Case", back_populates="attack_nodes")
    finding = relationship("Finding", back_populates="attack_nodes")


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(String(36), primary_key=True, default=generate_uuid)
    case_id = Column(String(36), ForeignKey("cases.case_id"), nullable=False, index=True)
    report_name = Column(String(255), nullable=False)
    integrity_hash = Column(String(64), nullable=False)  # Plaintext SHA-256
    encrypted_file_path = Column(String(500), nullable=False)
    encrypted_rek = Column(LargeBinary, nullable=False)  # REK wrapped with MK via AES-256-GCM
    status = Column(String(30), default="Final")  # "Draft", "Final"
    finalized_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="reports")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(String(36), primary_key=True, default=generate_uuid)
    case_id = Column(String(36), nullable=True, index=True)
    user_name = Column(String(100), default="Investigator")
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
