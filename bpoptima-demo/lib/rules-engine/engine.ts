import type { DecisionResult, EvidenceItem } from "@/types/domain";
import {
  evaluateInsuranceClaim,
  evaluateKycVerification,
  evaluateMsmeLoan,
  INSURANCE_CLAIM_RULE_ID,
  INSURANCE_CLAIM_RULE_VERSION,
  KYC_VERIFICATION_RULE_ID,
  KYC_VERIFICATION_RULE_VERSION,
  MSME_LOAN_RULE_ID,
  MSME_LOAN_RULE_VERSION,
} from "./rules";

function assertUnreachable(value: never): never {
  throw new Error(`Unhandled evidence category: ${JSON.stringify(value)}`);
}

/**
 * Pure, deterministic: same evidence in, same decision out, every time.
 * No I/O, no clock, no randomness — the audit trail (Phase 3) stamps
 * timestamps/ids around this, it doesn't need to live inside it.
 */
export function evaluate(evidence: EvidenceItem): DecisionResult {
  switch (evidence.category) {
    case "msme-loan": {
      const outcome = evaluateMsmeLoan(evidence.extractedFields);
      return { ...outcome, ruleId: MSME_LOAN_RULE_ID, ruleVersion: MSME_LOAN_RULE_VERSION };
    }
    case "insurance-claim": {
      const outcome = evaluateInsuranceClaim(evidence.extractedFields);
      return {
        ...outcome,
        ruleId: INSURANCE_CLAIM_RULE_ID,
        ruleVersion: INSURANCE_CLAIM_RULE_VERSION,
      };
    }
    case "kyc-verification": {
      const outcome = evaluateKycVerification(evidence.extractedFields);
      return {
        ...outcome,
        ruleId: KYC_VERIFICATION_RULE_ID,
        ruleVersion: KYC_VERIFICATION_RULE_VERSION,
      };
    }
    default:
      return assertUnreachable(evidence);
  }
}
