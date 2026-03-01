import { createClient } from "@/lib/supabase/server";
import AdminDocumentenClient from "./AdminDocumentenClient";

export type DocRow = {
  userId: string;
  naam: string;
  type: "ID" | "VOG" | "Certificaten" | "Overig";
  path: string;
  bestandsnaam: string;
};

export default async function AdminDocumentenPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("volunteer_onboarding")
    .select("user_id, voornaam, achternaam, id_doc_paths, vog_doc_paths, certs_doc_paths, extra_doc_paths");

  const docs: DocRow[] = (rows ?? []).flatMap((row) => {
    const naam = [row.voornaam, row.achternaam].filter(Boolean).join(" ") || "—";
    const idPaths = (row.id_doc_paths ?? []) as string[];
    const vogPaths = (row.vog_doc_paths ?? []) as string[];
    const certsPaths = (row.certs_doc_paths ?? []) as string[];
    const extraPaths = (row.extra_doc_paths ?? []) as string[];
    return [
      ...idPaths.map((p) => ({ userId: row.user_id, naam, type: "ID" as const, path: p, bestandsnaam: p.split("/").pop() ?? p })),
      ...vogPaths.map((p) => ({ userId: row.user_id, naam, type: "VOG" as const, path: p, bestandsnaam: p.split("/").pop() ?? p })),
      ...certsPaths.map((p) => ({ userId: row.user_id, naam, type: "Certificaten" as const, path: p, bestandsnaam: p.split("/").pop() ?? p })),
      ...extraPaths.map((p) => ({ userId: row.user_id, naam, type: "Overig" as const, path: p, bestandsnaam: p.split("/").pop() ?? p })),
    ];
  });

  return <AdminDocumentenClient docs={docs} />;
}
