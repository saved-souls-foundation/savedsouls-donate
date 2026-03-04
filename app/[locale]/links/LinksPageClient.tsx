"use client";

import { Link } from "@/i18n/navigation";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";

const ACCENT_GREEN = "#2aa348";

type InternalItem = { href: string; label: string };
type ExternalItem = { name: string; url: string };

function InternalLinkSection({ title, items }: { title: string; items: InternalItem[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium underline underline-offset-2 decoration-[#2aa348]/50 hover:decoration-[#2aa348] transition-colors"
            >
              {item.label}
              <span className="text-xs text-stone-500" aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LinkSection({
  title,
  items,
  visitLabel,
}: {
  title: string;
  items: ExternalItem[];
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

const LINKS_NL: ExternalItem[] = [
  { name: "Dierenbescherming", url: "https://www.dierenbescherming.nl" },
  { name: "Dierenzorg Nederland", url: "https://www.dierenzorg.nl" },
  { name: "Stichting AAP", url: "https://www.aap.nl" },
  { name: "IVN Natuureducatie", url: "https://www.ivn.nl" },
  { name: "Wakker Dier", url: "https://www.wakkerdier.nl" },
  { name: "Vogelbescherming Nederland", url: "https://www.vogelbescherming.nl" },
  { name: "Stichting Dierenlot", url: "https://www.dierenlot.nl" },
];

const LINKS_THAILAND: ExternalItem[] = [
  { name: "Soi Dog Foundation", url: "https://www.soidog.org" },
  { name: "Lanta Animal Welfare", url: "https://www.lantaanimalwelfare.com" },
  { name: "SCAD Thailand", url: "https://www.scadthailand.org" },
  { name: "Phuket Animal Welfare Society (PAWS)", url: "https://www.paws-phuket.com" },
  { name: "Project Street Dogs Thailand", url: "https://streetdogsthailand.com" },
  { name: "Elephant Nature Park", url: "https://www.elephantnaturepark.org" },
];

const LINKS_PET_FOOD: ExternalItem[] = [
  { name: "Voedingscentrum – Huisdieren", url: "https://www.voedingscentrum.nl/nl/eten-en-drinken/gezonde-recepten-en-eten/huisdieren.aspx" },
  { name: "Dierenarts.nl – Voeding", url: "https://www.dierenarts.nl" },
  { name: "Royal Canin – Gezondheid", url: "https://www.royalcanin.com" },
];

const LINKS_PET_SHOPS: ExternalItem[] = [
  { name: "Pets Place", url: "https://www.petsplace.nl" },
  { name: "Zooplus Nederland", url: "https://www.zooplus.nl" },
  { name: "Bol.com – Dieren", url: "https://www.bol.com/nl/l/dieren/N/10974/" },
  { name: "Maxi Zoo", url: "https://www.maxizoo.nl" },
];

const LINKS_INFO: ExternalItem[] = [
  { name: "LICG – Landelijk Informatiecentrum Gezelschapsdieren", url: "https://www.licg.nl" },
  { name: "RSPCA – Pet care", url: "https://www.rspca.org.uk/adviceandwelfare/pets" },
  { name: "ASPCA – Pet care tips", url: "https://www.aspca.org/pet-care" },
  { name: "Dierenbescherming – Dierenwelzijn", url: "https://www.dierenbescherming.nl" },
];

const LINKS_INTERNATIONAL: ExternalItem[] = [
  { name: "World Animal Protection", url: "https://www.worldanimalprotection.org" },
  { name: "IFAW – International Fund for Animal Welfare", url: "https://www.ifaw.org" },
  { name: "Humane Society International", url: "https://www.hsi.org" },
  { name: "Four Paws International", url: "https://www.four-paws.org" },
];

export type LinksPageProps = {
  title: string;
  intro: string;
  sectionOurSite: string;
  sectionDonate: string;
  sectionNl: string;
  sectionThailand: string;
  sectionPetFood: string;
  sectionPetShops: string;
  sectionInfo: string;
  sectionInternational: string;
  visitLink: string;
  disclaimer: string;
  internalLinks: InternalItem[];
  donateLinks: InternalItem[];
};

export default function LinksPageClient(props: LinksPageProps) {
  const {
    title,
    intro,
    sectionOurSite,
    sectionDonate,
    sectionNl,
    sectionThailand,
    sectionPetFood,
    sectionPetShops,
    sectionInfo,
    sectionInternational,
    visitLink,
    disclaimer,
    internalLinks,
    donateLinks,
  } = props;

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {title}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            {intro}
          </p>
        </header>

        <div className="rounded-2xl p-6 md:p-8 bg-stone-50 dark:bg-stone-900/50 border-2 border-stone-200 dark:border-stone-600">
          <InternalLinkSection title={sectionOurSite} items={internalLinks} />
          <InternalLinkSection title={sectionDonate} items={donateLinks} />
          <LinkSection title={sectionNl} items={LINKS_NL} visitLabel={visitLink} />
          <LinkSection title={sectionThailand} items={LINKS_THAILAND} visitLabel={visitLink} />
          <LinkSection title={sectionPetFood} items={LINKS_PET_FOOD} visitLabel={visitLink} />
          <LinkSection title={sectionPetShops} items={LINKS_PET_SHOPS} visitLabel={visitLink} />
          <LinkSection title={sectionInfo} items={LINKS_INFO} visitLabel={visitLink} />
          <LinkSection title={sectionInternational} items={LINKS_INTERNATIONAL} visitLabel={visitLink} />
        </div>

        <p className="mt-8 text-sm text-stone-500 dark:text-stone-400 text-center">
          {disclaimer}
        </p>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
