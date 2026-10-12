import { Link } from "@/i18n/navigation";
import { mapsSearchUrl, type PartnerEntry } from "@/lib/partners";

const PINK = "#ec4899";
const PRIMARY = "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-md hover:scale-105 transition-transform";
const SECONDARY = "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-stone-700 dark:text-stone-200 border-2 border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors";

/** Knoppen van een poster-partner: website, Google Maps, bellen en (optioneel) de eigen partnerpagina. */
export default function PartnerActions({
  partner,
  visitWebsite,
  viewOnMaps,
  callLabel,
  readMore,
}: {
  partner: PartnerEntry;
  visitWebsite: string;
  viewOnMaps: string;
  callLabel: string;
  /** Label voor de link naar /partners/<slug>; weglaten op die pagina zelf. */
  readMore?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
      {partner.url ? (
        <a href={partner.url} target="_blank" rel="noopener noreferrer" className={PRIMARY} style={{ backgroundColor: PINK }}>
          {visitWebsite} →
        </a>
      ) : null}
      {partner.address ? (
        <a
          href={mapsSearchUrl(partner)}
          target="_blank"
          rel="noopener noreferrer"
          className={partner.url ? SECONDARY : PRIMARY}
          style={partner.url ? undefined : { backgroundColor: PINK }}
        >
          {viewOnMaps} →
        </a>
      ) : null}
      {partner.phone ? (
        <a href={`tel:${partner.phone}`} className={SECONDARY}>
          {callLabel} {partner.phoneDisplay}
        </a>
      ) : null}
      {readMore && partner.slug ? (
        <Link href={`/partners/${partner.slug}`} className="text-sm font-medium text-rose-600 dark:text-rose-400 underline-offset-4 hover:underline">
          {readMore} →
        </Link>
      ) : null}
    </div>
  );
}
