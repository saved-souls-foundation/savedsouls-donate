"use client";

import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { AdoptionApplication, VolunteerApplication, SponsorRecord } from "@/app/api/admin/applications/route";

const ACCENT_GREEN = "#2aa348";

const ADOPT_STEPS = ["Aanvraag", "Intro call", "Documenten", "Vlucht", "Aankomst"];
const VOLUNTEER_STEPS = ["Aanmelding", "Documenten", "Bevestiging", "Vertrek"];

type AnimalRecord = {
  id: string;
  name: string;
  thaiName?: string;
  gender: string;
  age?: string;
  size: string;
  detailUrl: string;
  image: string;
  type?: string;
};

type ApplicationsData = {
  adopt: AdoptionApplication[];
  volunteer: VolunteerApplication[];
  sponsor: SponsorRecord[];
  _meta?: { source: string; message?: string };
};

export default function AdminPage() {
  const t = useTranslations("common");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [animals, setAnimals] = useState<{ dogs: AnimalRecord[]; cats: AnimalRecord[] } | null>(null);
  const [applications, setApplications] = useState<ApplicationsData | null>(null);
  const [applicationsTab, setApplicationsTab] = useState<"adopt" | "volunteer" | "sponsor">("adopt");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AnimalRecord | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchApplications = () => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data) => setApplications(data))
      .catch(() => setApplications({ adopt: [], volunteer: [], sponsor: [] }));
  };

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated === true);
        if (data.authenticated) {
          fetch("/api/animals")
            .then((r) => r.json())
            .then((animalsData) => setAnimals({ dogs: animalsData.dogs, cats: animalsData.cats }));
          fetchApplications();
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAuthenticated(true);
        setLoginUsername("");
        setLoginPassword("");
        const [animalsRes] = await Promise.all([
          fetch("/api/animals"),
          fetch("/api/admin/applications").then((r) => r.json()).then(setApplications),
        ]);
        const animalsData = await animalsRes.json();
        setAnimals({ dogs: animalsData.dogs, cats: animalsData.cats });
      } else {
        setLoginError(data.error || t("adminLoginError"));
      }
    } catch {
      setLoginError(t("adminLoginError"));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setAnimals(null);
  };

  const handleSaveImage = async (animal: AnimalRecord) => {
    const imageUrl = editImageUrl.trim();
    if (!animals) return;
    const updated = {
      dogs: animals.dogs.map((d) =>
        d.id === animal.id && d.type === "dog" ? { ...d, image: imageUrl } : d
      ),
      cats: animals.cats.map((c) =>
        c.id === animal.id && c.type === "cat" ? { ...c, image: imageUrl } : c
      ),
    };
    try {
      const res = await fetch("/api/animals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setAnimals(updated);
        setEditing(null);
        setEditImageUrl("");
      }
    } catch {
      alert("Kon niet opslaan. Werkt alleen lokaal – bewerk data/animals.json voor productie.");
    }
  };

  const startEdit = (animal: AnimalRecord) => {
    setEditing(animal);
    setEditImageUrl(animal.image || "");
  };

  if (loading) return <div className="p-8 text-center">Laden...</div>;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-8">
            <h1 className="text-xl font-bold text-center mb-6" style={{ color: ACCENT_GREEN }}>
              {t("adminLogin")}
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t("adminUsername")}
                </label>
                <input
                  id="username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t("adminPassword")}
                </label>
                <input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {loginLoading ? "..." : t("adminLoginButton")}
              </button>
              <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-3">
                {t("adminForgotPassword")}{" "}
                <span className="block mt-1 text-xs">{t("adminForgotPasswordHint")}</span>
                <a
                  href="mailto:info@savedsouls-foundation.org"
                  className="text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  info@savedsouls-foundation.org
                </a>
              </p>
            </form>
          </div>
          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-stone-500 hover:underline">
              ← {t("backToHome")}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <nav className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
        <Link href="/" className="font-bold" style={{ color: ACCENT_GREEN }}>Saved Souls</Link>
        <div className="flex items-center gap-4">
          <Link href="/adopt" className="text-sm text-stone-600 dark:text-stone-400">← Naar adopt</Link>
          <button
            onClick={handleLogout}
            className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
          >
            {t("adminLogout")}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">CMS – Saved Souls Administrator</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
          Dieren beheren en aanvragen overzicht. Bewerk <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">data/animals.json</code> voor meer dieren of velden.
        </p>

        {/* Aanvragen & voortgang */}
        <section className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100" style={{ color: ACCENT_GREEN }}>
              Aanvragen & voortgang
            </h2>
            <button
              type="button"
              onClick={fetchApplications}
              className="text-sm px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Ververs
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            {(["adopt", "volunteer", "sponsor"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setApplicationsTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  applicationsTab === tab
                    ? "text-white"
                    : "text-stone-600 dark:text-stone-400 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600"
                }`}
                style={applicationsTab === tab ? { backgroundColor: ACCENT_GREEN } : {}}
              >
                {tab === "adopt" && `Adoptie (${applications?.adopt?.length ?? 0})`}
                {tab === "volunteer" && `Vrijwilliger (${applications?.volunteer?.length ?? 0})`}
                {tab === "sponsor" && `Sponsor (${applications?.sponsor?.length ?? 0})`}
              </button>
            ))}
          </div>
          {applications?._meta?.source === "none" && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
              Aanvragen komen binnen per e-mail. Configureer Supabase (SUPABASE_SERVICE_ROLE_KEY) en maak de tabellen <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">adoption_applications</code> en <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">volunteer_applications</code> aan om ze hier te tonen. Zie docs/LOGIN-PROGRESS-PLAN.md.
            </p>
          )}
          {applicationsTab === "adopt" && (
            <div className="space-y-3">
              {(applications?.adopt?.length ?? 0) === 0 ? (
                <p className="text-sm text-stone-500 dark:text-stone-400">Geen adoptie-aanvragen.</p>
              ) : (
                applications?.adopt?.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-medium text-stone-800 dark:text-stone-100">{a.name}</span>
                      <span className="text-xs text-stone-500">
                        Stap {a.step}: {ADOPT_STEPS[a.step - 1] ?? a.step}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {a.email} · {a.city}, {a.country}
                      {a.animal_name ? ` · Dier: ${a.animal_name}` : ""}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-500 mt-1 line-clamp-2">{a.about}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(a.created_at).toLocaleDateString("nl-NL", { dateStyle: "medium" })}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
          {applicationsTab === "volunteer" && (
            <div className="space-y-3">
              {(applications?.volunteer?.length ?? 0) === 0 ? (
                <p className="text-sm text-stone-500 dark:text-stone-400">Geen vrijwilliger-aanmeldingen.</p>
              ) : (
                applications?.volunteer?.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-medium text-stone-800 dark:text-stone-100">{v.name}</span>
                      <span className="text-xs text-stone-500">
                        Stap {v.step}: {VOLUNTEER_STEPS[v.step - 1] ?? v.step}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {v.email} · {v.city}, {v.country}
                      {v.dates ? ` · ${v.dates}` : ""}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-500 mt-1 line-clamp-2">{v.motivation}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(v.created_at).toLocaleDateString("nl-NL", { dateStyle: "medium" })}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
          {applicationsTab === "sponsor" && (
            <div className="space-y-3">
              {(applications?.sponsor?.length ?? 0) === 0 ? (
                <p className="text-sm text-stone-500 dark:text-stone-400">Geen sponsor-gegevens.</p>
              ) : (
                applications?.sponsor?.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600 dark:text-stone-400">
                        € {((s.total_amount_cents ?? 0) / 100).toFixed(2)} totaal
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(s.updated_at).toLocaleDateString("nl-NL", { dateStyle: "medium" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>Honden ({animals?.dogs.length ?? 0})</h2>
          <div className="space-y-2">
            {animals?.dogs.map((d) => (
              <div key={d.id} className="flex items-center gap-4 p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="font-medium w-32">{d.name} / {d.thaiName || "–"}</span>
                <span className="text-sm text-stone-500">{d.gender} · {d.age} · {d.size}</span>
                {editing?.id === d.id && editing?.type === "dog" ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Afbeeldings-URL"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleSaveImage(d)}
                    />
                    <button onClick={() => handleSaveImage(d)} className="px-3 py-1.5 rounded text-sm font-medium text-white" style={{ backgroundColor: ACCENT_GREEN }}>Opslaan</button>
                    <button onClick={() => { setEditing(null); setEditImageUrl(""); }} className="text-sm text-stone-500">Annuleren</button>
                  </div>
                ) : (
                  <button onClick={() => startEdit({ ...d, type: "dog" })} className="text-sm" style={{ color: ACCENT_GREEN }}>Afbeelding toevoegen</button>
                )}
                <a href={d.detailUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-400 hover:underline">Detail ↗</a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>Katten ({animals?.cats.length ?? 0})</h2>
          <div className="space-y-2">
            {animals?.cats.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="font-medium w-32">{c.name} / {c.thaiName || "–"}</span>
                <span className="text-sm text-stone-500">{c.gender} · {c.size}</span>
                {editing?.id === c.id && editing?.type === "cat" ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Afbeeldings-URL"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleSaveImage(c)}
                    />
                    <button onClick={() => handleSaveImage(c)} className="px-3 py-1.5 rounded text-sm font-medium text-white" style={{ backgroundColor: ACCENT_GREEN }}>Opslaan</button>
                    <button onClick={() => { setEditing(null); setEditImageUrl(""); }} className="text-sm text-stone-500">Annuleren</button>
                  </div>
                ) : (
                  <button onClick={() => startEdit({ ...c, type: "cat" })} className="text-sm" style={{ color: ACCENT_GREEN }}>Afbeelding toevoegen</button>
                )}
                <a href={c.detailUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-400 hover:underline">Detail ↗</a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
