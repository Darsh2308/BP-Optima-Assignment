# Development Plan — Idea 2: Live Decision Pipeline Demo

Builds a sandboxed, in-browser simulation of GroundSet's actual pipeline:
**evidence → structured extraction → deterministic policy rule → decision → audit log entry.**

## Engineering stance

"Production-ready from the start" and "rough is fine" aren't actually in conflict if we
split them correctly:

- **Production-grade:** typed end-to-end, pure/testable core logic, clean component
  boundaries, no dead code, deployable with one command, a real README.
- **Intentionally minimal scope:** no backend, no database, no auth, no real ML model —
  2-3 hardcoded evidence samples and a handful of real (not fake) if/then rules that
  actually execute. The craftsmanship is production-level; the surface area is a
  deliberately small, honest slice.

Over-scoping this (real backend, real file uploads, a real LLM call) would blow the time
budget and add nothing to the story we're telling. Under-scoping it (a static screenshot
with no real logic) would undercut the entire pitch of "nothing invented, everything
verifiable." Phase 1 exists specifically to make sure the rule engine is real code that
runs and is tested — not a scripted animation pretending to be one.

## Stack

- **Next.js 14 (App Router) + TypeScript** — fast to scaffold, deploys to Vercel in one command, gives a live shareable link (required for submission).
- **Tailwind CSS** — fast, consistent styling; easy to approximate bpoptima.com's visual language.
- **Vitest** — unit tests for the rule engine (small, fast, zero-config with Vite/Next).
- **Deploy target:** Vercel (free, instant public URL, no infra to manage).

## Folder structure

```
bpoptima-demo/
├── app/
│   ├── layout.tsx              # root layout, fonts, metadata
│   ├── page.tsx                 # the single demo page (composition root)
│   └── globals.css
├── components/
│   ├── evidence-picker/
│   │   ├── EvidencePicker.tsx
│   │   └── EvidencePicker.module.css (if needed)
│   ├── processing-timeline/
│   │   └── ProcessingTimeline.tsx
│   ├── decision-card/
│   │   └── DecisionCard.tsx
│   └── audit-trail-panel/
│       └── AuditTrailPanel.tsx
├── lib/
│   ├── rules-engine/
│   │   ├── engine.ts             # pure function: (evidence, rules) => Decision
│   │   ├── engine.test.ts        # unit tests
│   │   └── rules.ts              # the actual deterministic policy rules
│   └── data/
│       └── sample-evidence.ts    # 2-3 canned "extracted" evidence objects
├── types/
│   └── domain.ts                 # EvidenceItem, ExtractedFields, PolicyRule, Decision, AuditLogEntry
├── public/
├── README.md
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

Rationale: `lib/rules-engine` has zero UI dependencies and zero I/O — it's pure logic,
which is exactly what needs to be demonstrably deterministic and testable. UI components
only ever consume its output; they never contain decision logic themselves.

---

## Phase 0 — Project Setup & Concept Alignment

Nothing client-facing yet. Goal: no ambiguity left before writing feature code.

- [ ] Scaffold with `create-next-app` (TypeScript, Tailwind, App Router, ESLint)
- [ ] Set up Prettier + ESLint config
- [ ] Create the empty folder skeleton above with placeholder files
- [ ] Define all domain types in `types/domain.ts`
- [ ] Write out, in plain text, the 2-3 evidence scenarios we'll use and their expected outcomes (see below) — locked before any UI is built
- [ ] Connect repo to Vercel so every later phase can be deployed/checked live
- [ ] Confirm "definition of done" for MVP (Phases 0-3 + 5) vs. stretch (Phase 4)

**Locked scenarios (financial services + healthcare, matching BPOptima's real named use cases):**

1. **MSME micro-loan application** — extracted fields: monthly revenue, prior defaults, requested amount. Rule: `if prior_defaults == 0 and requested_amount <= 0.3 * monthly_revenue → APPROVE`, else `→ REFER`.
2. **Insurance claim triage** — extracted fields: claim amount, policy tenure, prior claims count. Rule: `if claim_amount > threshold and prior_claims_count >= 2 → FLAG_FOR_REVIEW`, else `→ AUTO_APPROVE`.
3. (stretch) **Storefront/KYC photo verification** — extracted fields: business name match, address match confidence. Rule-based pass/fail.

## Phase 1 — Domain Layer: Evidence Data + Deterministic Rule Engine

No UI. The engine must run and be tested standalone before any component touches it.

- [ ] Author the 2-3 sample evidence objects as typed data in `lib/data/sample-evidence.ts`
- [ ] Implement the rule engine in `lib/rules-engine/engine.ts` as a pure function: `evaluate(evidence, rules) => { decision, firedRule, reasoning }`
- [ ] Define rules explicitly and readably in `lib/rules-engine/rules.ts` (no magic numbers buried in components)
- [ ] Write unit tests covering each rule branch (approve / refer / decline paths)
- [ ] Sanity-check: engine has no dependency on React/Next — could run in a plain Node script

## Phase 2 — Core Interaction UI

- [ ] `EvidencePicker`: select one of the sample scenarios
- [ ] `ProcessingTimeline`: four visible stages — *Evidence Ingested → Structured Data Extracted → Policy Rule Evaluated → Decision Routed* — driven by real state transitions, not a fake setTimeout animation with no underlying state
- [ ] Wire picker → engine call → timeline/result state in `page.tsx`
- [ ] Entirely client-side — no network round trip needed, keeps it fast and deploy-simple

## Phase 3 — Decision Output & Audit Trail

- [ ] `DecisionCard`: shows the outcome and, critically, **which exact rule fired** (not a vague confidence score — determinism is the whole point)
- [ ] `AuditTrailPanel`: timestamp, rule ID/version, evidence reference, outcome
- [ ] "Copy as JSON" on the audit entry — reinforces that this is a real artifact, not decorative UI

## Phase 4 — Visual Identity & Trust Framing (stretch, if time remains)

- [ ] Approximate bpoptima.com's type/color/spacing so the demo feels native, not bolted on
- [ ] Add an explicit, honest framing strip: *"Sandboxed simulation of GroundSet's decision pipeline — synthetic data, illustrative rules."* (Honesty here matters more than polish — overclaiming would contradict the entire pitch.)
- [ ] Responsive pass, focus states, basic accessibility

## Phase 5 — Deploy, Document, Cross-check Defense

- [ ] Deploy to Vercel, verify the public link works in a private/incognito window
- [ ] Write `README.md`: what this is, how to run it locally, architecture notes
- [ ] Re-read `idea.md` and confirm the built demo actually supports the stakeholder/trade-off/rejected-idea talking points for the recorded defense

---

## Scope discipline

Given the assignment's own 90-120 min guidance for the *entire* exercise (research + build +
recording), and that research already spent real time, treat Phases 0, 1, 2, 3, 5 as the
**MVP — must ship**. Phase 4 is explicitly a stretch phase: cut it first if time runs short,
and say so plainly in the recorded defense rather than quietly skipping it. A working,
honestly-scoped demo beats a polished one that's late.
