# Flechandes — evaluación SCF Build y sprint de 30 días

**Audience:** UNBLCK Ops · Chapter Lead · founder (Luis Roko Arraez)  
**Project:** Flechandes — marketplace LogTech de fletes, mudanzas y despachos en Santiago  
**Deck:** *Flechandes - Pitch* (12 slides, CEO Luis Roko Arraez)  
**Date:** 2026-08-25  
**Status:** **No postular a SCF Build con este deck.** No es un proyecto Stellar. El ask es, casi entero, gasto ineligible. Un sprint de 30 días puede convertir el piloto off-chain en una app de settlement en USDC y, recién ahí, en un Instaward / Integration Track para **SCF #46** (8 nov 2026).

**English abstract:** Flechandes is an urban freight marketplace pitch for Santiago with a July 2026 pilot (17 jobs, ~CLP 1M). It has zero Stellar architecture. The investment slide funds B2B acquisition, AI servers, and driver recruiting — all disallowed SCF Build costs. Handbook: Stellar must improve core features, not sit as a badge; budget may only cover Stellar-integrated development. Path: 30-day Instaward that makes one job type settle through Trustless Work escrow + USDC (and a listed Chile ramp if CLP in/out is required), then an Integration Track interest form for SCF #46.

---

## 0. Qué se evaluó

