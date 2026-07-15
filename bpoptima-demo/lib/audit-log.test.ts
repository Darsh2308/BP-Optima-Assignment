import { describe, expect, it } from "vitest";
import { sampleEvidence } from "@/lib/data/sample-evidence";
import { evaluate } from "@/lib/rules-engine/engine";
import { createAuditLogEntry } from "./audit-log";

describe("createAuditLogEntry", () => {
  it("stamps a unique id and a valid ISO timestamp around a decision result", () => {
    const evidence = sampleEvidence[0];
    const result = evaluate(evidence);

    const entryA = createAuditLogEntry(evidence, result);
    const entryB = createAuditLogEntry(evidence, result);

    expect(entryA.id).not.toBe(entryB.id);
    expect(new Date(entryA.timestamp).toISOString()).toBe(entryA.timestamp);
    expect(entryA.evidenceId).toBe(evidence.id);
    expect(entryA.evidenceLabel).toBe(evidence.label);
    expect(entryA.decision).toBe(result.decision);
    expect(entryA.ruleId).toBe(result.ruleId);
    expect(entryA.ruleVersion).toBe(result.ruleVersion);
    expect(entryA.reasoning).toBe(result.reasoning);
    expect(entryA.checks).toBe(result.checks);
  });
});
