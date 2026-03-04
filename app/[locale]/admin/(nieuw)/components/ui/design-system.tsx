"use client";

/**
 * Admin design system — herbruikbare UI componenten.
 * Alleen Tailwind classes, geen inline styles.
 * Kleuren: primair #2aa348, groen licht #f0fdf4, groen mid #dcfce7, groen donker #166534, groen border #86efac
 */

// Accent kleuren voor StatCard (Tailwind arbitrary)
const STAT_ACCENT: Record<string, string> = {
  green: "border-l-[#2aa348]",
  blue: "border-l-[#3b82f6]",
  orange: "border-l-[#f97316]",
  violet: "border-l-[#8b5cf6]",
  red: "border-l-[#ef4444]",
  amber: "border-l-[#f59e0b]",
};

// ——— StatCard ———
export function StatCard({
  icon,
  label,
  value,
  sub,
  accentColor = "green",
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  sub?: string;
  /** green | blue | orange | violet | red | amber */
  accentColor?: keyof typeof STAT_ACCENT;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 flex border-l-4 ${STAT_ACCENT[accentColor] ?? STAT_ACCENT.green}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
        {sub != null && sub !== "" && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <span className="text-xl flex-shrink-0 ml-2" aria-hidden>
        {icon}
      </span>
    </div>
  );
}

// ——— Avatar (initialen, kleur op eerste letter) ———
const AVATAR_COLORS: Record<string, string> = {
  "A": "bg-blue-500",
  "B": "bg-blue-500",
  "C": "bg-blue-500",
  "D": "bg-blue-500",
  "E": "bg-blue-500",
  "F": "bg-violet-500",
  "G": "bg-violet-500",
  "H": "bg-violet-500",
  "I": "bg-violet-500",
  "J": "bg-violet-500",
  "K": "bg-orange-500",
  "L": "bg-orange-500",
  "M": "bg-orange-500",
  "N": "bg-orange-500",
  "O": "bg-orange-500",
  "P": "bg-[#2aa348]",
  "Q": "bg-[#2aa348]",
  "R": "bg-[#2aa348]",
  "S": "bg-[#2aa348]",
  "T": "bg-[#2aa348]",
  "U": "bg-pink-500",
  "V": "bg-pink-500",
  "W": "bg-pink-500",
  "X": "bg-pink-500",
  "Y": "bg-pink-500",
  "Z": "bg-pink-500",
};

function getAvatarBg(name: string): string {
  const first = (name || "?").trim().toUpperCase().slice(0, 1);
  return AVATAR_COLORS[first] ?? "bg-gray-500";
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initialen = (name || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
  const sizeClass =
    size === "sm" ? "w-6 h-6 text-xs" : size === "lg" ? "w-10 h-10 text-base" : "w-8 h-8 text-sm";
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${sizeClass} ${getAvatarBg(name)}`}
      aria-hidden
    >
      {initialen}
    </div>
  );
}

// ——— StatusBadge ———
const BADGE_STYLES: Record<string, string> = {
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-red-800 border-red-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
  gray: "bg-gray-50 text-gray-800 border-gray-200",
};

export function StatusBadge({
  label,
  type = "gray",
}: {
  label: string;
  type?: "success" | "warning" | "danger" | "info" | "gray";
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${BADGE_STYLES[type] ?? BADGE_STYLES.gray}`}
    >
      {label}
    </span>
  );
}

// ——— QuickActions (zichtbaar bij group-hover op parent rij) ———
export function QuickActions({
  actions,
}: {
  actions: Array<{ icon: string; label: string; onClick: () => void }>;
}) {
  return (
    <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 flex flex-wrap gap-1">
      {actions.map((a, i) => (
        <button
          key={i}
          type="button"
          onClick={a.onClick}
          className="text-xs font-medium text-gray-600 hover:text-[#2aa348] hover:bg-green-50 rounded-md px-2 py-1 transition-colors"
        >
          <span aria-hidden>{a.icon}</span> {a.label}
        </button>
      ))}
    </div>
  );
}

// ——— PageHeader ———
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-[#f0fdf4] to-white px-6 py-5 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{title}</h1>
          {subtitle != null && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions != null && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}

// ——— EmptyState ———
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl mb-4" aria-hidden>
        {icon}
      </p>
      <p className="text-base font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">{description}</p>
      {actionLabel != null && onAction != null && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#2aa348] hover:bg-[#166534] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ——— SectionCard ———
export function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ——— TableWrapper ———
export function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto min-w-0">
      {children}
    </div>
  );
}
