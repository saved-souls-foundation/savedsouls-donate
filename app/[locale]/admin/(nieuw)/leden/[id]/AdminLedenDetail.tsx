"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import AdminLedenForm from "../AdminLedenForm";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_ERROR = "#7B1010";

type MemberRow = {
  id: string;
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  telefoon: string | null;
  type: string | null;
  bedrijfsnaam: string | null;
  status: string | null;
  lid_sinds: string | null;
  notities: string | null;
};

export default function AdminLedenDetail({ id }: { id: string }) {
  const t = useTranslations("admin.members");
  const tAdmin = useTranslations("admin");
  const noVal = tAdmin("noValue");
  const loadingStr = tAdmin("loading");
  const locale = useLocale();
  const router = useRouter();
  const [member, setMember] = useState<MemberRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/admin/members/${id}`);
      if (cancelled) return;
      if (!res.ok) {
        setMember(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setMember(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  function formatDate(d: string | null) {
    if (!d) return noVal;
    if (locale === "en") {
      const [y, m, day] = d.split("-");
      return `${m}/${day}/${y}`;
    }
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  }

  function statusLabel(s: string | null) {
    if (s === "actief") return t("actief");
    if (s === "inactief") return t("inactief");
    if (s === "verwijderd") return t("verwijderd");
    return s ?? noVal;
  }
  function typeLabel(ty: string | null) {
    if (ty === "persoon") return t("persoon");
    if (ty === "bedrijf") return t("bedrijf");
    return ty ?? noVal;
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast({ type: "success", text: t("deleteSuccess") });
      setTimeout(() => router.push("/admin/leden?deleted=1"), 600);
    } catch {
      setToast({ type: "error", text: t("saveError") });
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Link href="/admin/leden" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          {t("backToList")}
        </Link>
        <p style={{ color: ADM_MUTED }}>{loadingStr}</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-6">
        <Link href="/admin/leden" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          {t("backToList")}
        </Link>
        <p style={{ color: ADM_ERROR }}>{t("noResults")}</p>
      </div>
    );
  }

  if (editing) {
    return (
      <AdminLedenForm
        member={member}
        onSuccess={() => {
          setEditing(false);
          fetch(`/api/admin/members/${id}`)
            .then((r) => r.ok ? r.json() : null)
            .then((data) => data && setMember(data));
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/admin/leden" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
          {t("backToList")}
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: ADM_ACCENT, color: "#fff" }}
          >
            {t("edit")}
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: ADM_ERROR, color: ADM_ERROR }}
          >
            {t("delete")}
          </button>
        </div>
      </div>

      {toast && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: toast.type === "success" ? ADM_ACCENT : ADM_ERROR,
            background: toast.type === "success" ? "rgba(13,148,136,.1)" : "rgba(220,38,38,.1)",
            color: toast.type === "success" ? ADM_ACCENT : ADM_ERROR,
          }}
        >
          {toast.text}
        </div>
      )}

      <div className="rounded-xl border overflow-hidden p-6" style={{ background: ADM_CARD, borderColor: ADM_BORDER }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: ADM_TEXT }}>
          {[member.voornaam, member.achternaam].filter(Boolean).join(" ") || noVal}
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt style={{ color: ADM_MUTED }}>{t("email")}</dt>
            <dd style={{ color: ADM_TEXT }}>{member.email ?? noVal}</dd>
          </div>
          <div>
            <dt style={{ color: ADM_MUTED }}>{t("telefoon")}</dt>
            <dd style={{ color: ADM_TEXT }}>{member.telefoon ?? noVal}</dd>
          </div>
          <div>
            <dt style={{ color: ADM_MUTED }}>{t("type")}</dt>
            <dd style={{ color: ADM_TEXT }}>{typeLabel(member.type)}</dd>
          </div>
          {member.type === "bedrijf" && (
            <div>
              <dt style={{ color: ADM_MUTED }}>{t("bedrijfsnaam")}</dt>
              <dd style={{ color: ADM_TEXT }}>{member.bedrijfsnaam ?? noVal}</dd>
            </div>
          )}
          <div>
            <dt style={{ color: ADM_MUTED }}>{t("status")}</dt>
            <dd style={{ color: ADM_TEXT }}>{statusLabel(member.status)}</dd>
          </div>
          <div>
            <dt style={{ color: ADM_MUTED }}>{t("memberSince")}</dt>
            <dd style={{ color: ADM_TEXT }}>{formatDate(member.lid_sinds)}</dd>
          </div>
        </dl>
        {member.notities && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: ADM_BORDER }}>
            <dt style={{ color: ADM_MUTED }} className="mb-1">{t("notities")}</dt>
            <dd style={{ color: ADM_TEXT }} className="whitespace-pre-wrap">{member.notities}</dd>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.6)" }}
          onClick={() => !deleting && setDeleteConfirm(false)}
        >
          <div
            className="max-w-md w-full rounded-xl border p-6"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm mb-4" style={{ color: ADM_TEXT }}>
              {t("deleteConfirm")}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: ADM_ERROR }}
              >
                {deleting ? loadingStr : t("delete")}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: ADM_BORDER, color: ADM_TEXT }}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
