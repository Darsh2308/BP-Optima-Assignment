import type { Decision, EvidenceCategory, EvidenceItem } from "@/types/domain";

export const CATEGORY_LABELS: Record<EvidenceCategory, string> = {
  "msme-loan": "MSME Loan",
  "insurance-claim": "Insurance Claim",
  "kyc-verification": "KYC Verification",
};

interface DecisionStyle {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const DECISION_STYLES: Record<Decision, DecisionStyle> = {
  APPROVE: {
    label: "Approve",
    badgeClass: "bg-success/10 text-success-text ring-1 ring-inset ring-success/30",
    dotClass: "bg-success",
  },
  REFER: {
    label: "Refer for Review",
    badgeClass: "bg-warning/10 text-warning-text ring-1 ring-inset ring-warning/30",
    dotClass: "bg-warning",
  },
  DECLINE: {
    label: "Decline",
    badgeClass: "bg-danger/10 text-danger-text ring-1 ring-inset ring-danger/30",
    dotClass: "bg-danger",
  },
};

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Deliberately unitless (no currency symbol) — the sample scenarios reference
// BPOptima's real APAC deployments, and guessing a single currency for all of
// them would be a fabricated detail the demo doesn't need.
export function formatFieldPreview(evidence: EvidenceItem): string {
  switch (evidence.category) {
    case "msme-loan":
      return `Revenue ${evidence.extractedFields.monthlyRevenue.toLocaleString("en-US")} · Requested ${evidence.extractedFields.requestedAmount.toLocaleString("en-US")} · Prior defaults ${evidence.extractedFields.priorDefaults}`;
    case "insurance-claim":
      return `Claim ${evidence.extractedFields.claimAmount.toLocaleString("en-US")} · Tenure ${evidence.extractedFields.policyTenureMonths}mo · Prior claims ${evidence.extractedFields.priorClaimsCount}`;
    case "kyc-verification":
      return `Name match ${evidence.extractedFields.businessNameMatch ? "yes" : "no"} · Address confidence ${Math.round(evidence.extractedFields.addressMatchConfidence * 100)}%`;
  }
}
