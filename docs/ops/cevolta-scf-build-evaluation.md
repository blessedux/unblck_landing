# Cevolta — evaluación SCF Build y sprint de 30 días

**Audience:** UNBLCK Ops · Chapter Lead · Selection Committee  
**Project:** [Cevolta](https://cevolta.xyz) (Elite Elephant / Santiago Reyes)  
**Date:** 2026-08-25  
**Related:** [PR #25](https://github.com/blessedux/unblck_landing/pull/25) (Instaward SOW + vetting)  
**Status:** **No postular a SCF Build ahora.** El sprint de 30 días es el camino correcto hacia una postulación financiable en **SCF #46** (deadline 8 nov 2026).

**English abstract:** Cevolta is a well-framed Stellar idea (payer-side Policy Signer for recurring payments) but it is not SCF Build-ready. The handbook routes this exact profile — solo builder, landing + ADRs, no on-chain evidence, no traction — to Instawards. Open Track is for experienced teams with novel primitives and prior scale; Integration Track requires existing traction plus a listed building-block integration and a final-tranche on-chain metric. Subs already received ~$139k SCF Build for Soroban subscriptions. A 30-day Testnet Instaward that proves the Policy Signer model (not another merchant SDK) is the only honest path to a later Build referral.

---

## 0. Qué se evaluó

El prompt pedía “el deck adjunto”. **El archivo del deck no llegó a este run** (origen mobile; no hay PDF/PPTX en el workspace ni en adjuntos del agente). La evaluación se ancla en materiales públicos y en el SOW ya reescrito:

| Fuente | Qué aporta |
|---|---|
| [cevolta.xyz](https://cevolta.xyz) | Narrativa, waitlist, claim de Testnet sin evidencia on-chain |
| [github.com/elitelephant/cevolta](https://github.com/elitelephant/cevolta) | Landing Next.js + waitlist; `CONTEXT.md`; ADR 0001/0002; **sin crate Soroban** |
| SOW Instaward (`docs/ops/cevolta-instaward-sow.md`, PR #25) | Sprint Testnet-first, ask $3k |
| Vetting Instaward (`docs/ops/cevolta-instaward-vetting.md`) | Rubric 16/18 GO para Instaward, no para Build |
| [SCF Handbook — Build](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award) | Criterios de prescreen, panel, tracks, presupuesto, tranches |
| [SCF Handbook — Instawards](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards/official-rules) | Sprint ≤30 días, $1k–$5k inicial, camino a Build |
| Stellar Light + docs de Subs | Overlap: Subs ~$139,480 (SCF round 30) |

**Raven MCP** (`https://raven.stellar.org/mcp`) sigue en `401` OAuth en Cloud. No se autenticó. El overlap se cruzó con Stellar Light, handbook y el kit público. En desktop, después de OAuth, hay que correr las cuatro preguntas del vetting antes de Airtable / interest form.

---

## 1. Veredicto

| Pregunta | Respuesta |
|---|---|
| ¿Es financiable **hoy** por SCF Build? | **No.** Fallaría prescreen y, si pasara, el panel. |
| ¿Es un mal proyecto? | **No.** Es un buen *Instaward*. La idea (riesgo en el payee, regla en el Smart Wallet del payer) es Stellar-nativa. |
| ¿Qué track de Build usaría *después*? | Primero **Instaward**. Luego, si el sprint prueba diferenciación vs Subs, **Integration Track** ( Freighter / Stellar Wallets Kit + USDC +, si hay LATAM, Koywe/alfredpay). **Open Track solo** si el Policy Signer de cadencia es un primitivo nuevo y hay evidencia de ejecución. |
| ¿Qué financiar ahora? | Instaward Initial **$3,000**, 30 días, Testnet demoable. |
| ¿Cuándo tiene sentido el interest form de Build? | Después del closeout del sprint, con hashes, video y nota de overlap — a tiempo para **SCF #46** (8 nov 2026). **SCF #45 ya cerró** (16 ago 2026). |

El handbook lo dice en texto plano:

- Open Track *“Who this track is not for: Builders without much prior experience… → Better fit for Instawards.”*
- Integration Track *“Teams building net-new applications without existing traction → Better fit for Instawards.”*
- Build *“Apply … to transition your **validated** project from concept to launch.”*

Cevolta hoy es concepto ilustrado, no proyecto validado.

---

## 2. Cómo evalúa SCF Build (lo que el deck no cubre)

El panel **solo mira lo que está en el formulario**. Links externos, Exponential, el deck de UNBLCK y “el chapter lead te lo explica” **no cuentan**. Prescreen filtra:

- Deliverables vagos o sin monto
- Budget inflado / ineligible (marketing, legal, work pasado)
- Falta de arquitectura
- (Integration) métrica final-tranche ausente, trivial o irreal

Panel (criterios oficiales):

1. Elegibilidad del participante  
2. **Product readiness & traction** (usuarios o need validado por alguien con experiencia Stellar, verificable *in-submission*)  
3. Calidad de la submission (completa, técnica, sin follow-ups)  
4. Use case Stellar + arquitectura  
5. **Build readiness** (listos a codear el día 1; arquitectura ya cerrada; tranche 1 no es research)  
6. Stellar relevance (no storage / no sticker)  
7. Plan open-source de contratos  
8. Budget alignment (solo desarrollo de lo integrado a Stellar)  
9. Tres tranches verificables; **#3 = Mainnet** (o métrica on-chain en Integration)  
10. Threat model + monitoring plan en tranche 2  
11. Valor de ecosistema y **diferenciación**

Build paga en 4 cortes: 10% al aceptar, 20% MVP, 30% Testnet, 40% Mainnet. Cada corte tiene **90 días**. Tope $150k XLM; timeline ≤6 meses. Pedir el máximo con un solo builder es una bandera roja.

---

## 3. Scorecard contra el panel (hoy)

Escala: **Fail / Weak / Pass**. Un Fail en traction, readiness o diferenciación basta para no invitar.

| Criterio | Hoy | Por qué |
|---|---|---|
| Traction / PMF | **Fail** | Waitlist + landing. Cero hashes, cero enrollments, cero payees. El README dice “idea validated with a landing page”. Eso no es traction verificable. |
| Submission quality | **Fail** | No hay proposal self-contained: ni arquitectura de contratos, ni budget por tranche, ni threat model, ni video del equipo. El deck de producto no sustituye el formulario. |
| Stellar use case | **Pass (narrativa)** | Recurring USDC en Smart Wallet es un use case real de Stellar. |
| Arquitectura completa | **Weak** | Hay glossary + 2 ADRs. No hay interfaces Rust, IDs, ni diagrama de invocaciones. Handbook: *“technical architecture must already be complete at application time.”* |
| Build readiness | **Fail** | AGENTS.md: *“Soroban contracts are not started.”* Repo del 2026-08-24. Tranche 1 sería diseño, no desarrollo. |
| Stellar relevance | **Weak → Pass condicional** | Si Stellar es el Policy Signer, es core. Si es “subscriptions on a chain”, es superficial y duplica Subs. |
| Open-source plan | **Fail** | No hay contrato que open-sourcear. Hay que declarar LICENSE + repo público en la submission. |
| Budget / tranches | **Fail** | No existe breakdown 10/20/30/40 ni Mainnet en 3–6 meses. Un solo builder no sostiene un Build de 6 meses sin recortar scope. |
| Threat model / monitoring | **Fail** | Requisito de tranche 2. Ausente. |
| Diferenciación | **Weak (el riesgo más caro)** | **Subs** ya cobró ~$139k SCF Build (round 30) por “SDK to help businesses manage blockchain subscriptions using Soroban.” Vowena y hubs de hackathon usan los mismos verbos. Sin la frase *regla en el wallet del payer*, el panel lo archiva como duplicado. |
| Team / Open Track | **Fail para Open** | Open pide track record de haber *shippeado y escalado*. Solo + repo de un día no califica. |
| Integration Track | **Fail hoy** | Exige traction existente + ≥1 bloque de la [Integration List](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/integration-track/integration-list) + métrica on-chain para el 40%. `smart-account-kit` **no está** en esa lista. Freighter / Stellar Wallets Kit / Privy / Koywe sí. |

**Lectura:** Instaward 16/18 (PR #25) y Build panel ~2/11 Pass. No son el mismo instrumento. Confundirlos quema la referral del chapter.

---

## 4. Debilidades (ordenadas por daño a una postulación Build)

### 4.1 Fatales si se postula ahora

**1. No hay producto on-chain.**  
Landing funnea a waitlist. “Built on Stellar / Testnet” es un claim. Un reviewer de Build abre el explorer y no encuentra nada. Prescreen: missing technical details.

**2. Traction = 0, y el handbook no acepta “vamos a validar con el grant”.**  
Build financia el paso *validated → launch*. Instaward financia *early execution*. Postular a Build con waitlist es el error de categoría más común.

**3. Overlap con Subs, mal narrado.**  
Subs: fondos en el wallet del subscriber, el protocolo/regulators disparan el cobro según reglas del *app provider*. Cevolta: la autorización es un Policy Signer *dentro* del Smart Wallet del payer (monto + destinatario + cadencia), el registry no tiene allowance.  
Si el deck habla de “suscripciones en Stellar” en abstracto, **es un duplicado de un proyecto ya premiado**. La diferenciación tiene que ser la primera frase, no un apéndice.

**4. Open Track está cerrado para este perfil.**  
Sin experiencia previa demostrable en Stellar/domain scale, el handbook redirige a Instawards. Forzar Open es perder el voto de comunidad contra equipos con mainnet.

**5. Arquitectura del Policy Signer vs el kit real.**  
ADR 0001 afirma que las policies de `smart-account-kit` “map directly onto amount / recipient / cadence.” En el kit público, `createSpendingLimitParams` es **tope acumulado en una ventana de ledgers** sobre `transfer` (`amount = args[2]`). Eso **no** es “un cobro exacto, a un destinatario exacto, una vez por ciclo.” Cadencia (una renovación por período, no un cap rolling) es trabajo custom. Un panel técnico va a preguntar esto. Si la respuesta es “el kit ya lo hace,” la submission queda como incorrecta.

### 4.2 Altas (hunden panel o referral)

**6. Solo builder vs budget Build.**  
Pedir $50k–$150k con una persona y 6 meses se lee como overscope. Pedir $25k en Integration sin traction tampoco. El tamaño correcto *ahora* es $3k Instaward.

**7. Repo same-day + sin Rust.**  
Creado 2026-08-24. Fine para Instaward con endorsement del chapter. Letal en Build si el referrer no documenta la relación. SDF vetará otra vez con Raven/Buzz.

**8. Inconsistencia de lenguaje.**  
`CONTEXT.md` impone Payee / Payer / Plan / Enrollment / `create_plan`+`enroll`. Landing y SOW hablan de merchant / subscriber / subscribe. Un formulario Build que mezcla glosarios parece AI-slop. Unificar **antes** de cualquier submission pública.

**9. Passkeys en marketing, fuera de scope en el sprint.**  
WebAuthn en copy sin estar en el SOW es un imán de preguntas de seguridad que un solo builder no cierra en 30 días.

**10. Integration List.**  
Aunque el sprint use `smart-account-kit`, **eso no califica Integration Track**. Hay que nombrar un bloque de la lista (p. ej. Stellar Wallets Kit o Freighter para conectar; Koywe/alfredpay si el caso LATAM de arriendo/allowance es real). Budget “mostly integration costs.” Un registry custom + kit no listado se lee como Open, y Open no es para este equipo todavía.

**11. Métrica de tranche 3 (Integration).**  
Habría que comprometer NAV o volumen acumulado atribuible a contract IDs / wallets de la app. Hoy no hay footprint que registrar. Inventar “100 tx en 90 días” sin demo es trivial o gamed; el panel lo baja.

**12. Referral risk para UNBLCK.**  
SCF *relies heavily on referral signals*. Referir un paper project a Build gasta capital político del chapter. Referir un Instaward cerrado con hashes es el uso correcto del programa de referidos.

### 4.3 Medias (arreglables en el sprint)

**13. Sin email / nombre legal / wallet KYC** en el SOW.  
**14. Sin plan de threat model** (STRIDE) ni monitoring (emissions/triggers). Build lo exige en tranche 2; el sprint puede dejar un one-pager.  
**15. Sin LICENSE ni rustfmt/tests** en el repo de protocolo.  
**16. Waitlist vs demo:** el día 30 la landing tiene que deep-linkear Testnet, no el form de email.  
**17. Ausente de Stellar Light / Lumenloop.** No es bloqueo, pero un interest form de un proyecto que el directorio no conoce se apoya 100% en el referrer.  
**18. Renovación off-chain.** El Renewal Trigger es un proceso externo. Build preguntará liveness, quién paga fees, y qué pasa si el trigger desaparece. El sprint debe documentarlo, no esconderlo.

---

## 5. Alinear el sprint de 30 días a una app **financiable** por Stellar

El objetivo del mes **no** es “estar listos para pegarle $150k a Build.” Es producir la evidencia que Build exige *antes* de invitarte: arquitectura cerrada, Testnet usable, diferenciación demostrable, builder que ya ejecutó.

Eso es exactamente el Instaward Initial (reglas: scope ≤30 días, $1k–$5k, chapter-led, KYC, camino explícito a Build). El SOW de PR #25 ya está en esa forma. Esta sección solo lo **reata a SCF #46**.

### 5.1 Norte del día 30 (definition of Build-ready, no de “idea bonita”)

Un reviewer de SDF que no conoce a Elite Elephant debe poder, en 15 minutos:

1. Abrir explorer y ver hashes de `create_plan`, `enroll`/`subscribe`, `renew`, `cancel`.  
2. Usar UI payee + UI payer contra Testnet (happy path **sin mock**).  
3. Ver que el cobro **falla** si se sale de monto/destinatario (o documentar con honestidad qué parte es cap rolling del kit vs cadencia custom).  
4. Ver `past_due` en un failed-renewal.  
5. Leer una página: *Subs = SDK del negocio + regulators; Cevolta = Policy Signer en el wallet del payer.*  
6. Ver LICENSE + contrato en el repo.  
7. Ver un video ≤3 min.

Si eso existe el 30, UNBLCK puede (a) cerrar Instaward y (b) **referir** interest form a #46. Si no existe, no hay referral a Build.

### 5.2 Calendario (reloj = fecha de funding Instaward)

Asumiendo kickoff en la primera quincena de septiembre, el closeout cae fines de sept / octubre — caben ~4–6 semanas de pulido de proposal antes del **8 nov 2026**.

| Semana | Build (lo que el panel va a pedir después) | Sprint (qué se construye) | Evidencia |
|---|---|---|---|
| **1** | Arquitectura ya no es research; hay contract ID | Payment Registry en Testnet. CLI/Scaffold ok. **Prohibido** mock-first. | Contract ID + hashes `create_plan` + `enroll` en README |
| **2** | Stellar relevance demostrable | Policy Signer vía kit. Cancel atómico (ADR 0002). UIs pagadas al Testnet. | Hash `cancel` + screenshot de la rule en el wallet |
| **3** | Traction temprana + honestidad técnica | Renewal Trigger + `past_due`. **Spike escrito:** ¿cadencia nativa o custom? Encoger scope si es custom. 5 conversaciones Chile **en paralelo**, no como gate. | Hash `renew` + nota de 1 página kit vs claim |
| **4** | Submission quality | QA, video, overlap vs Subs, landing → demo, LICENSE, one-pager threat model. **No Mainnet.** | Pack de closeout = anexo del futuro formulario Build |

**Fuera de scope (sigue siéndolo):** Mainnet, fees de protocolo, multi-currency, KYC de comercios, passkeys como feature, marketing pago, dashboard analytics.

### 5.3 Cómo el closeout se copia al formulario Build

No reescribir el producto: **pegar evidencia**.

| Campo Build | De dónde sale el día 30 |
|---|---|
| Technical architecture | ADRs + README con IDs + diagrama de 1 página (Payer Smart Wallet ↔ Registry ↔ USDC) |
| Traction | Waitlist **más** N enrollments Testnet + 5 notas de payees Chile (off-chain ok si son verificables) |
| Team | “Solo builder que desplegó X contratos y Y txs en 30 días” — eso *es* track record |
| Stellar integration | Kit + (para Integration Track) Wallets Kit/Freighter nombrado en la lista |
| Open-source plan | Repo público, LICENSE, contracts/ |
| Tranche 1 (MVP) | Lo que ya está en Testnet — Build no paga por rehacer semana 1 |
| Tranche 2 (Testnet+) | Threat model, monitoring, failed-renewal endurecido, más payees |
| Tranche 3 (Mainnet / métrica) | Launch USDC mainnet **o** umbral modesto de volumen/enrollments atribuible a los IDs |
| Diferenciación | La nota vs Subs, no un slide de “recurring payments” |
| Budget | Solo dev Stellar; proporcional a 1 FTE × 3–4 meses, **no** $150k |
| Referral | Código UNBLCK/Tellus **después** del closeout, no antes |

### 5.4 Track recomendado *después* del sprint

```
Ahora     → Instaward Initial $3k (UNBLCK chapter)
Día 30    → Closeout + Follow-on Instaward solo si hay wallets Testnet net-new
Oct 2026  → Interest form SCF #46
            ├─ Si el diferenciador es “componer kit + Freighter/Wallets Kit + USDC
            │  (+ Koywe si el caso arriendo Chile es real)” → Integration, ask ~$25–50k
            └─ Si el diferenciador es un primitivo de cadencia que el kit no tiene
               y hay ejecución demostrada → Open, ask conservador, market analysis vs Subs
No        → RFP (no es un dev-tool pedido en RFP activo)
No        → Build interest form esta semana
```

Integration es el encaje más limpio **si** hay traction de Testnet y se elige un bloque de la lista. Open exige market analysis, gitbook unificado, video del equipo, y “previously built and scaled similar products.” Eso no se fabrica en un mes.

### 5.5 Lo que el deck debería decir (y lo que no)

Si se reusa el deck para SDF / referrers:

**Sí**

- Problema: allowance abierto vs approve-cada-ciclo.  
- Solución: rule en el Smart Wallet del payer; cancel inmediato.  
- Prueba de 30 días: 4 hashes + 2 UIs + 1 video.  
- Competencia: Subs (merchant SDK / regulators), Vowena, hubs `create_plan`. Una frase de diferencia.  
- Ask: $3k Instaward ahora; Build #46 solo con evidencia.  
- Building block: `smart-account-kit` (y, para Build, un ítem de la Integration List).

**No**

- “El primer protocol de suscripciones en Stellar.”  
- “Pedimos $100k para 6 meses de R&D.”  
- Semanas 1–2 de wireframes y entrevistas como deliverable principal.  
- Passkeys / recovery / multi-store como parte del MVP.  
- Confundir Tellus Hub, UNBLCK Cohort e Instaward del builder.

---

## 6. Acciones (Chapter Lead)

1. **No** mandar interest form de Build esta semana.  
2. Mandar el SOW reescrito (PR #25) a Elite Elephant; fijar check-in semanal 15 min; week-1 hashes innegociables.  
3. KYC data (nombre legal, email, wallet) antes de Airtable.  
4. Raven OAuth en desktop → 4 preguntas del vetting; pegar la respuesta en Exponential.  
5. Unificar glosario landing/SOW/`CONTEXT.md` (Payee/Payer/Plan/Enrollment **o** merchant/subscriber, no ambos).  
6. Pedir un spike de 2 días: spending-limit del kit vs cadencia exacta. Si no mapea, el SOW debe decir “policy custom” y recortar semana 2 — no el claim del ADR.  
7. Después del día 30: decidir Follow-on Instaward vs interest form #46. Referral UNBLCK **solo** con explorer links en la submission.

---

## 7. Fuentes

- [SCF Build Award](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award)  
- [Submission criteria](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/submission-criteria)  
- [Budget & tranches](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/budget-and-deliverable-guidelines)  
- [Open Track](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/open-track)  
- [Integration Track](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/integration-track)  
- [Integration List](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/integration-track/integration-list)  
- [Instawards official rules](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards/official-rules)  
- [Rounds](https://communityfund.stellar.org/awards) — #45 closed 16 Aug 2026; #46 due 8 Nov 2026  
- [Subs (Lumenloop)](https://lumenloop.com/projects/subs) — SCF round 30, ~$139,480  
- [smart-account-kit](https://github.com/stellar/smart-account-kit) — `createSpendingLimitParams(spendingLimit, periodLedgers)`
