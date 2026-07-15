/**
 * Shared domain contract for the decision pipeline demo.
 * lib/rules-engine and every UI component are written against these types —
 * nothing downstream should redefine or duplicate this shape.
 */

export type EvidenceCategory = "msme-loan" | "insurance-claim" | "kyc-verification";

// A decision vocabulary shared across all evidence categories (rather than
// per-category outcomes like AUTO_APPROVE/FLAG_FOR_REVIEW) so the decision
// card and audit trail can render one consistent set of states/colors.
export type Decision = "APPROVE" | "REFER" | "DECLINE";

export interface MsmeLoanFields {
  monthlyRevenue: number;
  priorDefaults: number;
  requestedAmount: number;
}

export interface InsuranceClaimFields {
  claimAmount: number;
  policyTenureMonths: number;
  priorClaimsCount: number;
}

export interface KycVerificationFields {
  businessNameMatch: boolean;
  addressMatchConfidence: number; // 0-1
}

interface EvidenceItemBase {
  id: string;
  label: string;
  description: string;
}

export type EvidenceItem =
  | (EvidenceItemBase & { category: "msme-loan"; extractedFields: MsmeLoanFields })
  | (EvidenceItemBase & { category: "insurance-claim"; extractedFields: InsuranceClaimFields })
  | (EvidenceItemBase & { category: "kyc-verification"; extractedFields: KycVerificationFields });

// One individual condition a policy rule checked, shown as its own ✓/✗ line
// so a visitor can inspect the rule's actual logic, not just trust a summary.
export interface RuleCheck {
  description: string;
  passed: boolean;
}

export interface DecisionResult {
  decision: Decision;
  reasoning: string;
  checks: RuleCheck[];
  ruleId: string;
  ruleVersion: string;
}

export interface AuditLogEntry extends DecisionResult {
  id: string;
  timestamp: string; // ISO 8601, stamped at evaluation time
  evidenceId: string;
  evidenceLabel: string;
}
