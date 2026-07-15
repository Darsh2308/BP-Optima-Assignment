"use client";

import { useState } from "react";
import { DECISION_STYLES, formatTimestamp } from "@/lib/decision-presentation";
import type { AuditLogEntry } from "@/types/domain";

interface AuditTrailPanelProps {
  entries: AuditLogEntry[];
}

export function AuditTrailPanel({ entries }: AuditTrailPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(entry: AuditLogEntry) {
    await navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
    setCopiedId(entry.id);
    setTimeout(() => {
      setCopiedId((current) => (current === entry.id ? null : current));
    }, 1500);
  }

  return (
    <div className="border-hairline bg-surface/40 rounded-xl border p-6">
      <p className="text-muted text-[11px] font-semibold tracking-widest uppercase">Audit Trail</p>
      <p className="text-muted mt-1 text-sm">
        {entries.length === 0
          ? "No decisions logged yet."
          : `${entries.length} decision${entries.length === 1 ? "" : "s"} logged this session, newest first.`}
      </p>

      {entries.length === 0 ? (
        <p className="border-hairline text-muted mt-5 rounded-lg border border-dashed p-4 text-sm">
          Run the pipeline to generate the first entry — every decision made gets logged here, in
          order, with the exact rule and evidence behind it.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {entries.map((entry) => {
            const style = DECISION_STYLES[entry.decision];
            return (
              <li
                key={entry.id}
                className="border-hairline bg-surface-2/40 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-muted font-mono text-[11px]" title={entry.timestamp}>
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  <span className="text-foreground text-sm">{entry.evidenceLabel}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} aria-hidden />
                    {style.label}
                  </span>
                  <span className="text-muted font-mono text-[11px]">
                    {entry.ruleId}@v{entry.ruleVersion}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(entry)}
                  className="border-hairline text-muted hover:border-hairline-strong hover:text-foreground focus-visible:ring-primary shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {copiedId === entry.id ? "Copied" : "Copy JSON"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
