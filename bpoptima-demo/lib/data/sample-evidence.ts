import type { EvidenceItem } from "@/types/domain";

/**
 * Canonical evidence fixtures for the demo. Each pair below is chosen to land
 * on a different branch of its category's policy rule, so picking any two
 * items proves the engine isn't just wired to always approve.
 */
export const sampleEvidence: EvidenceItem[] = [
  {
    id: "msme-loan-clean",
    category: "msme-loan",
    label: "MSME Loan — Retail Kirana Store",
    description:
      "Working-capital loan application for a neighborhood retail store, verified against 12 months of bank statements.",
    extractedFields: { monthlyRevenue: 480000, priorDefaults: 0, requestedAmount: 120000 },
  },
  {
    id: "msme-loan-review",
    category: "msme-loan",
    label: "MSME Loan — Textile Wholesaler",
    description:
      "Expansion loan application for a textile wholesaler with one prior default on record.",
    extractedFields: { monthlyRevenue: 300000, priorDefaults: 1, requestedAmount: 50000 },
  },
  {
    id: "insurance-claim-routine",
    category: "insurance-claim",
    label: "Insurance Claim — Minor Vehicle Damage",
    description: "Routine claim for minor collision damage from a long-tenured policyholder.",
    extractedFields: { claimAmount: 8000, policyTenureMonths: 24, priorClaimsCount: 1 },
  },
  {
    id: "insurance-claim-review",
    category: "insurance-claim",
    label: "Insurance Claim — Total Loss, Repeat Filer",
    description: "High-value total-loss claim from a policyholder with multiple prior claims.",
    extractedFields: { claimAmount: 45000, policyTenureMonths: 8, priorClaimsCount: 3 },
  },
  {
    id: "kyc-verification-pass",
    category: "kyc-verification",
    label: "KYC — Storefront Verification (Match)",
    description: "Storefront photo cross-checked against the registered business name and address.",
    extractedFields: { businessNameMatch: true, addressMatchConfidence: 0.92 },
  },
  {
    id: "kyc-verification-fail",
    category: "kyc-verification",
    label: "KYC — Storefront Verification (Mismatch)",
    description: "Storefront photo does not match registered business name or address records.",
    extractedFields: { businessNameMatch: false, addressMatchConfidence: 0.35 },
  },
];
