# Hub Check-in digest via fixed UTC cron

Ops wants a once-daily **Hub Check-in digest** early on the hub calendar day. Exact `America/Santiago` midnight would need an hourly (or similar) Vercel Cron plus idempotency keyed to hub-local date, because Vercel schedules in UTC and Chile observes DST. We chose a **single daily Vercel Cron at 04:01 UTC** instead: it always falls on the correct Santiago calendar day (00:01 in standard time, 01:01 under DST), stays simple to operate, and is good enough for v1 staffing awareness. Rejected: timezone-aware hourly job (more correct, more moving parts) and external schedulers.

**Status:** accepted

**Consequences:** Digests must still be **idempotent per hub calendar date** so Vercel cron retries do not double-email Ops.
