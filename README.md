# BPOptima FDE Trainee Assignment — Darsh Patil

A live, in-browser simulation of GroundSet's decision pipeline, built for BPOptima's
FDE Trainee take-home. This README is the single entry point for the whole submission —
research, prototype, architecture, and how to run it.

**Live prototype:** _add Vercel URL here once deployed_
**Repo:** https://github.com/Darsh2308/BP-Optima-Assignment

---

## The one-sentence thesis

> The current bpoptima.com tells visitors to trust the system. This prototype lets them
> **inspect why a decision was made**, instead. For a company selling deterministic,
> auditable AI, inspection is more persuasive than assertion.

Everything below — the research, the idea selected, the thing actually built — is in
service of that one sentence.

---

## 1. The assignment

BPOptima builds "the system of record for decisions" — GroundSet reads evidence
(documents, images, video) into structured data, applies a client's own deterministic
rules, and routes every outcome with a full audit trail, on models the client owns.
bpoptima.com is seen by a Chief Risk Officer, a CTO, an investor, and an engineer — and
the assignment's explicit warning is that **impressive-but-wrong-for-a-risk-officer's-trust
is automatically the wrong answer**.

The task, in three parts:

1. Research 2-3 AI-era web design ideas B2B enterprise sites aren't using, each with a
   real linked example and a reason it fits BPOptima specifically.
2. Prototype the best one.
3. Defend it: which stakeholder it convinces, what it sacrifices, what was rejected and why.

## 2. Ground truth: what's actually on bpoptima.com today

Verified by fetching the live site, not assumed:

- Positioning: "sovereign decision infrastructure for regulated operations"
- Headline claims: ~99% decision accuracy, <100ms end-to-end latency, zero data leakage
- Flow described: evidence ingestion → SLM/VLM interpretation → policy-driven decision → routing → audit logging
- Industries: financial services (MSME/micro-lending, storefront verification), healthcare (prior auth, claims triage, credentialing)
- Explicitly named audience: **"institutional risk officers"** and CTOs at regulated institutions
- Design today: text-heavy, static, no interactive elements, no live demos
- Every trust claim (accuracy %, audit trail, zero-leakage) is **asserted as text**, never demonstrated

**The gap:** the site tells you it's trustworthy. It never lets you verify it. That gap is
what every idea below responds to.

## 3. Research — three ideas considered

