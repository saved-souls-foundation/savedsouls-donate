"use client";

import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const ACCENT_GREEN = "#2aa348";

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

export default function AdminPage() {
  const t = useTranslations("common");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [animals, setAnimals] = useState<{ dogs: AnimalRecord[]; cats: AnimalRecord[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AnimalRecord | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated === true);
        if (data.authenticated) {
          return fetch("/api/animals").then((r) => r.json());
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setAnimals({ dogs: data.dogs, cats: data.cats });
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
        const animalsRes = await fetch("/api/animals");
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
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">CMS – Dieren beheren</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
          Voeg afbeeldings-URLs toe. Bewerk <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">data/animals.json</code> voor meer dieren of velden.
        </p>

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
