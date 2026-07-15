import { describe, expect, it } from "vitest";
import { sampleEvidence } from "@/lib/data/sample-evidence";
import type { EvidenceItem } from "@/types/domain";
import { evaluate } from "./engine";

function findSample(id: string): EvidenceItem {
  const item = sampleEvidence.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing fixture: ${id}`);
  return item;
}

describe("evaluate — msme-loan", () => {
  it("approves when there are no prior defaults and the amount is within 30% of revenue", () => {
    const result = evaluate(findSample("msme-loan-clean"));
    expect(result.decision).toBe("APPROVE");
    expect(result.ruleId).toBe("msme-loan-policy");
    expect(result.checks).toHaveLength(2);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });

  it("refers when the applicant has a prior default, regardless of requested amount", () => {
    const result = evaluate(findSample("msme-loan-review"));
    expect(result.decision).toBe("REFER");
    // The default check fails; the amount-within-threshold check still passes on its own.
    expect(result.checks[0].passed).toBe(false);
    expect(result.checks[1].passed).toBe(true);
  });

  it("is deterministic across the exact 30% threshold boundary", () => {
    const atThreshold: EvidenceItem = {
      id: "boundary-at",
      category: "msme-loan",
      label: "Boundary case",
      description: "",
      extractedFields: { monthlyRevenue: 100000, priorDefaults: 0, requestedAmount: 30000 },
    };
    const justOverThreshold: EvidenceItem = {
      ...atThreshold,
      id: "boundary-over",
      extractedFields: { ...atThreshold.extractedFields, requestedAmount: 30001 },
    };

    expect(evaluate(atThreshold).decision).toBe("APPROVE");
    expect(evaluate(justOverThreshold).decision).toBe("REFER");
  });
});

describe("evaluate — insurance-claim", () => {
  it("approves routine, low-value claims", () => {
    expect(evaluate(findSample("insurance-claim-routine")).decision).toBe("APPROVE");
  });

  it("refers high-value claims with 2 or more prior claims", () => {
    const result = evaluate(findSample("insurance-claim-review"));
    expect(result.decision).toBe("REFER");
    expect(result.ruleId).toBe("insurance-claim-triage");
    // Only REFER when both checks fail at once — neither condition alone is disqualifying.
    expect(result.checks.every((check) => !check.passed)).toBe(true);
  });

  it("approves a high-value claim when prior claims are below the threshold", () => {
    const evidence: EvidenceItem = {
      id: "single-prior-claim",
      category: "insurance-claim",
      label: "Single prior claim, high value",
      description: "",
      extractedFields: { claimAmount: 50000, policyTenureMonths: 12, priorClaimsCount: 1 },
    };
    expect(evaluate(evidence).decision).toBe("APPROVE");
  });
});

describe("evaluate — kyc-verification", () => {
  it("approves a matched business name with high address confidence", () => {
    expect(evaluate(findSample("kyc-verification-pass")).decision).toBe("APPROVE");
  });

  it("declines a mismatched business name with low address confidence", () => {
    const result = evaluate(findSample("kyc-verification-fail"));
    expect(result.decision).toBe("DECLINE");
    expect(result.ruleId).toBe("kyc-verification-check");
    expect(result.checks.every((check) => !check.passed)).toBe(true);
  });

  it("declines when the name matches but confidence is below threshold", () => {
    const evidence: EvidenceItem = {
      id: "low-confidence-match",
      category: "kyc-verification",
      label: "Name match, low confidence",
      description: "",
      extractedFields: { businessNameMatch: true, addressMatchConfidence: 0.5 },
    };
    const result = evaluate(evidence);
    expect(result.decision).toBe("DECLINE");
    // Name-match check passes on its own; the confidence check is what fails.
    expect(result.checks[0].passed).toBe(true);
    expect(result.checks[1].passed).toBe(false);
  });
});

describe("evaluate — determinism", () => {
  it("returns byte-identical output across repeated calls with the same input", () => {
    const evidence = findSample("msme-loan-clean");
    const results = Array.from({ length: 5 }, () => evaluate(evidence));
    const uniqueSerializations = new Set(results.map((result) => JSON.stringify(result)));
    expect(uniqueSerializations.size).toBe(1);
  });

  it("never invents a decision outside the closed Decision vocabulary", () => {
    const allowed = new Set(["APPROVE", "REFER", "DECLINE"]);
    for (const evidence of sampleEvidence) {
      expect(allowed.has(evaluate(evidence).decision)).toBe(true);
    }
  });

  it("always surfaces at least one itemized, inspectable check behind every decision", () => {
    for (const evidence of sampleEvidence) {
      const result = evaluate(evidence);
      expect(result.checks.length).toBeGreaterThan(0);
      for (const check of result.checks) {
        expect(typeof check.description).toBe("string");
        expect(check.description.length).toBeGreaterThan(0);
        expect(typeof check.passed).toBe("boolean");
      }
    }
  });
});
