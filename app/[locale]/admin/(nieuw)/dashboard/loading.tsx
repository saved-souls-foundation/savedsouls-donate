const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_MUTED = "#64748b";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: ADM_MUTED }}>
        Overzicht
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-4 h-[100px] animate-pulse"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          />
        ))}
      </div>
      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: ADM_MUTED }}>
        Aandacht vereist
      </div>
      <div
        className="rounded-xl border p-4 h-20 animate-pulse"
        style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
      />
      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: ADM_MUTED }}>
        Laatste activiteit
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="rounded-xl border p-4 h-48 animate-pulse"
          style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        />
        <div
          className="rounded-xl border p-4 h-48 animate-pulse"
          style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        />
      </div>
    </div>
  );
}
