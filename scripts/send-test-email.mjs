#!/usr/bin/env node
/**
 * Stuur een testmail via Resend.
 * Gebruik: RESEND_API_KEY=re_xxx node scripts/send-test-email.mjs
 * Of zet RESEND_API_KEY in .env.local en run: node --env-file=.env.local scripts/send-test-email.mjs
 */

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || "Saved Souls Website <info@savedsouls-foundation.org>";
const to = process.env.TEST_EMAIL_TO || "info@savedsouls-foundation.org";

if (!apiKey) {
  console.error("Geen RESEND_API_KEY. Run met: RESEND_API_KEY=re_xxx node scripts/send-test-email.mjs");
  console.error("Of: node --env-file=.env.local scripts/send-test-email.mjs");
  process.exit(1);
}

const resend = new Resend(apiKey);

async function main() {
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: "Testmail Saved Souls – Resend werkt",
    text: "Dit is een testmail vanaf de website. Als je dit ontvangt, werkt de e-mailconfiguratie correct.\n\nJe kunt dit bericht negeren.",
  });

  if (error) {
    console.error("Fout:", error.message);
    process.exit(1);
  }
  console.log("Mail verzonden. Id:", data?.id);
  console.log("Verstuurd naar:", to);
}

main();
