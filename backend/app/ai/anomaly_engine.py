"""
Forensight AI - Anomaly Detection Engine (Module 3)
Evaluates normalized forensic events against behavioral heuristics and threat indicators.
Assigns confidence scores, anomaly flags, and classifies investigative findings.
"""

from typing import Dict, Any, Tuple, Optional


class AnomalyDetectionEngine:
    """Heuristic and behavioral anomaly evaluation for normalized events."""

    SUSPICIOUS_PARENTS = ["winword.exe", "excel.exe", "powerpnt.exe", "outlook.exe", "acrord32.exe"]
    SUSPICIOUS_CHILDREN = ["powershell.exe", "cmd.exe", "wscript.exe", "cscript.exe", "certutil.exe", "bitsadmin.exe", "mshta.exe"]
    SUSPICIOUS_CLI_PATTERNS = ["-enc", "-encodedcommand", "downloadstring", "invoke-expression", "iex", "bypass", "hidden", "nop"]
    PERSISTENCE_KEYS = ["currentversion\\run", "currentversion\\runonce", "winlogon\\userinit", "image file execution options"]
    CREDENTIAL_INDICATORS = ["lsass.exe", "mimikatz", "sekurlsa", "procdump", "sam", "system.save"]

    @classmethod
    def evaluate_event(cls, event_type: str, details: Dict[str, Any]) -> Tuple[bool, float, Optional[str], Optional[str]]:
        """
        Returns: (is_anomalous, anomaly_score, finding_title, finding_type)
        """
        score = 0.0
        finding_title = None
        finding_type = None

        details_str = str(details).lower()

        # 1. Process Execution Evaluation
        if event_type == "PROCESS_CREATE":
            parent = (details.get("parent_image") or details.get("ParentImage") or "").lower()
            child = (details.get("image") or details.get("Image") or details.get("process_name") or "").lower()
            cli = (details.get("command_line") or details.get("CommandLine") or "").lower()

            # Malicious parent -> child (Office macro spawning shell)
            for p in cls.SUSPICIOUS_PARENTS:
                if p in parent:
                    for c in cls.SUSPICIOUS_CHILDREN:
                        if c in child:
                            score = max(score, 0.95)
                            finding_title = f"Suspicious Process Spawn: {p} launched {c}"
                            finding_type = "SUSPICIOUS_EXECUTION"

            # Obfuscated / Encoded PowerShell execution
            if "powershell" in child or "powershell" in cli:
                for pattern in cls.SUSPICIOUS_CLI_PATTERNS:
                    if pattern in cli:
                        score = max(score, 0.92)
                        finding_title = f"Encoded / Malicious PowerShell Command Detected ({pattern})"
                        finding_type = "SUSPICIOUS_EXECUTION"

            # Credential Access Tooling
            for cred in cls.CREDENTIAL_INDICATORS:
                if cred in cli or cred in child:
                    score = max(score, 0.98)
                    finding_title = f"Credential Access / Dumping Attempt ({cred})"
                    finding_type = "CREDENTIAL_ACCESS"

        # 2. Registry Persistence Evaluation
        elif event_type in ("REGISTRY_PERSISTENCE", "REGISTRY_WRITE"):
            key_path = (details.get("key_path") or details.get("TargetObject") or "").lower()
            val_data = (details.get("value_data") or details.get("Details") or "").lower()
            for pk in cls.PERSISTENCE_KEYS:
                if pk in key_path:
                    score = max(score, 0.88)
                    finding_title = "Unauthorized Registry Persistence Run Key Established"
                    finding_type = "PERSISTENCE"
                    if any(c in val_data for c in cls.SUSPICIOUS_CHILDREN) or ".bat" in val_data or ".vbs" in val_data:
                        score = 0.95

        # 3. Network Connection Evaluation
        elif event_type == "NETWORK_CONNECTION":
            dst_ip = details.get("dst_ip") or details.get("DestinationIp") or ""
            dst_port = str(details.get("dst_port") or details.get("DestinationPort") or "")
            bytes_sent = details.get("bytes_transferred") or details.get("bytes") or 0

            # Outbound on non-standard ports or known suspicious egress
            if dst_port in ["4444", "1337", "8088", "9001", "8888"]:
                score = max(score, 0.90)
                finding_title = f"Suspicious C2 Beaconing to Non-Standard Port {dst_port}"
                finding_type = "COMMAND_AND_CONTROL"

            # Exfiltration detection by volume
            if int(bytes_sent) > 5000000:  # > 5MB
                score = max(score, 0.89)
                finding_title = f"Abnormal Outbound Data Transfer ({int(bytes_sent)/(1024*1024):.1f} MB to {dst_ip})"
                finding_type = "DATA_EXFILTRATION"

        # 4. Logon Failure Clusters
        elif event_type == "LOGON_FAILURE":
            score = max(score, 0.65)
            finding_title = "Failed Authentication Attempt"
            finding_type = "AUTHENTICATION_ANOMALY"

        is_anomalous = score >= 0.70
        return is_anomalous, round(score, 2), finding_title, finding_type
