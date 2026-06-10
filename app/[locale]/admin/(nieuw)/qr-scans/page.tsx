import { QrCode } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { createQrAdminClient } from "@/lib/qr-supabase";
import { StatCard } from "../components/ui/design-system";

export const revalidate = 60;

export const metadata = {
  title: "QR Scans | Admin",
  robots: { index: false, follow: false },
};

type QrCodeRow = {
  id: string;
  code: string;
  label: string;
  active: boolean;
};

type ScanRow = {
  scanned_at: string;
  ip_address: string | null;
  qr_codes: { label: string } | { label: string }[] | null;
};

function maskIp(ip: string | null): string {
  if (!ip?.trim()) return "—";
  const parts = ip.trim().split(".");
  if (parts.length >= 3) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.*`;
  }
  return `${ip.slice(0, 12)}…`;
}

function formatScanDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function scanLabel(scan: ScanRow): string {
  const rel = scan.qr_codes;
  if (!rel) return "—";
  if (Array.isArray(rel)) return rel[0]?.label ?? "—";
  return rel.label;
}

export default async function QrScansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let qrCodes: QrCodeRow[] = [];
  let recentScans: ScanRow[] = [];
  const scanCountByCodeId = new Map<string, number>();
  let loadError: string | null = null;

  try {
    const qr = createQrAdminClient();

    const [
      { data: codes, error: codesError },
      { data: allScans, error: allScansError },
      { data: recent, error: recentError },
    ] = await Promise.all([
      qr
        .from("qr_codes")
        .select("id, code, label, active")
        .order("label", { ascending: true }),
      qr.from("qr_scans").select("qr_code_id"),
      qr
        .from("qr_scans")
        .select("scanned_at, ip_address, qr_codes(label)")
        .order("scanned_at", { ascending: false })
        .limit(100),
    ]);

    if (codesError) throw new Error(codesError.message);
    if (allScansError) throw new Error(allScansError.message);
    if (recentError) throw new Error(recentError.message);

    qrCodes = (codes ?? []) as QrCodeRow[];
    recentScans = (recent ?? []) as ScanRow[];

    for (const row of allScans ?? []) {
      const id = row.qr_code_id as string;
      scanCountByCodeId.set(id, (scanCountByCodeId.get(id) ?? 0) + 1);
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Kon QR-data niet laden";
    console.error("[qr-scans]", loadError);
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <header className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#2aa348] shadow-sm"
          aria-hidden
        >
          <QrCode className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Scan Statistieken</h1>
          <p className="text-sm text-gray-500">Vernieuwt elke 60 seconden</p>
        </div>
      </header>

      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {loadError}. Controleer QR_SUPABASE_URL en QR_SUPABASE_SERVICE_ROLE_KEY in .env.local.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {qrCodes.length === 0 && !loadError ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500 sm:col-span-2 lg:col-span-3">
            Geen QR-codes gevonden in het QR Supabase-project.
          </div>
        ) : (
          qrCodes.map((code) => (
            <StatCard
              key={code.id}
              icon="📱"
              label={code.label}
              value={
                <span className="text-3xl font-bold tabular-nums text-[#2aa348]">
                  {scanCountByCodeId.get(code.id) ?? 0}
                </span>
              }
              sub={code.active ? code.code : `${code.code} · inactief`}
              accentColor="green"
            />
          ))
        )}
      </section>

      <hr className="border-gray-200" />

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Recente scans</h2>
          <p className="text-xs text-gray-500 mt-0.5">Laatste 100 scans</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                <th className="px-5 py-3 font-medium">Campagne</th>
                <th className="px-5 py-3 font-medium">Datum &amp; tijd</th>
                <th className="px-5 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-gray-400">
                    Nog geen scans geregistreerd.
                  </td>
                </tr>
              ) : (
                recentScans.map((scan, index) => (
                  <tr
                    key={`${scan.scanned_at}-${index}`}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {scanLabel(scan)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatScanDate(scan.scanned_at)}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">
                      {maskIp(scan.ip_address)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
