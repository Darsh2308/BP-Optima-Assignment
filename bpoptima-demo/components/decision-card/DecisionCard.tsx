import { DECISION_STYLES } from "@/lib/decision-presentation";
import type { DecisionResult, EvidenceItem } from "@/types/domain";

interface DecisionCardProps {
  result: DecisionResult;
  evidence: EvidenceItem;
}

export function DecisionCard({ result, evidence }: DecisionCardProps) {
  const style = DECISION_STYLES[result.decision];

  return (
    <div
      className={`border-hairline bg-surface/60 relative overflow-hidden rounded-xl border p-6 pl-7 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${style.dotClass}`} aria-hidden />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted text-[11px] font-medium tracking-wide uppercase">
            {evidence.label}
          </p>
          <p
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${style.badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} aria-hidden />
            {style.label}
          </p>
        </div>
        <div className="border-hairline bg-surface-2/60 text-muted rounded-md border px-2.5 py-1.5 text-right font-mono text-[11px]">
          <p>{result.ruleId}</p>
          <p>v{result.ruleVersion}</p>
        </div>
      </div>

      <p className="text-muted mt-5 text-[11px] font-semibold tracking-widest uppercase">
        Rule conditions checked
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {result.checks.map((check, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-0.5 shrink-0 font-mono text-xs ${
                check.passed ? "text-success-text" : "text-danger-text"
              }`}
              aria-hidden
            >
              {check.passed ? "✓" : "✗"}
            </span>
            <span className="text-foreground/90">
              <span className="sr-only">{check.passed ? "Passed: " : "Failed: "}</span>
              {check.description}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-muted mt-4 text-sm leading-relaxed italic">{result.reasoning}</p>

      <p className="text-muted mt-4 text-[11px] tracking-wide uppercase">
        Sandboxed simulation — synthetic evidence, illustrative policy rules
      </p>
    </div>
  );
}
