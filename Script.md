# 5-Minute Recording Script

How to use this: every plain line is something to say out loud, one sentence at a time.
Lines starting with **[ACTION]** are things to click/do on screen — don't say these out loud.
Pause half a second between lines. Don't rush the demo section — that's the part that has to land.

---

## 0:00–0:15 — Intro

Hi, I'm Darsh.

This is my submission for the BPOptima FDE Trainee assignment.

In the next few minutes I'll cover my research, show you the working prototype, and defend why I built it this way.

---

## 0:15–0:50 — The assignment, in my own words

The brief was simple to state and hard to get right.

AI has changed what a small team can ship on the web.

BPOptima's site hasn't used that yet.

But here's the catch — BPOptima's audience includes a Chief Risk Officer.

Anything impressive but wrong for a risk officer's trust is automatically the wrong answer.

So here's the one idea I built everything around.

The current site tells visitors to trust the system.

My redesign lets them inspect why a decision was made, instead.

For a company selling deterministic, auditable AI — inspection is more persuasive than assertion.

---

## 0:50–1:50 — Research

I looked at three ideas, each with a real example already live on the web.

First — a Trust Center, like Vanta's. A live, public page that proves compliance controls in real time, instead of a static claim.

Second — an interactive "run it yourself" explorer, like Stripe's API docs. You trigger something real and see a real response.

Third — a grounded Q&A widget, like Mintlify's AI Assistant. Answers cited back to real source documents.

I picked the second one — the live interactive demo.

It's the most technically substantive of the three, and it's the only one that proves the mechanism instead of just describing it.

I also want to flag what I rejected — AI-generated, personalized landing pages.

That pattern is common in B2B SaaS.

But it injects non-determinism into a site whose entire pitch is "nothing here is invented."

Impressive in general. Wrong here, specifically.

---

## 1:50–4:00 — Live demo

**[ACTION] Show the homepage.**

Here's what I built — a live simulation of GroundSet's actual decision pipeline.

Evidence goes in, a deterministic rule decides, and everything gets logged.

**[ACTION] Click the "MSME Loan — Retail Kirana Store" card.**

I'll pick this loan application — real-looking data, no prior defaults, revenue and requested amount both visible right on the card.

**[ACTION] Click "Run Decision Pipeline."**

Watch the pipeline run.

Evidence ingested.

Structured data extracted.

Policy rule evaluated.

Decision routed.

**[ACTION] Point at the decision card.**

And here's the result — Approve.

**[ACTION] Point at the "Rule conditions checked" list.**

Look at this part closely — each condition the rule actually checked, shown individually, not folded into one black-box summary.

Not a vague AI confidence score anywhere. The exact rule that fired, and the exact reasoning behind it, in plain English.

**[ACTION] Click "Run Decision Pipeline" again, same evidence still selected.**

Now watch what happens if I run this exact same input again.

**[ACTION] Point at the new Audit Trail entry sitting above the first one.**

Identical decision. Identical reasoning. A new, separate audit entry — because determinism means the same input produces the same output, every single time, not just this once.

**[ACTION] Click the "KYC — Storefront Verification (Mismatch)" card, then "Run Decision Pipeline" again.**

Let's try a completely different case — a KYC mismatch.

**[ACTION] Point at the new result.**

Decline this time, for a completely different, explicitly stated reason.

**[ACTION] Scroll to and point at the Audit Trail panel.**

And every run gets logged here, permanently — timestamp, rule ID, the evidence used, and the outcome.

I can even copy any entry as raw JSON.

**[ACTION] Click "Copy JSON" on one entry.**

That's a real audit artifact, not decorative UI.

Nothing here is AI guessing. It's the same evidence-to-decision-to-audit-trail loop GroundSet runs in production — simplified, and openly sandboxed.

---

## 4:00–4:40 — Defense

Who does this win over? The Chief Risk Officer, specifically.

It doesn't just claim "we're auditable" — it lets you personally trigger a decision and inspect exactly why it happened.

What does it sacrifice? There's no real backend, no real document AI, no persistence across sessions.

I say that directly on the page, because pretending otherwise would contradict BPOptima's own "nothing invented" pitch.

And I already told you what I rejected and why — anything that traded determinism for polish was off the table from the start.

---

## 4:40–5:10 — Close

Here's why I think I'm the right fit for this role.

I didn't default to "add AI because AI is trendy."

I found the one idea that made BPOptima's actual product story more visible, and built it end to end — real tests, real accessibility checks, a real deployed link.

Just as importantly, I can tell you clearly what I chose not to build, and why.

That's the FDE job — judgment under time pressure, not just code.

Thanks for watching. Happy to walk through the code or the reasoning further on a call.
