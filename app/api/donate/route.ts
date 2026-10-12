import { NextResponse } from "next/server";

// Uitgeschakeld (security-audit okt 2026): geen enkele pagina gebruikte deze route meer, maar hij
// verstuurde zonder captcha of limiet mails naar willekeurige adressen en zette AI-auto-replies klaar.
// Doneren loopt via Donorbox, PayPal en bankoverschrijving. De oude code staat in de git-geschiedenis.
// De subroutes /api/donate/mollie en /api/donate/recurring vallen hier niet onder.
export async function POST() {
  return NextResponse.json({ error: "Deze route is uitgeschakeld." }, { status: 410 });
}
