"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function OurWorkSection() {
  const t = useTranslations("ourWork");
  return (
    <section style={{ paddingTop: "1.5rem", paddingRight: "1.5rem", paddingBottom: "4rem", paddingLeft: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      <p style={{ display: "inline-block", fontSize: "12px", fontWeight: 500,
            letterSpacing: "0.07em", textTransform: "uppercase",
            color: "#27500A", backgroundColor: "#C0DD97",
            padding: "5px 14px", borderRadius: "999px",
            marginBottom: "1rem" }}>
        {t("label")}
      </p>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500,
                   lineHeight: 1.2, marginBottom: "1rem", maxWidth: "560px" }}>
        {t("title")}
      </h2>
      <p style={{ fontSize: "17px", lineHeight: 1.7, color: "#666",
                  maxWidth: "540px", marginBottom: "2.5rem" }}>
        {t("intro")}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr",
                    gridTemplateRows: "1fr 1fr", gap: "12px", height: "clamp(300px, 50vw, 420px)" }}>
        <div style={{ borderRadius: "16px", overflow: "hidden", gridRow: "span 2" }}>
          <Image src="/ourwork-1.webp" alt={t("alt1")}
                 width={600} height={400} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div style={{ borderRadius: "16px", overflow: "hidden" }}>
          <Image src="/ourwork-2.webp" alt={t("alt2")}
                 width={400} height={200} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div style={{ borderRadius: "16px", overflow: "hidden" }}>
          <Image src="/ourwork-3.webp" alt={t("alt3")}
                 width={400} height={160} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
      </div>
    </section>
  );
}
