# Cevolta / Elite Elephant — Instaward vetting

**Audience:** UNBLCK Ops · Chapter Lead · Selection Committee  
**CRM:** Exponential → UNBLCK workspace  
**Date:** 2026-08-24  
**Status:** Pipeline candidate scored; SOW rewritten; Raven MCP OAuth pending on desktop

---

## 1. Records

| Field | Value |
|---|---|
| Builder handle | **Elite Elephant** |
| Legal / SOW name | Santiago Reyes (solo) |
| GitHub | [elitelephant](https://github.com/elitelephant) |
| Project | **Cevolta** |
| Website | https://cevolta.xyz |
| Repo | https://github.com/elitelephant/cevolta |
| Chapter | UNBLCK / Tellus — Santiago, Chile |
| Track | Initial / Fresh Instaward — Testnet MVP |
| Ask | **$3,000** (cut from $3,000–$3,500; proportional, not the $5k cap) |
| Exponential workspace | UNBLCK `cmrcx7ovh0001jr044kkc3kpk` |
| Contact | [Santiago Reyes](https://www.exponential.im/w/unblck/crm/contacts/cmt7v71cd0003l804rfzotecc) (`cmt7v71cd0003l804rfzotecc`) |
| Organization | [Cevolta](https://www.exponential.im/w/unblck/crm/organizations/cmt7v701n0001l80409giv5v6) (`cmt7v701n0001l80409giv5v6`) |
| Knowledge page | [Cevolta Instaward vetting](https://www.exponential.im/w/unblck/pages/cmt7v79un0007l804di16t2xc) (`cmt7v79un0007l804di16t2xc`) |

**Blurb (chapter copy):** Cevolta is a subscription manager that keeps the risk on the store instead of the user. Recurring billing that comes full circle — every cycle another volta — on a Stellar Smart Wallet, so the subscriber does not have to think about it, while keeping control of funds and of every subscription at all times.

---

## 2. Is this a good Instaward?

**Yes — GO for submit path after the rewritten SOW**, with two conditions: (1) week 1 is real Testnet transactions, not mock polish; (2) the SOW names existing Stellar subscription work so SDF tech review does not treat this as an unaware duplicate.

Fits the Operator Guide archetypes: **Web3 startup builder choosing Stellar for the MVP**, plus a fintech-shaped payments problem. Fits the builder deck: clear problem, concrete next step, 30-day commitment, Stellar building blocks (`smart-account-kit`) instead of custom cryptography.

### What is already true (do not fund this as “from scratch”)

Live on 2026-08-24:

- Landing + waitlist at cevolta.xyz (“Recurring payments that live in your wallet”)
- Domain glossary (`CONTEXT.md`): Merchant, Subscriber, Smart Wallet, Policy Signer, Subscription Registry, Renewal Trigger, status machine
- ADR 0001: `smart-account-kit` over `passkey-kit` for Policy Signer primitives
- ADR 0002: atomic `cancel()` through the Registry (one `InvokeHostFunctionOp`)
- Repo language today: **HTML** (site). Created **2026-08-24**. README still says the Soroban contract is “in construcción”

### What is not true yet (this is the sprint)

- No Testnet contract ID
- No Testnet transaction hashes
- “Stellar Testnet” on the landing is a **claim**, not explorer evidence
- No Merchant/Subscriber UI wired to chain

Chapter-lead judgment (your note): a Testnet `create_plan` / `subscribe` should not take two weeks. The original SOW scheduled on-chain work in **week 3** and spent weeks 1–2 on wireframes, mock-demo polish, and merchant interviews. That mixes **Follow-on (customer development)** into an **Initial (Testnet MVP)** award and reads as building from zero on-chain.

The rewritten SOW is in `docs/ops/cevolta-instaward-sow.md`.

---

## 3. Pipeline rubric (max 18)

Scoring key (UNBLCK Instawards pipeline rubric): 0 missing, 1 UNBLCK can close, 2 evidence today. 14–18 GO, 9–13 CONDITIONAL, 0–8 HOLD.

| # | Dimension | Score | Notes |
|---|-----------|------:|-------|
| A | Builder confidence | 2 | Chapter Lead is adding the builder by name (Elite Elephant / Santiago Reyes); not cold Airtable inbound. Confirm weekly contact path before submit. |
| B | Archetype fit | 2 | Web3 MVP on Stellar; recurring payments / Smart Wallet policy. |
| C | Stellar commitment | 2 | Landing, ADRs, and kit choice are Stellar-specific. |
| D | 30-day scope | 2* | *After SOW rewrite. Original mock-first plan scored 1. Week-1 Testnet hashes make the sprint demoable. |
| E | Stellar touch | 2 | Soroban Registry + Policy Signer + SEP-41 USDC. Not a Web2 wrapper. |
| F | Technical footprint | 1 | Public GitHub exists; it is a same-day HTML landing + docs. No contract code in tree yet. UNBLCK: Scaffold Stellar + Discord routing. |
| G | Cadence | 1 | Solo; weekly check-ins not yet proven. Set 15-min recurring check-ins at kickoff (builder deck). |
| H | SOW / budget hygiene | 2* | *After rewrite. $3k maps to contract + interfaces + QA. Discovery is parallel, not the product. No marketing/legal. Original TBD chapter fields and $3–3.5k range were sloppy but not ineligible. |
| I | Closeout path | 2 | Explorer hashes, UI, ≤3 min video — obvious evidence. |

**Total: 16 / 18 — GO — submit path** (SOW polish → **Raven desktop OAuth consult** → Airtable).

No hard stops: relationship is chapter-endorsed, Testnet demo is in scope, Stellar touch is real, budget is eligible.

---

## 4. Stellar Raven consult

Operator Guide: *Consult Stellar Raven early, before the SOW is finalized.* SDF will vet again with Raven / Buzz after Airtable.

**This cloud agent could not complete Raven MCP OAuth.** Raven’s MCP at `https://raven.stellar.org/mcp` returns `401` with `WWW-Authenticate: Bearer realm="OAuth"`. Cursor Cloud has no browser sign-in. Config for desktop is in `.cursor/mcp.json`. On a machine with a browser:

```
# Cursor: first tool call opens OAuth
# Claude Code:
claude mcp add --transport http stellar-raven \
  "https://raven.stellar.org/mcp"
# then /mcp → Authenticate
```

Ask Raven after login (paste the rewritten SOW):

1. Is an Initial Instaward appropriate for a subscriber-side Policy Signer subscription registry on Testnet?
2. Overlap / conflict with **Subs**, **Vowena**, Reflector subscriptions, and hackathon `create_plan` hubs?
3. Does `smart-account-kit` Policy Signer actually enforce amount + recipient + cadence as Cevolta claims, or is that still custom work?
4. Any funding policy issue with a solo 30-day Soroban + two UIs + light custdev mix?

### What we used instead (same catalog Raven wraps)

Stellar Light (`https://stellarlight.xyz/api/projects/search?q=subscription`) + SCF handbook + Operator Guide + builder deck.

**Overlap the SOW must name:**

| Project | Signal | Why it matters |
|---|---|---|
| **Subs** | SCF Build ~$139,480 (round 30). [stellar.subsprotocol.com](https://stellar.subsprotocol.com/) — “SDK to help businesses manage blockchain subscriptions using Stellar's Soroban smart contracts.” | Closest funded analogue. If Cevolta is “merchant subscription SDK,” it will look duplicative. Differentiation = **Policy Signer in the subscriber Smart Wallet**, not a business SDK. |
| **Vowena** | `vowena/sdk` — TypeScript SDK, topics `recurring-payments`, `subscription-billing`, Soroban | Another billing protocol. Cite in the overlap note. |
| **Reflector subscription contract** | `reflector-network/reflector-subscription-contract` | Subscriptions as oracle-feed billing, not consumer checkout. Different job, same word. |
| Hackathon hubs | e.g. `phucth2005/my-soroban-subscription-hub` — `create_plan` / `subscribe` / `auto_renew` / `cancel_subscription` | Same verbs. Reviewers will grep this. Cevolta’s unique claim is **who holds the authorization**. |

**Guide alignment (positive):**

- Initial track = Testnet MVP (Operator Guide funding progression)
- Use existing building blocks (`smart-account-kit`) — Do
- Scope 30-day demoable — Do (after rewrite)
- Budget proportional — Do ($3k)
- User research is an allowable use (builder deck) if it does not replace the Testnet proof
- Evidence: link + hash, video, interview summary — matches deck Section 6

**Guide alignment (original SOW — fixed in rewrite):**

- Don’t scope so broadly it can’t demo on Testnet in 30 days — original week-3 build was the risk
- Don’t skip Raven — still need desktop OAuth before Airtable
- Don’t submit grant-seekers who appeared from nowhere — repo created the same day as the SOW; **landing + ADRs + chapter relationship** are the counter-evidence. Keep that narrative in the endorsement
- Follow-on is customer development (traffic, net-new testnet wallets). Original weeks 1–2 merchant interviews as the *main* work belong on Follow-on, not Initial

---

## 5. Weak spots still to close with the builder

These are leftover even with the rewritten SOW. Use the first weekly check-in (or pre-submit call) to lock them.

1. **Week-1 Testnet is a promise, not a commit in the repo.** No Rust/Soroban crate in `elitelephant/cevolta` yet. Chapter Lead should see a contract PR or Scaffold Stellar init *before* Airtable, or accept that week 1 is the entire on-chain 0→1.
2. **Email / KYC legal name / wallet.** SOW still has no builder email. KYC stalls when legal name ≠ tax form. Get legal name, email, and Stellar address early.
3. **Same-day GitHub.** Created 2026-08-24, pushed through 23:20 UTC. Fine if the chapter already knows Santiago; fatal if the endorsement reads as paper. Record how you know Elite Elephant in the Airtable diligence questions.
4. **Solo load.** Registry + Policy Signer + two UIs + renewal worker + video in 30 days is tight. The rewrite allows a CLI/Scaffold page in week 1 so the chain is not blocked on product design. Do not let “partial interfaces” become mock data again.
5. **Policy Signer claim vs kit reality.** ADR 0001 says kit policies map to amount/recipient/cadence. Confirm with Stellar Discord / Raven whether cadence is a native policy or custom. If custom, shrink week-2 scope rather than slipping Testnet.
6. **Competitive narrative.** Builder must say one sentence in the demo: *Subs helps merchants manage subscriptions; Cevolta puts the spending rule in the subscriber’s wallet.* Without that, tech review will file it under “another subscription contract.”
7. **Passkeys on the landing.** Marketing mentions WebAuthn. Out of scope for this sprint unless it comes for free with the kit. Don’t make passkeys a week-3 surprise.
8. **Waitlist vs Testnet demo.** Landing currently funnels to a waitlist. Day-30 landing must deep-link the Testnet demo or reviewers will think nothing shipped.
9. **Raven OAuth.** Run the four questions in §4 from desktop Cursor/Claude before Airtable. Paste Raven’s answer into the Exponential interaction if it changes scope.

---

## 6. Chapter Lead next actions

1. Send Elite Elephant the rewritten SOW (`docs/ops/cevolta-instaward-sow.md`).
2. 15-minute kickoff: weekly cadence, week-1 hash requirement, legal name + email.
3. Authorize Stellar Raven on desktop; drop overlap Q&A into this page / Exponential note.
4. Airtable submit (Chapter Lead, not the builder).
5. After approval: KYC → test tx → 30-day clock → weekly UNBLCK check-ins → closeout within 10 business days of day 30.
