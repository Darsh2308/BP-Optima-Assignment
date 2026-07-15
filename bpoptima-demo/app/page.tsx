import { DecisionPipelineDemo } from "@/components/decision-pipeline-demo/DecisionPipelineDemo";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(56,163,198,0.16),transparent)]"
        aria-hidden
      />

      <header className="border-hairline flex items-center justify-between border-b px-6 py-4 sm:px-10">
        <span className="text-foreground text-sm font-semibold tracking-tight">GroundSet</span>
        <span className="border-hairline text-muted inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium">
          <span className="bg-success h-1.5 w-1.5 rounded-full" aria-hidden />
          Sandboxed demo · synthetic data only
        </span>
      </header>

      <div className="flex flex-1 flex-col items-center gap-14 px-6 py-14 sm:px-10 sm:py-20">
        <div className="max-w-2xl text-center">
          <p className="text-primary text-sm font-medium tracking-wide uppercase">
            Live Decision Pipeline
          </p>
          <h1 className="font-display text-foreground mt-3 text-3xl font-semibold text-balance sm:text-4xl">
            Pick real evidence. Watch a deterministic rule decide. Inspect exactly why.
          </h1>
          <p className="text-muted mt-4 text-sm leading-relaxed">
            A sandboxed, in-browser walkthrough of the same evidence → structured data → policy rule
            → decision → audit trail pipeline GroundSet runs in production. Nothing here is a black
            box — every outcome traces back to one visible, versioned rule.
          </p>
        </div>

        <div className="w-full max-w-5xl">
          <DecisionPipelineDemo />
        </div>
      </div>
    </div>
  );
}
