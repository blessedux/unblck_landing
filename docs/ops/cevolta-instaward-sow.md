# Cevolta Statement of Work (SOW)

## 30-Day Testnet MVP — Stellar Ambassador Instaward (Initial / Fresh)

This is the **chapter-lead-ready** SOW. It replaces the builder’s 2026-08-24 draft, which spent weeks 1–2 on mock data and wireframes before any Testnet transaction. Instawards’ initial track funds a **testnet-demoable MVP**; this sprint starts on-chain and refines from there.

---

## 1. Project & Team Information

| Field | Value |
|---|---|
| Project Name | Cevolta |
| One-line blurb | Non-custodial subscription billing for Stellar Smart Wallets: the pulse of recurring payments, with the risk on the store — not the subscriber. |
| Builder / Team | Santiago Reyes (solo) — builder handle **Elite Elephant** (`elitelephant`) |
| Primary Contact | Santiago Reyes |
| GitHub | https://github.com/elitelephant |
| Project repo | https://github.com/elitelephant/cevolta |
| Website | https://cevolta.xyz |
| Role | Founder / Builder |
| Ambassador Chapter | UNBLCK / Tellus — Santiago, Chile |
| Ambassador Chapter Lead | Joaquin Farfan (UNBLCK) |
| Date Submitted | August 24, 2026 |
| Suggested Sprint Start Date | TBD with Chapter Lead (clock starts on funding date) |
| Duration | 30 days (4-week sprint) |
| Requested Budget | USD $3,000 (XLM equivalent; proportional to a solo Testnet MVP, not the $5,000 cap) |
| Instaward track | **Initial / Fresh — Testnet MVP** (not Follow-on customer development) |

---

## 2. Overview & Intent

### 2.1 Product blurb (use this in Airtable / public copy)

**Cevolta is a subscription manager that keeps the risk on the store instead of the user.**

Recurring crypto payments usually fail in one of two ways: the subscriber grants the merchant an open-ended allowance (exploitable until revoked, and drained if that contract is compromised), or they approve every charge by hand and the “subscription” is just a reminder. Cevolta is billing that comes full circle — the pulse of recurring payments, every cycle another volta — running on a Stellar Smart Wallet so the subscriber does not have to think about it, while still keeping control of funds and of every subscription, at all times.

Authorization lives in the subscriber’s own wallet as a **Policy Signer**: a fixed amount, a fixed recipient, a fixed cadence. The merchant never holds an open allowance. A failed charge is the store’s problem. Cancel is one subscriber-signed action, effective immediately.

### 2.2 Purpose of this Instaward

This Instaward takes a **pre-existing illustrated MVP** (public landing, domain glossary, two architecture decisions, waitlist) and turns it into a **reviewer-verifiable Testnet pilot** in 30 days.

The sprint does **not** start from a blank repo. It also does **not** spend the first half of the month on mock data. Week 1 ships real Testnet transactions. Weeks 2–4 refine the Policy Signer path, the two-sided interfaces, failure handling, and a closeout evidence pack.

Going into the sprint, Cevolta already has:

