"use client";

import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

/** Links per sectie – eenvoudig aan te passen in dit bestand */
const LINKS_NL = [
  { name: "Dierenbescherming", url: "https://www.dierenbescherming.nl" },
  { name: "Dierenzorg Nederland", url: "https://www.dierenzorg.nl" },
  { name: "Stichting AAP", url: "https://www.aap.nl" },
  { name: "IVN Natuureducatie", url: "https://www.ivn.nl" },
  { name: "Wakker Dier", url: "https://www.wakkerdier.nl" },
];

const LINKS_THAILAND = [
  { name: "Soi Dog Foundation", url: "https://www.soidog.org" },
  { name: "Lanta Animal Welfare", url: "https://www.lantaanimalwelfare.com" },
  { name: "SCAD Thailand", url: "https://www.scadthailand.org" },
  { name: "Phuket Animal Welfare Society (PAWS)", url: "https://www.paws-phuket.com" },
  { name: "Project Street Dogs Thailand", url: "https://streetdogsthailand.com" },
];

const LINKS_PET_FOOD = [
  { name: "Voedingscentrum – Huisdieren", url: "https://www.voedingscentrum.nl/nl/eten-en-drinken/gezonde-recepten-en-eten/huisdieren.aspx" },
  { name: "Dierenarts.nl – Voeding", url: "https://www.dierenarts.nl" },
];

const LINKS_PET_SHOPS = [
  { name: "Pets Place", url: "https://www.petsplace.nl" },
  { name: "Zooplus Nederland", url: "https://www.zooplus.nl" },
  { name: "Bol.com – Dieren", url: "https://www.bol.com/nl/l/dieren/N/10974/" },
];

function LinkSection({
  title,
  items,
  visitLabel,
}: {
  title: string;
  items: { name: string; url: string }[];
  visitLabel: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium underline underline-offset-2 decoration-[#2aa348]/50 hover:decoration-[#2aa348] transition-colors"
            >
              {item.name}
              <span className="text-xs text-stone-500" aria-hidden>{visitLabel}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LinksPage() {
  const t = useTranslations("links");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            {t("intro")}
          </p>
        </header>

        <div className="rounded-2xl p-6 md:p-8 bg-stone-50 dark:bg-stone-900/50 border-2 border-stone-200 dark:border-stone-600">
          <LinkSection title={t("sectionNl")} items={LINKS_NL} visitLabel={t("visitLink")} />
          <LinkSection title={t("sectionThailand")} items={LINKS_THAILAND} visitLabel={t("visitLink")} />
          <LinkSection title={t("sectionPetFood")} items={LINKS_PET_FOOD} visitLabel={t("visitLink")} />
          <LinkSection title={t("sectionPetShops")} items={LINKS_PET_SHOPS} visitLabel={t("visitLink")} />
        </div>

        <p className="mt-8 text-sm text-stone-500 dark:text-stone-400 text-center">
          {t("disclaimer")}
        </p>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
