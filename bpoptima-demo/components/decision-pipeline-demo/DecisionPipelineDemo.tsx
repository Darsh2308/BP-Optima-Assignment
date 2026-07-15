"use client";

import { useState } from "react";
import { AuditTrailPanel } from "@/components/audit-trail-panel/AuditTrailPanel";
import { DecisionCard } from "@/components/decision-card/DecisionCard";
import { EvidencePicker } from "@/components/evidence-picker/EvidencePicker";
import {
  ProcessingTimeline,
  type PipelineStage,
} from "@/components/processing-timeline/ProcessingTimeline";
import { createAuditLogEntry } from "@/lib/audit-log";
import { delay } from "@/lib/delay";
import { sampleEvidence } from "@/lib/data/sample-evidence";
import { evaluate } from "@/lib/rules-engine/engine";
import type { AuditLogEntry, DecisionResult } from "@/types/domain";

export function DecisionPipelineDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  const selectedEvidence = sampleEvidence.find((item) => item.id === selectedId) ?? null;

  function handleSelect(id: string) {
    if (isRunning) return;
    setSelectedId(id);
    setStage("idle");
    setResult(null);
  }

  async function handleRun() {
    if (!selectedEvidence || isRunning) return;

    setIsRunning(true);
    setResult(null);

    setStage("ingesting");
    await delay(450);
    setStage("extracting");
    await delay(550);
    setStage("evaluating");
    // Real, synchronous, deterministic — the pauses around this call are
    // purely for legibility. GroundSet's own production latency is <100ms.
    const outcome = evaluate(selectedEvidence);
    await delay(550);
    setStage("routed");
    setResult(outcome);
    setAuditLog((entries) => [createAuditLogEntry(selectedEvidence, outcome), ...entries]);
    setIsRunning(false);
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[360px_1fr] lg:gap-14">
        <aside>
          <EvidencePicker
            items={sampleEvidence}
            selectedId={selectedId}
            onSelect={handleSelect}
            disabled={isRunning}
          />
        </aside>

        <main className="flex flex-col gap-8 lg:pt-1">
          <div className="border-hairline bg-surface/40 rounded-xl border p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-muted text-[11px] font-semibold tracking-widest uppercase">
                  Decision Pipeline
                </p>
                <p className="text-muted mt-1 text-sm">
                  {selectedEvidence
                    ? selectedEvidence.label
                    : "Select a piece of evidence to begin."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRun}
                disabled={!selectedEvidence || isRunning}
                className={`focus-visible:ring-primary focus-visible:ring-offset-background inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  !selectedEvidence || isRunning
                    ? "bg-surface-2 text-faint cursor-not-allowed"
                    : "bg-primary text-background hover:bg-primary-hover shadow-[0_0_0_1px_rgba(56,163,198,0.5),0_8px_24px_-6px_rgba(56,163,198,0.5)]"
                }`}
              >
                {isRunning ? "Processing…" : "Run Decision Pipeline"}
              </button>
            </div>

            <div className="mt-8">
              <ProcessingTimeline currentStage={stage} />
            </div>
          </div>

          {result && selectedEvidence ? (
            <DecisionCard result={result} evidence={selectedEvidence} />
          ) : (
            <div className="border-hairline text-muted rounded-xl border border-dashed p-6 text-sm">
              The decision, the exact rule that fired, and its reasoning will appear here once the
              pipeline runs.
            </div>
          )}
        </main>
      </div>

      <AuditTrailPanel entries={auditLog} />
    </div>
  );
}
