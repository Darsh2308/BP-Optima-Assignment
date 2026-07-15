import type {
  Decision,
  InsuranceClaimFields,
  KycVerificationFields,
  MsmeLoanFields,
  RuleCheck,
} from "@/types/domain";

interface RuleOutcome {
  decision: Decision;
  reasoning: string;
  checks: RuleCheck[];
}

export const MSME_LOAN_RULE_ID = "msme-loan-policy";
export const MSME_LOAN_RULE_VERSION = "1.0.0";

export function evaluateMsmeLoan(fields: MsmeLoanFields): RuleOutcome {
  const threshold = 0.3 * fields.monthlyRevenue;
  const noPriorDefaults = fields.priorDefaults === 0;
  const withinThreshold = fields.requestedAmount <= threshold;

  const checks: RuleCheck[] = [
    { description: "No prior defaults on record", passed: noPriorDefaults },
    {
      description: `Requested amount within 30% of monthly revenue (≤ ${threshold})`,
      passed: withinThreshold,
    },
  ];

  if (noPriorDefaults && withinThreshold) {
    return {
      decision: "APPROVE",
      reasoning: `No prior defaults and requested amount (${fields.requestedAmount}) is within 30% of verified monthly revenue (${fields.monthlyRevenue}).`,
      checks,
    };
  }

  return {
    decision: "REFER",
    reasoning: !noPriorDefaults
      ? `Applicant has ${fields.priorDefaults} prior default(s) on record — routed for manual underwriting regardless of requested amount.`
      : `Requested amount (${fields.requestedAmount}) exceeds 30% of verified monthly revenue (${fields.monthlyRevenue}) — routed for manual underwriting.`,
    checks,
  };
}

export const INSURANCE_CLAIM_RULE_ID = "insurance-claim-triage";
export const INSURANCE_CLAIM_RULE_VERSION = "1.0.0";
const CLAIM_REVIEW_THRESHOLD = 20000;
const CLAIM_REVIEW_PRIOR_CLAIMS_THRESHOLD = 2;

export function evaluateInsuranceClaim(fields: InsuranceClaimFields): RuleOutcome {
  const withinAmountThreshold = fields.claimAmount <= CLAIM_REVIEW_THRESHOLD;
  const belowRepeatFilerThreshold = fields.priorClaimsCount < CLAIM_REVIEW_PRIOR_CLAIMS_THRESHOLD;

  const checks: RuleCheck[] = [
    {
      description: `Claim amount within auto-approval threshold (≤ ${CLAIM_REVIEW_THRESHOLD})`,
      passed: withinAmountThreshold,
    },
    {
      description: `Prior claims below repeat-filer threshold (< ${CLAIM_REVIEW_PRIOR_CLAIMS_THRESHOLD})`,
      passed: belowRepeatFilerThreshold,
    },
  ];

  if (!withinAmountThreshold && !belowRepeatFilerThreshold) {
    return {
      decision: "REFER",
      reasoning: `Claim amount (${fields.claimAmount}) exceeds the ${CLAIM_REVIEW_THRESHOLD} review threshold and applicant has ${fields.priorClaimsCount} prior claims — routed for manual review.`,
      checks,
    };
  }

  return {
    decision: "APPROVE",
    reasoning: `Claim amount and prior claims history fall within auto-approval policy.`,
    checks,
  };
}

export const KYC_VERIFICATION_RULE_ID = "kyc-verification-check";
export const KYC_VERIFICATION_RULE_VERSION = "1.0.0";
const KYC_CONFIDENCE_THRESHOLD = 0.7;

export function evaluateKycVerification(fields: KycVerificationFields): RuleOutcome {
  const nameMatches = fields.businessNameMatch;
  const confidenceMeetsThreshold = fields.addressMatchConfidence >= KYC_CONFIDENCE_THRESHOLD;

  const checks: RuleCheck[] = [
    { description: "Business name matches registered records", passed: nameMatches },
    {
      description: `Address match confidence meets threshold (≥ ${KYC_CONFIDENCE_THRESHOLD})`,
      passed: confidenceMeetsThreshold,
    },
  ];

  if (nameMatches && confidenceMeetsThreshold) {
    return {
      decision: "APPROVE",
      reasoning: `Business name matched and address match confidence (${fields.addressMatchConfidence}) meets the ${KYC_CONFIDENCE_THRESHOLD} threshold.`,
      checks,
    };
  }

  return {
    decision: "DECLINE",
    reasoning: `Business name match or address match confidence (${fields.addressMatchConfidence}) failed the ${KYC_CONFIDENCE_THRESHOLD} threshold.`,
    checks,
  };
}
