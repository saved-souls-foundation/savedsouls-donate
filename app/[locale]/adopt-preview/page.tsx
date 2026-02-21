"use client";

import { Link } from "@/i18n/navigation";

const ACCENT_GREEN = "#2aa348";

/**
 * Preview pagina: nieuw ontwerp voor adoptie-foto's.
 * Bekijk dit voorbeeld voordat het op de echte adopt-pagina wordt toegepast.
 *
 * Wijzigingen:
 * - object-contain i.p.v. object-cover → volledig dier zichtbaar, geen afgesneden hoofd
 * - Sterkere overlay met naam in de foto
 * - Aspect ratio 1:1 (vierkant) → betere framing voor portretfoto's
 */
export default function AdoptPreviewPage() {
  const sampleDog = {
    name: "Luna",
    thaiName: "ลูน่า",
    type: "dog" as const,
    gender: "female" as const,
    image: "/animals/dog-328.jpg",
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <h1 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">
            🎨 Preview: nieuw ontwerp adoptie-kaarten
          </h1>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Dit is een voorbeeld. Vergelijk met de echte adopt-pagina. Geef feedback voordat we alles aanpassen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Variant A: Vierkant + object-contain + overlay met naam */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Variant A – Vierkant, volledig zichtbaar</p>
            <article className="relative overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-800 shadow-xl border border-stone-200 dark:border-stone-700 group">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={sampleDog.image}
                  alt={`${sampleDog.name} – preview`}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent"
                  aria-hidden
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-lg font-bold text-white drop-shadow-lg" style={{ color: "#fff" }}>
                    {sampleDog.name}
                  </h2>
                  {sampleDog.thaiName && (
                    <p className="text-sm text-white/90 font-medium">{sampleDog.thaiName}</p>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Variant B: 3/4 portret + object-top (hoofd prioriteit) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Variant B – Portret, hoofd bovenaan</p>
            <article className="relative overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-800 shadow-xl border border-stone-200 dark:border-stone-700 group">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={sampleDog.image}
                  alt={`${sampleDog.name} – preview`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-transparent to-stone-900/20"
                  aria-hidden
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-lg font-bold text-white drop-shadow-md">{sampleDog.name}</h2>
                  {sampleDog.thaiName && (
                    <p className="text-sm text-white/90">{sampleDog.thaiName}</p>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Variant C: 4/3 met object-contain + zachte vignette */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Variant C – Origineel formaat, contain</p>
            <article className="relative overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-800 shadow-xl border border-stone-200 dark:border-stone-700 group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={sampleDog.image}
                  alt={`${sampleDog.name} – preview`}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_rgba(0,0,0,0.3)]" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-lg font-bold text-white drop-shadow-lg">{sampleDog.name}</h2>
                  {sampleDog.thaiName && (
                    <p className="text-sm text-white/90">{sampleDog.thaiName}</p>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-10 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 text-sm text-stone-600 dark:text-stone-400">
          <p className="font-medium mb-2">Wat is er aangepast?</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>object-contain</strong> of <strong>object-top</strong> → hoofd wordt niet meer afgesneden</li>
            <li><strong>Overlay</strong> met gradient + naam in de foto</li>
            <li>Optioneel: vierkant (1:1) of portret (3:4) voor betere framing</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
