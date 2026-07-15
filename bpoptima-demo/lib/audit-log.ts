import type { AuditLogEntry, DecisionResult, EvidenceItem } from "@/types/domain";

/**
 * The only impure step in the pipeline — stamps an id and a clock reading
 * around an already-computed, deterministic DecisionResult. Kept separate
 * from lib/rules-engine so that engine stays pure and time-independent.
 */
export function createAuditLogEntry(evidence: EvidenceItem, result: DecisionResult): AuditLogEntry {
  return {
    ...result,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    evidenceId: evidence.id,
    evidenceLabel: evidence.label,
  };
}
