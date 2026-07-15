# BPOptima — Web Redesign Ideas (Research Output)

FDE Trainee take-home. This file captures the research phase: what AI-era web design
makes possible, and which ideas actually fit BPOptima — a vendor of "sovereign decision
infrastructure for regulated operations" (credit decisions, claims triage, prior auth,
fraud detection) whose entire pitch is **deterministic, auditable, non-invented outcomes**.

> **The one-sentence thesis:** the current site tells visitors to trust the system. This
> redesign lets them inspect why a decision was made instead. For a company selling
> deterministic, auditable AI, inspection is more persuasive than assertion — and that one
> idea is what the research, the prototype, and the rejected ideas below all reinforce.

## Ground truth: what's actually on bpoptima.com today

Verified by fetching the live site (not assumed):

- Positioning: "sovereign decision infrastructure for regulated operations"
- Headline claims: ~99% decision accuracy, <100ms end-to-end latency, zero data leakage
- Flow described: evidence ingestion → SLM/VLM interpretation → policy-driven decision → routing → audit logging
- Model family: Groundset-Logic, Groundset-Vision, Groundset-Motion, Groundset-Audio, Groundset-Speed, Groundset-Sovereign
- Industries: financial services (MSME/micro-lending, storefront verification), healthcare (prior auth, claims triage, credentialing)
- Explicitly named audience: **"institutional risk officers"** and CTOs at regulated institutions
- Design today: text-heavy, static, no interactive elements, no live demos, no videos
- Every trust claim (accuracy %, audit trail, zero-leakage) is **asserted as text**, never demonstrated

**The gap driving every idea below:** the site tells you it's trustworthy. It never lets you verify it.

---

## Idea 1 — Live "Trust Center"

A persistent, public page showing continuous, real(-feeling) proof of controls — not a
one-time compliance paragraph, but a dashboard-style artifact that looks like it updates
as the underlying system operates.

- **Real example:** [Vanta Trust Center](https://www.vanta.com/products/trust-center) (pattern also used by SafeBase/Drata) — security/compliance vendors publish a live public page of real-time evidence of their controls, rather than a static "we are SOC2 compliant" claim.
- **Why it fits:** BPOptima's core promise is "every decision routed with a full audit trail." A Trust Center *performs* that promise instead of stating it — proof of the exact thing they sell.
- **Best for:** Chief Risk Officer — the audience the site itself names, and the least impressed by visual flash, most impressed by verifiable evidence.
- **Cost:** Static/mocked data can look like invented numbers if not framed carefully — riskiest to do sloppily, given the whole pitch is "we don't invent outcomes."

## Idea 2 — Live interactive demo (evidence → rules → decision → audit trail) — SELECTED

Let a visitor pick a sample piece of evidence (mock loan application, mock claim), watch
it get read into structured data, watch a visible deterministic rule evaluate it, and see
the resulting decision plus an audit log entry — live, in the browser, sandboxed data only.

- **Real example:** [Stripe API Explorer / Workbench](https://docs.stripe.com/workbench) — visitors run real requests inline in the docs and see real responses, instead of reading a screenshot or a claim.
- **Why it fits:** This *is* the GroundSet pipeline, performed in miniature, by the visitor's own action. It converts "99% accuracy, deterministic policy layer" from an asserted number into something the visitor personally triggers and inspects.
- **Best for:** CTOs and engineers who want to interrogate the mechanism, not read a stat — but the trust framing (visible rule, visible audit entry, no black box) also lands with a CRO if built carefully.
- **Cost:** Most build effort of the three. Must stay honest about being a simplified simulation, not real ML — over-claiming here would be the exact mistake the whole pitch warns against.

## Idea 3 — Grounded Q&A restricted to BPOptima's own documents, with citations

An AI chat widget that only answers from BPOptima's real docs (compliance posture,
architecture, whitepapers) and cites the source page for every claim.

- **Real example:** [Mintlify AI Assistant](https://www.mintlify.com/blog/introducing-ai-assistant-2025) — answers are grounded in the site's own docs with clickable citations back to source.
- **Why it fits:** Applies GroundSet's own philosophy (grounded, evidenced, auditable answers) recursively to the company's own website — "we practice what we sell."
- **Best for:** A CRO doing self-serve diligence (e.g. "how do you handle model drift," "what's your EU AI Act posture") without waiting on a sales call.
- **Cost:** Least differentiated — this pattern is now a commodity on B2B docs sites, weakest "wow" of the three.

---

## Rejected idea (kept for the defense)

**Dynamic/generative personalized landing pages** (Clay/Mutiny-style: AI rewrites homepage
copy per visitor). Rejected because it injects *non-determinism* into the one artifact
representing a company whose entire pitch is "deterministic, nothing invented." The idea
is impressive in a generic B2B SaaS context and actively wrong here — the exact trap the
assignment warns against ("impressive but wrong for a risk officer's trust = wrong idea").

---

## Decision

| Idea | Impact | Trust fit | Engineering cost | Verdict |
|---|---|---|---|---|
| Trust Center | High | Very High | Medium | Finalist |
| **Interactive Decision Demo** | **Very High** | **High** | **High** | **✅ Selected** |
| Grounded AI Assistant | Medium | Medium | Low | Finalist |
| Personalized Website (generative copy) | High | Low | Medium | Rejected |

Building **Idea 2** (live interactive demo). Reasoning: it's the most technically
substantive of the three (real signal of build skill under time pressure), and its
interactivity serves proof rather than spectacle — a visitor triggers it and inspects the
result themselves, rather than watching something animate at them. It's also the only one
of the four that demonstrates the deterministic rule, the audit trail, *and* real
engineering craft simultaneously — the Trust Center proves operational maturity and the
Q&A widget proves nothing distinctive, but only the live demo turns the homepage itself
into a working piece of the product. See `development.md` for the build plan.
