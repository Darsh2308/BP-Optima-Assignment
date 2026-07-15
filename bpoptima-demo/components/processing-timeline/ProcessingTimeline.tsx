import { Fragment } from "react";

export type PipelineStage = "idle" | "ingesting" | "extracting" | "evaluating" | "routed";

type Step = { stage: Exclude<PipelineStage, "idle">; label: string };

const STEPS: Step[] = [
  { stage: "ingesting", label: "Evidence Ingested" },
  { stage: "extracting", label: "Structured Data Extracted" },
  { stage: "evaluating", label: "Policy Rule Evaluated" },
  { stage: "routed", label: "Decision Routed" },
];

type StepStatus = "pending" | "active" | "complete";

function getStepStatus(
  currentStage: PipelineStage,
  stepIndex: number,
  isLast: boolean,
): StepStatus {
  const currentIndex = STEPS.findIndex((step) => step.stage === currentStage);
  if (currentIndex === -1) return "pending";
  if (currentIndex > stepIndex) return "complete";
  // The last step has nothing after it to mark it "done" — treat reaching
  // it as complete immediately rather than showing a permanent "active" pulse.
  if (currentIndex === stepIndex) return isLast ? "complete" : "active";
  return "pending";
}

interface ProcessingTimelineProps {
  currentStage: PipelineStage;
}

export function ProcessingTimeline({ currentStage }: ProcessingTimelineProps) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          const status = getStepStatus(currentStage, index, isLast);

          return (
            <Fragment key={step.stage}>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-300 ${
                  status === "complete"
                    ? "border-primary bg-primary text-background"
                    : status === "active"
                      ? "border-primary text-primary shadow-[0_0_0_4px_rgba(56,163,198,0.15)] motion-safe:animate-pulse"
                      : "border-hairline-strong text-faint"
                }`}
                aria-hidden
              >
                {status === "complete" ? "✓" : index + 1}
              </div>
              {!isLast && (
                <div className="bg-hairline mx-1 h-px flex-1 overflow-hidden rounded-full">
                  <div
                    className={`bg-primary h-full transition-all duration-500 ease-out ${
                      status === "complete" ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-1">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          const status = getStepStatus(currentStage, index, isLast);
          return (
            <span
              key={step.stage}
              className={`text-center text-[11px] leading-tight font-medium sm:text-xs ${
                status === "pending" ? "text-faint" : "text-foreground"
              }`}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