| Fuente | Uso |
|---|---|
| Deck de 12 slides (adjunto) | Problema, producto, piloto, ask |
| [SCF Build handbook](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award) | Prescreen, panel, budget, tracks |
| [Integration List](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/integration-track/integration-list) | Trustless Work, Koywe, alfredpay, Stellar Wallets Kit |
| [Instawards rules](https://stellar.gitbook.io/scf-handbook/scf-awards/instawards/official-rules) | Sprint ≤30 días, $1k–$5k |
| Perfil público del founder (LinkedIn / Devpost) | UX/BA; interés Web3 (ChileDAO, Floracore en Polkadot). No hay rastro público de un repo/app Flechandes |

**Raven MCP** (`https://raven.stellar.org/mcp`) no se autenticó en este entorno (OAuth de browser). El overlap de ecosistema se cruzó con handbook + Integration List + Trustless Work. En desktop: autenticar y preguntar “logistics / last-mile marketplace on Stellar” antes de Airtable.

**SCF calendar:** #45 cerró 16 ago 2026. #46 cierra **8 nov 2026**.

---

## 1. Veredicto en una frase

Flechandes puede ser un negocio real de fletes en Santiago. **No es, hoy, un proyecto SCF.** Pegar “built on Stellar” al deck actual no lo hace financiable; el panel lo clasifica como Web2 con sticker.

| Pregunta | Respuesta |
|---|---|
| ¿Postular SCF Build esta semana? | **No.** Fallaría prescreen (sin arquitectura Stellar, budget ineligible). |
| ¿El piloto cuenta como traction? | **Sí, como traction off-chain**, si se adjunta evidencia verificable (17 servicios, no un slide). Build acepta traction off-chain. No alcanza sin use case Stellar. |
| ¿Open Track? | **No.** No hay primitivo nuevo de red. El handbook redirige equipos sin track record Stellar a Instawards. |
| ¿Integration Track? | **El único track Build plausible *después* del sprint**, si Stellar es el riel de cobro/pago (escrow USDC + wallet + ramp Chile). Hoy: Fail (cero integración, cero métrica on-chain). |
| ¿Qué financiar ahora? | Instaward $3k–$5k / 30 días: **un flujo de flete que liquida en Testnet**. |
| ¿El ask del deck es compatible? | **No.** Adquisición B2B, servidores de IA y reclutamiento de flota son marketing/ops. SCF los rechaza (salvo user-testing estrecho en Integration, y nunca paid acquisition). |

---

## 2. Qué dice el deck (y qué falta)

### Lo que está

- **Problema:** viajes muertos, cotización lenta, precios de regateo. Creíble en micro-logística urbana.
- **Solución:** marketplace de 3 lados (cliente, transportista, peoneta) + “motor IA” de tarifa instantánea.
- **Producto:** PWA, cotización por QR/link, sin app store.
- **Modelo:** comisión por match + fee de cancelación.
- **Piloto julio 2026:** −37% costo cliente vs tradicional; 17 servicios sin incidencias; +232% rentabilidad/hora del transportista; CAC CLP 3.755; ~CLP 1M revenue.
- **Ask:** `$20.000.00 CLP` para adquisición B2B, infra IA, 5 comunas.

### Lo que un reviewer SCF busca y no aparece en 12 slides

| Requisito Build | En el deck |
|---|---|
| Use case Stellar | **Ausente.** Ni la palabra Stellar, USDC, wallet, Soroban. |
| Cómo se integra Stellar / arquitectura | Ausente |
| Código, repo, PWA URL, Testnet | Ausente |
| Team de desarrollo Stellar | Solo CEO. Perfil público: UX / business analyst, no Soroban. |
| Budget mapeado a deliverables Stellar | Ask de growth + servers |
| Tres tranches, Mainnet, threat model | Ausente |
| Competidores nombrados | Slide genérico (“corporativos rígidos vs mercado negro”) |
| Diferenciación vs otros marketplaces Stellar (escrow) | Ausente |
| Open-source de contratos | N/A — no hay contratos |

El panel **no abre el PDF**. “No external materials are considered.” Aunque UNBLCK adjunte el deck, el formulario tiene que ser self-contained. Hoy no hay nada que pegar en “Stellar use case”.

---

## 3. Scorecard contra el panel (hoy)

Escala: Fail / Weak / Pass. Un Fail en Stellar relevance o budget mata la invitation.

| Criterio | Hoy | Nota |
|---|---|---|
| Traction / PMF | **Weak → Pass condicional** | 17 jobs y ~CLP 1M es un piloto, no “significant traction”. SCF *permite* off-chain si es verificable. Sin facturas, rutas, o captura de la PWA, el slide es marketing. n=17 no sostiene −37% / +232%. |
| Submission quality | **Fail** | Ask mal formateado (`$20.000.00 CLP`: ¿20 mil pesos ~USD 21, 20 millones, o USD 20k?). Sin arquitectura, sin repo, sin nombres de competidores. |
| Stellar use case | **Fail** | No existe. |
| Arquitectura | **Fail** | “PWA + motor IA” no es un outline de sistema. No hay diagramas de match, pago, disputa, custodia. |
| Build readiness | **Fail** | No hay dev Stellar nombrado. Handbook: *ready to begin development as soon as awarded* y *developers with relevant tools*. Un CEO UX no cubre Soroban. |
| Stellar relevance | **Fail** | El core es matching + tarifa + flota. El riel de pago ni se menciona. Pegar un wallet después es el caso de libro de “superficial integration”. |
| Open-source plan | **N/A / Fail si hay contratos custom** | Si el sprint usa Trustless Work, no hace falta un contrato propio. Si se escribe uno, hay que open-sourcearlo. |
| Budget alignment | **Fail** | 01 adquisición B2B = marketing. 02 servidores IA = no es componente Stellar. 03 reclutar transportistas = ops. **0% del ask es eligible.** |
| Tranches + threat model | **Fail** | No hay. |
| Diferenciación ecosistema | **Fail** | No hay tesis Stellar. OfferHub / ArcusX ya usan escrow Trustless Work para marketplaces. |

---

## 4. Debilidades (las que importan para SCF, no para un ángel CLP)

### 4.1 Fatales para Build *con este deck*

**1. Stellar no está en el producto.**  
Criterio explícito: *Stellar must be used to meaningfully improve core features, not as a superficial integration, or for data storage.* El core del deck es CPK, densidad comunal y tarifa IA. Un reviewer pregunta: “¿qué deja de funcionar si apago Stellar?” Hoy: nada.

**2. El 100% del ask es gasto prohibido.**  
Budget DONT’s: marketing y user acquisition; no reembolsar ops general. Integration permite hasta 1/3 en *user testing* estrecho (demos, no paid acquisition). “Escalar adquisición B2B” es exactamente lo prohibido.

**3. No hay arquitectura ni código que revisar.**  
Prescreen: *missing technical details or architecture.* Tranche 1 no puede ser “diseñar el sistema”.

**4. Track mismatch.**  
- Open: para primitivos nuevos y equipos con scale. Un marketplace de fletes no es un protocolo.  
- Integration: pide traction **y** ≥1 bloque de la lista **y** métrica on-chain (NAV o volumen) para el 40%.  
- RFP: no aplica.  
El handbook, para apps net-new sin traction on-chain: **Instawards**.

### 4.2 Altas (hunden panel o el piloto)

**5. El piloto no resiste due diligence.**  
17 servicios, “sin incidencias”, −37% y +232% en el mismo n. Sin metodología (¿vs qué tarifa tradicional? ¿horas reales vs WhatsApp?). Revenue ~CLP 1M ⇒ ~CLP 59k por servicio. CAC CLP 3.755 “casi irrelevante” huele a red de conocidos, no a canal repetible. SCF pide traction *verifiable in-submission*: planilla, hashes de pago (cuando existan), o testimonios con contacto.

**6. ¿Marketplace o flota propia?**  
La slide de ventaja cita camionetas ZNA Rich y JMC Carrying 3/4 “operando”. Eso suena a flota controlada, no a red de oferta fragmentada. Si el match es interno, el “marketplace de 3 lados” es un operador con app. Build pregunta liquidez de dos lados; un reviewer de Integration Track lo va a notar.

**7. Motor IA con 17 datos.**  
No hay modelo, features, ni error vs tarifa humana. En 30 días **no** se “robustecen servidores de IA”. Una tarifa determinística (km × peso × acceso + fee) es suficiente y más honesta para un Instaward.

**8. Team.**  
Founder público: UX, discovery, Figma, interés ChileDAO/tokenización. Hackathon Floracore fue **Polkadot**, no Stellar. Build readiness exige alguien que haya tocado Soroban / SDKs de la Integration List. UNBLCK puede ser ese pairing, pero hay que nombrarlo en la submission.

**9. Competencia vacía.**  
En Santiago existen Uber, PedidosYa/Cornershop, Cabify, flotas WhatsApp, y operadores B2B. Un market analysis (requisito Open; buena práctica en Integration) tiene que nombrarlos y decir por qué el escrow USDC es la cuña, no “espacio vacío”.

**10. Fee de cancelación y comisión “automáticos”.**  
Sin custodia ni escrow, “cobro automático” es un cargo de tarjeta/transferencia que el deck no describe. Ese hueco **es** el use case Stellar: si el dinero no se traba al match, el fee es un PDF.

**11. Typo del ask.**  
`$20.000.00 CLP` en un formulario Build es prescreen de “vague budget”. Hay que escribir USD (XLM al CF Benchmarks) y líneas de ingeniería.

**12. Referral risk.**  
SCF se apoya en referrers. Mandar este PDF como Build gasta a UNBLCK. Mandar un Instaward con 10 escrows Testnet reales es el uso correcto.

### 4.3 Medias (el sprint las puede cerrar)

**13.** PWA “fricción cero” vs wallet USDC: hay que diseñar on-ramp (Koywe/alfredpay) o el cliente paga en CLP y **Flechandes** (o un treasury) fondea el escrow — eso hay que declararlo (custodia / cumplimiento Chile).  
**14.** Peoneta como tercer lado: recortar del MVP. Un 3-sided marketplace en 30 días no cierra.  
**15.** QR en punto de venta: útil; que el QR cree el escrow, no solo un formulario.  
**16.** Sin dominio / repo / marca pública “Flechandes” indexada. Un interest form de un nombre que Stellar Light no conoce depende 100% del chapter.

---

## 5. Cómo Stellar *sí* entra al core (tesis financiable)

El problema de fletes que el deck ya nombra — no-show, cotización, plata que no se mueve hasta que hay confianza — es un problema de **settlement**, no de un modelo de precios.

| Dolor del deck | Qué hace Stellar (no un badge) |
|---|---|
| Cliente no quiere pagar 100% up-front al fletero informal | Escrow USDC (Trustless Work, en la Integration List; docs dicen que se integra en &lt;2 semanas / &lt;1 día con skills) |
| Transportista no quiere moverse sin garantía | Fondos locked al aceptar el job; release al confirmar entrega (QR + geofence) |
| Comisión y fee de cancelación “automáticos” | Split on-chain: payee + platform fee + cancellation penalty |
| Precios sin trazabilidad | El match queda como tx + memo / escrow id, no como WhatsApp |
| CPK / viajes muertos | **Fuera de SCF.** Ruteo IA no se financia. Puede vivir off-chain. |

Si apagar Stellar rompe el cobro, la disputa y el fee, **pasa** “Stellar relevance”. Si apagar Stellar deja la PWA igual y los pagos siguen por transferencia, **falla**.

Track futuro (post-sprint): **Integration**, no Open.

Bloques de la lista que calzan:

1. **Trustless Work** — escrow del job (obligatorio para el pitch).  
2. **Stellar Wallets Kit o Freighter** — conectar payer/driver.  
3. **Koywe o alfredpay** — CLP ↔ USDC en Chile (solo si el piloto real no puede vivir 30 días en USDC Testnet).  
4. Privy — si quieren email-wallet; ya está en la lista y UNBLCK lo usa.

Métrica de tranche 3 (cuando haya Build): no “usuarios”; **volumen USDC settled** o **N escrows completed** atribuible a los contract/escrow IDs registrados. Umbral modesto (p. ej. 50 jobs / USD 5k settled en 90 días), no +232%.

Ask Build *después*: **USD 25k–50k** (Integration “small/medium”), casi todo a integrar escrow + wallets + ramp + PWA de job, **cero** línea de ads B2B. Timeline 3–4 meses, Mainnet en tranche 3.

---

## 6. Sprint de 30 días — app funcional y financiable

Objetivo: un reviewer de SDF abre un URL, crea un flete de prueba en **una comuna**, ve un escrow Testnet, confirma entrega, ve el split al wallet del transportista. Eso es un Instaward Initial ($3k–$5k), no un Build.

**Recortar hasta que quepa en un mes, un founder + un dev Stellar (UNBLCK pairing si hace falta):**

- Una comuna, un tipo de job (despacho express **o** mudanza chica — no ambos).  
- Dos lados: cliente y transportista. Peoneta out.  
- Tarifa = regla (km + peso + acceso), no “robustecer IA”.  
- Pago = Trustless Work + Testnet USDC. CLP on-ramp opcional semana 4, no semana 1.  
- Flota: 3–5 drivers del piloto de julio, no reclutar 5 comunas.

### Semana 1 — Settlement skeleton

- Repo público + PWA mínima (un form: origen, destino, peso).  
- Escrow Testnet: crear, fondear, consultar estado.  
- README con escrow IDs / hashes.  
**Evidencia:** 2 txs de create+fund. El mock de tarifa puede ser una tabla.

### Semana 2 — Match + wallets

- Transportista acepta job → escrow queda locked a su address.  
- Wallets Kit o Freighter en cliente y driver.  
- Comisión de plataforma como split rule del escrow (aunque sea 0% en Testnet, el campo existe).  
**Evidencia:** un job end-to-end en video de 60s.

### Semana 3 — Entrega y cancelación (el core del deck)

- Confirmación de entrega: QR o check-in geocercado (el hub UNBLCK ya tiene patrón GPS+QR en el tour).  
- Release de fondos al driver.  
- Cancelación: penalty on-chain o estado `cancelled` + hash.  
- 5 jobs reales del piloto **rehearsed** en Testnet (mismos drivers, plata de prueba).  
**Evidencia:** 5 escrow completes + 1 cancel path.

### Semana 4 — Closeout financiable

- Landing que abre el demo, no solo el pitch.  
- Video ≤3 min.  
- One-pager: “por qué Stellar (escrow) vs transferencia; vs OfferHub/ArcusX (vertical fletes Santiago + piloto off-chain)”.  
- Threat model de una página (fondos locked, quién firma el release, qué pasa si el GPS miente).  
- Interest form **no** se manda todavía; pack listo para Instaward closeout y, en octubre, #46.

**Fuera de scope (si entra, el sprint muere):** motor IA, 5 comunas, peonetas, ads B2B, contratos Soroban custom, Mainnet con plata real de clientes, token.

### Cómo el día 30 se copia al formulario Build (#46)

| Campo Build | Sale de |
|---|---|
| Traction | 17 jobs julio (off-chain, con planilla) **+** N escrows Testnet |
| Arquitectura | Diagrama PWA → Wallets Kit → Trustless Work → USDC |
| Team | CEO + dev que commiteó el sprint (nombrar GitHub) |
| Stellar relevance | “Sin escrow el match no cobra” |
| Integration | Trustless Work + Wallets Kit (+ Koywe si hay CLP) |
| Tranche 1 | Lo ya testeado en Testnet |
| Tranche 2 | Threat model, monitoring, más comunas técnicas (no ads) |
| Tranche 3 | Mainnet + umbral de volumen settled |
| Budget | Horas de ingeniería de integración, no CAC |
| Referral | UNBLCK **después** del closeout |

---

## 7. Qué cambiaría en el deck si se reusa para SDF

**Quitar**

- Ask de adquisición / servidores IA / reclutamiento.  
- “Espacio vacío” sin nombres.  
- +232% / −37% como prueba de scale (mover a apéndice con n=17 y método).  
- `$20.000.00 CLP`.

**Poner en la slide 1**

> Marketplace de fletes en Santiago que **traba el pago en USDC al match y lo suelta al confirmar entrega**, para que el fletero informal no tenga que fiarse del WhatsApp.

**Poner en inversión**

> Instaward USD 3–5k / 30 días: PWA + escrow Testnet. Luego Integration Build USD 25–50k: Mainnet, ramp CLP, fee on-chain. Cero paid ads.

---

## 8. Acciones (Chapter Lead)

1. **No** interest form de Build con este PDF.  
2. Sesión de 45 min con Luis: ¿el piloto fue flota propia o red? ¿Hay PWA/repo? ¿Hay un dev? Sin eso no hay Instaward.  
3. Si hay dev (o pairing UNBLCK): SOW de 30 días según §6, ask $3–5k, chapter UNBLCK/Tellus.  
4. Pedir evidencia del piloto (planilla de 17, no el slide).  
5. Desktop Raven: overlap marketplaces/escrow.  
6. Octubre: solo con hashes de escrow, interest form #46 Integration + código de referido UNBLCK.

---

## 9. Fuentes

- Deck *Flechandes - Pitch* (12 slides)  
- [Submission criteria](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/submission-criteria)  
- [Budget DONT’s](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/budget-and-deliverable-guidelines)  
- [Open Track](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/open-track)  
- [Integration Track](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/integration-track)  
- [Trustless Work × Integration List](https://www.trustlesswork.com/escrow-times/news-scf-integration-track)  
- [Rounds](https://communityfund.stellar.org/awards) — #46 due 8 Nov 2026
