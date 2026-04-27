import createMollieClient from "@mollie/api-client";

export function getMollieClient() {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    throw new Error("MOLLIE_API_KEY is niet ingesteld");
  }
  return createMollieClient({ apiKey });
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.savedsouls-foundation.org";
}
