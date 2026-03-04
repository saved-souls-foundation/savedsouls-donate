import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import LinksPageClient from "./LinksPageClient";

type Props = { params: Promise<{ locale: string }> };

export default async function LinksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "links" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const internalLinks = [
    { href: "/", label: t("linkHome") },
    { href: "/story", label: tCommon("ourStory") },
    { href: "/about-us", label: tCommon("aboutUs") },
    { href: "/adopt", label: tCommon("adopt") },
    { href: "/volunteer", label: tCommon("volunteer") },
    { href: "/get-involved", label: tCommon("getInvolved") },
    { href: "/contact", label: tCommon("contact") },
    { href: "/#donate", label: tCommon("donate") },
    { href: "/blog", label: t("linkBlog") },
    { href: "/#newsletter", label: t("linkNewsletter") },
  ];

  const donateLinks = [
    { href: "/#donate", label: tCommon("donate") },
    { href: "/donate/causes", label: tCommon("donateCauses") },
    { href: "/financial-overview", label: tCommon("financialOverview") },
  ];

  return (
    <LinksPageClient
      title={t("title")}
      intro={t("intro")}
      sectionOurSite={t("sectionOurSite")}
      sectionDonate={t("sectionDonate")}
      sectionNl={t("sectionNl")}
      sectionThailand={t("sectionThailand")}
      sectionPetFood={t("sectionPetFood")}
      sectionPetShops={t("sectionPetShops")}
      sectionInfo={t("sectionInfo")}
      sectionInternational={t("sectionInternational")}
      visitLink={t("visitLink")}
      disclaimer={t("disclaimer")}
      internalLinks={internalLinks}
      donateLinks={donateLinks}
    />
  );
}