| Idea | Real example | Best for | Verdict |
|---|---|---|---|
| **Live "Trust Center"** — a persistent page proving controls in real time, not a static compliance paragraph | [Vanta Trust Center](https://www.vanta.com/products/trust-center) | Chief Risk Officer | Finalist |
| **Live interactive decision demo** — pick evidence, watch a deterministic rule decide, inspect the result | [Stripe API Explorer / Workbench](https://docs.stripe.com/workbench) | CTOs/engineers, and CROs if built carefully | **✅ Selected** |
| **Grounded Q&A with citations** — chat restricted to BPOptima's own docs, every claim sourced | [Mintlify AI Assistant](https://www.mintlify.com/blog/introducing-ai-assistant-2025) | CRO self-serve diligence | Finalist |
| **Personalized/generative landing pages** — AI rewrites homepage copy per visitor | Clay/Mutiny pattern | — | **Rejected** |

**Why the interactive demo won:** it's the only idea that demonstrates the deterministic
rule, the audit trail, *and* real engineering craft simultaneously. The Trust Center proves
operational maturity; the Q&A widget is now a commodity pattern on B2B docs sites and
proves nothing distinctive. Only the live demo turns the homepage itself into a working
piece of the product.

**Why personalization was rejected:** dynamic, AI-generated copy is impressive in a
generic B2B SaaS context, but it injects *non-determinism* into the one artifact
representing a company whose entire pitch is "nothing is invented." That's the exact
trap the assignment warns against.

Full research writeup: [`idea.md`](idea.md). Phase-by-phase build plan: [`development.md`](development.md).

## 4. The prototype

A visitor picks one of 6 sample cases (MSME loan, insurance claim, KYC verification),
clicks **Run Decision Pipeline**, and watches:

```
Evidence Ingested → Structured Data Extracted → Policy Rule Evaluated → Decision Routed
```

The result shows the decision (**Approve** / **Refer for Review** / **Decline**), an
itemized checklist of the exact conditions the rule checked (✓/✗ each), and the plain-English
reasoning — never a vague AI confidence score. Every run is appended to a permanent, on-page
**Audit Trail** with a timestamp, rule ID/version, and evidence reference, and any entry can
be copied as raw JSON. Running the same evidence twice produces byte-identical output —
provable determinism, not a claim.

### What's real vs. simplified (stated on-page, not hidden)

- The **rule engine is real, deterministic, unit-tested code** — not a scripted animation.
- The **evidence is pre-written sample data**, not a live document-scanning model — this is
  a disclosed simplification, not a hidden one.
- **No backend, no database, no server.** Everything (picker, rule engine, audit log) runs
  entirely client-side in the browser. Nothing is sent anywhere.
- The ~1.5s pacing between pipeline steps is cosmetic, for legibility — GroundSet's real
  claimed latency is <100ms, and the demo doesn't imply otherwise.

## 5. Architecture

```
bpoptima-demo/
├── app/
│   ├── layout.tsx              # root layout, fonts, metadata
│   ├── page.tsx                 # server-rendered shell (hero copy) + client demo
│   └── globals.css              # bpoptima.com's real dark-mode design tokens
├── components/
│   ├── evidence-picker/         # pick a sample scenario
│   ├── processing-timeline/     # 4-stage pipeline visualization
│   ├── decision-card/           # decision + itemized rule checks + reasoning
│   ├── audit-trail-panel/       # accumulating log, copy-as-JSON
│   └── decision-pipeline-demo/  # client orchestrator wiring the above together
├── lib/
│   ├── rules-engine/
│   │   ├── engine.ts            # pure dispatcher: EvidenceItem -> DecisionResult
│   │   ├── rules.ts             # the 3 deterministic policy rules, one per category
│   │   └── engine.test.ts       # unit tests: every branch, boundary conditions, determinism
│   ├── data/sample-evidence.ts  # 6 fixtures, paired to hit every decision branch
│   ├── audit-log.ts             # the one impure function: stamps id + timestamp
│   ├── decision-presentation.ts # category/decision labels, colors, field formatting
│   └── delay.ts                 # tiny promise-based delay for the timeline pacing
└── types/domain.ts               # the shared contract everything else is written against
```

**Key design decision:** `lib/rules-engine` has zero React/Next/UI dependencies and zero
I/O — it's pure logic that could run in a plain Node script. UI components only ever
consume its output; none of them contain decision logic themselves. This is what makes
"deterministic" a provable claim (see the test suite) rather than a description.

## 6. Tech stack

- **Next.js 16** (App Router) + **TypeScript**, strict mode
- **Tailwind CSS v4** — colors, fonts, and spacing pulled from bpoptima.com's own shipped
  CSS (dark-mode tokens), not invented
- **Vitest** — unit tests for the rule engine and audit-log stamping
- **ESLint + Prettier** (with Tailwind class sorting)
- No backend, no database, no external API calls — deploys as a static-capable app

Fonts: bpoptima.com's real stack is Satoshi/General Sans/JetBrains Mono. Satoshi and
General Sans aren't on Google Fonts, and pulling them from a third-party CDN at runtime
would trade away `next/font`'s zero-external-dependency self-hosting — so this uses Inter
and Plus Jakarta Sans as self-hosted equivalents, and JetBrains Mono (an exact match) for
data/code.

## 7. Getting started

```bash
cd bpoptima-demo
npm install
npm run dev       # http://localhost:3000
```

Other scripts:

```bash
npm run test         # run the Vitest suite once
npm run test:watch   # watch mode
npm run typecheck    # tsc --noEmit
npm run lint          # eslint
npm run format        # prettier --write .
npm run build         # production build
```

## 8. Testing

13 tests across two files, all pure/fast (no DOM, no network):

- `lib/rules-engine/engine.test.ts` — happy path for all 3 categories, a threshold-boundary
  test (30% cutoff, on/off by 1), a negative case (high value but under the prior-claims
  threshold still approves), a determinism test (same input called 5x → byte-identical
  output), and a test that every decision carries at least one inspectable, described check.
- `lib/audit-log.test.ts` — two entries from the same result get unique ids, the timestamp
  round-trips as valid ISO, and every field carries through correctly.

Also manually verified in a real browser (not just `next build`): desktop, the 1024px
layout-breakpoint boundary on both sides, mobile, keyboard focus/tab order, and
`prefers-reduced-motion` — using Playwright driven from the terminal, screenshotting and
reading console output at each step.

## 9. Deployment

Deployed to Vercel with the project root set to `bpoptima-demo/`. No environment
variables or backend services required — it's a fully static-capable client app.

## 10. The defense

**Who does this win over?** The Chief Risk Officer, specifically — the audience the
assignment and the real site both name directly. It doesn't just claim "we're
auditable"; it lets a visitor personally trigger a decision and inspect exactly why it
happened.

**What does it sacrifice?** No real backend, no real document-extraction model, no
persistence across browser sessions. Breadth (showing every GroundSet capability) was
traded for depth (one complete, honestly-labeled, inspectable workflow) — stated on the
page itself, because pretending otherwise would contradict BPOptima's own "nothing
invented" pitch.

**What was rejected, and why:**
- *Personalized/generative landing pages* — impressive in generic B2B SaaS, but
  introduces non-determinism into the one artifact representing a deterministic-outcomes
  company. The exact trap the assignment warns against.
- *Grounded Q&A widget* — a legitimate idea, but now a commodity pattern on B2B docs
  sites; weakest differentiation of the three.
- *Trust Center* — a strong idea, kept as a finalist; proves operational maturity over
  time rather than product capability in the moment, and given limited time, demonstrating
  the core product mechanism was judged more valuable.

## 11. Repo map

| File | What it is |
|---|---|
| `README.md` | This file — the whole submission in one place |
| `idea.md` | Full research: ground truth on bpoptima.com today, all 3 ideas, comparison table, rejected idea |
| `development.md` | Phase-by-phase build plan (Phase 0 → 5) with the engineering rationale for each |
| `bpoptima-demo/` | The Next.js prototype itself |
