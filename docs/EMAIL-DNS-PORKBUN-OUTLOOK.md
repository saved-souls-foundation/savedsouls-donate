# E-mail authenticatie (SPF, DKIM, DMARC, MX) – savedsouls-foundation.com

Dit document beschrijft de **huidige DNS-setup in Porkbun** voor savedsouls-foundation.com. De records zijn handmatig correct ingesteld en worden hier vastgelegd voor referentie en troubleshooting.

---

## Huidige situatie in Porkbun (correct)

| Onderdeel | Type | Host | Waarde / doel |
|-----------|------|------|----------------|
| **SPF** | TXT | `@` (root) | `v=spf1 include:amazonses.com include:_spf.porkbun.com include:resend.com ~all` |
| **DKIM** | TXT | `resend._domainkey` | Geverifieerd via Resend (waarde uit Resend Dashboard) |
| **DMARC** | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@savedsouls-foundation.com` |
| **MX (inbound)** | MX | `@` (root) | `inbound-smtp.eu-west-1.amazonaws.com` – prioriteit **9** |

---

## DMARC: p=none – niet wijzigen

- **Huidige policy:** `p=none` – alleen rapporten, geen actie op mail die DMARC faalt.
- **Belangrijk:** Met `p=quarantine` kwamen mails **niet aan bij Outlook/Hotmail**. **Verander DMARC nooit terug naar `p=quarantine`** (of `p=reject`) zonder expliciete instructie. Alleen `p=none` is getest en stabiel voor deze setup.

---

## Referenties in de codebase

- **Verzenden:** `lib/sendMail.ts` – FROM `info@savedsouls-foundation.com`, Resend API. Domein moet in Resend **Verified** zijn (SPF + DKIM).
- **Troubleshooting:** `docs/EMAIL-RESEND-TROUBLESHOOTING.md` – DMARC, SPF/DKIM-controle, 554-relay, MX.
- **Inbound:** `docs/RESEND-INBOUND-SETUP.md` – webhook, Inbound; `docs/INBOUND-EMAIL-OVERZICHT.md` – flow en DNS-samenvatting.