- Public landing at [cevolta.xyz](https://cevolta.xyz) (waitlist + protocol narrative)
- Domain glossary in [`CONTEXT.md`](https://github.com/elitelephant/cevolta/blob/main/CONTEXT.md)
- ADR 0001 — `smart-account-kit` for Smart Wallet / Policy Signer (Stellar building block, not a hand-rolled account)
- ADR 0002 — atomic `cancel()` through the Subscription Registry
- Public repo: [github.com/elitelephant/cevolta](https://github.com/elitelephant/cevolta)

The gap a reviewer can verify today: **no Soroban contract ID, no Testnet transaction hashes.** That is the 30-day proof point.

### 2.3 Stellar fit (why this is an Instaward, not a generic Web3 grant)

- **Network:** Stellar Testnet, Soroban, SEP-41 / Testnet USDC
- **Building blocks (Operator Guide: do not hand-roll):** OpenZeppelin / `stellar/smart-account-kit` Policy Signers; Scaffold Stellar or equivalent for deploy
- **On-chain object:** Subscription Registry contract + subscriber Smart Wallet policy
- **Demoable closeout:** explorer links for `create_plan` / `subscribe` / `renew` / `cancel`

---

## 3. Problem Statement & Objective

### Problem being addressed

Every common pattern for recurring crypto payments puts the risk on the subscriber. Cevolta’s model inverts that: the authorization rule lives in the subscriber’s Smart Wallet, so a compromised merchant contract cannot spend outside the signed limit, and the subscriber can cancel without the merchant. Today that model exists as a landing page and ADRs. **Without Testnet transactions, it cannot be reviewed as a working Stellar MVP.**

A second problem this SOW must name up front (ecosystem overlap): Stellar already has subscription work — notably **Subs** (SCF Build, ~$139k; SDK for businesses to manage Soroban subscriptions), **Vowena** (subscription-billing SDK), and several hackathon subscription hubs with the same verb set (`create_plan`, `subscribe`, `cancel`). Cevolta is not “subscriptions on Stellar” in the abstract. The 30-day proof is the **subscriber-side Policy Signer** — risk on the store, control always in the wallet — implemented with `smart-account-kit`, not a second merchant-allowance registry.

### Objective

At day 30, a reviewer who has never met the builder can:

1. Open a Testnet explorer link and see `create_plan`, `subscribe`, `renew`, and `cancel` transaction hashes.
2. Use a public Merchant interface to create a plan and a public Subscriber interface to subscribe and cancel against that contract (no mock data in the happy path).
3. Watch a ≤3 minute demo video of that same path, including failed-renewal → `past_due`.
4. Read a one-page note on how Cevolta differs from Subs / merchant-allowance designs, grounded in the deployed Policy Signer behavior.

---

## 4. Scope of Work

### Deliverable 1 (Week 1) — Testnet MVP skeleton

**Build (on-chain first):**

- Subscription Registry contract (Soroban) with `create_plan`, `subscribe`, `renew`, `cancel`, `get_plan`, `get_subscription`
- Deploy to **Stellar Testnet** in week 1 (not week 3)
- At least two real Testnet transactions in week 1: `create_plan` and `subscribe` (even if the UI is still a thin CLI / Scaffold Stellar page)
- Contract interface locked against the existing glossary + ADRs
- Public repo updated so the README links the Testnet contract ID

**Why this matters**

The Initial Instaward is a Testnet MVP. Mock-data polish is not a week-1 deliverable. A reviewer should see hashes before week 2.

### Deliverable 2 (Weeks 2–3) — Policy Signer path + two-sided interfaces

**Build:**

- Smart Wallet + Policy Signer integration via `smart-account-kit` (amount, recipient, cadence)
- Atomic `cancel()` (ADR 0002): Subscriber-signed; Registry status + Policy Signer revoke in one invocation
- Merchant interface **wired to Testnet**: create a plan, list subscribers
- Subscriber interface **wired to Testnet**: browse a plan, subscribe, see status, cancel
- Renewal Trigger: off-chain script calling `renew()` on schedule
- Failed-renewal path: `past_due` → retry → auto-cancel (Testnet-reproducible)
- **In parallel, not as a gate:** 5 structured conversations with Chile-based merchants (coffee / local subscription-style businesses) to validate wording and plan fields — findings may change copy and plan metadata, not delay week-1 deploy

**Why this matters**

This is the product proof: the subscriber authorizes a bounded rule in their own wallet; the merchant never holds an open allowance; cancel is immediate and subscriber-owned.

### Deliverable 3 (Week 4) — Evidence pack & next-step alignment

**Build:**

- End-to-end QA on Testnet (happy path + failed renewal)
- Landing page updated to link **live Testnet demo**, not only the waitlist illustration
- ≤3 minute end-to-end demo video
- Written overlap note vs Subs / allowance models (what the Policy Signer does that a merchant SDK does not)
- Short merchant-conversation summary (what changed in the build)
- Next-step write-up for a **Follow-on Instaward** (customer development: demo volume, testnet wallets, merchant pipeline) — explicitly *not* this sprint

**Why this matters**

Closeout evidence must be visual, testable, and obvious (Instawards builder deck). Chapter Lead can close out within 10 business days of day 30.

---

### Out of scope

To keep a solo 30-day Initial Instaward achievable:

- Mainnet deployment
- Production merchant KYC / live fund movement
- Protocol fee / commission logic
- Multi-currency (Testnet USDC only)
- Full merchant analytics dashboard
- Dispute / chargeback
- Wallet recovery
- Multi-store / multi-cashier
- Paid user acquisition or marketing campaigns
- Rebuilding the landing page from scratch
- Treating merchant interviews as the primary deliverable (that is Follow-on / customer-development track)

---

## 4.2 Deliverable-aligned budget request

**Requested budget: USD $3,000** (XLM at payout-date CF Benchmarks).

Sized to this scope, not the program maximum.

**Operational & core (~80%, ≈ $2,400)**

- Soroban Subscription Registry + Testnet deploy
- `smart-account-kit` Policy Signer integration
- Merchant + Subscriber Testnet interfaces
- QA (including failed-renewal path)
- Demo video + evidence pack
- Light merchant discovery (parallel)

**Technology & operations (~20%, ≈ $600)**

- AI-assisted development tooling for the sprint month
- Hosting for landing + Testnet demo
- Small contingency

No marketing, listing, legal, or incorporation line items.

---

## 5. 30-Day Execution Plan

### Week 1 — On-chain skeleton

- Implement and deploy Subscription Registry to Testnet
- `create_plan` + `subscribe` hashes published in the README
- CLI or Scaffold page sufficient; polished UI is not required this week

**Expected output:** Testnet contract ID + explorer links. Mock demo is retired as the source of truth.

### Week 2 — Policy Signer + subscribe/cancel UX

- Policy Signer install on subscribe
- Atomic cancel
- Subscriber interface connected to Testnet
- Merchant interface: create plan + read subscribers

**Expected output:** A human can subscribe and cancel from the UI against Testnet.

### Week 3 — Renewals, failure path, merchant conversations

- Renewal Trigger script
- `past_due` / auto-cancel path exercised on Testnet
- 5 merchant conversations (notes, anonymized)
- Landing copy updated from those conversations *without* blocking the chain work

**Expected output:** Full lifecycle on Testnet; discovery notes in repo.

### Week 4 — Closeout

- QA, demo video, overlap note, Follow-on alignment
- Evidence uploaded to the Instaward record

**Expected output:** Reviewer-verifiable pilot.

---

## 6. Evidence of Completion

### Deliverable 1

- GitHub repository
- Testnet contract ID + explorer link
- Transaction hashes: `create_plan`, `subscribe`

### Deliverable 2

- Transaction hashes: `renew`, `cancel`, and one failed-renewal / `past_due` path
- Public Merchant and Subscriber URLs (Testnet-connected; no mock happy path)
- Screenshots or Loom of Policy Signer install + cancel

### Deliverable 3

- ≤3 minute demo video
- QA notes
- Overlap note (Cevolta vs Subs / allowance model)
- Anonymized merchant notes
- `CONTEXT.md` + ADRs updated to match what shipped

### Evidence verification checklist

| Deliverable | Evidence Present | Partial | Missing |
|---|---|---|---|
| Week-1 Testnet skeleton (contract ID + hashes) | ☐ | ☐ | ☐ |
| Policy Signer path + Testnet interfaces | ☐ | ☐ | ☐ |
| Closeout pack (video, QA, overlap note) | ☐ | ☐ | ☐ |

---

## 7. Next-step alignment

After this Initial Instaward, Cevolta is positioned for a **Follow-on Instaward (customer development)** — demo feedback, tracked traffic, net-new Testnet wallets interacting with the product — not for mainnet. Mainnet readiness (and any audit path) is a later track. A successful closeout also strengthens a future SCF Build Award conversation; it does not guarantee one.

This sprint’s job is to **prove the Policy Signer model on Testnet**. The next round is what takes it to merchants.
