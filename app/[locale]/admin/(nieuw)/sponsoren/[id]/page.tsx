import AdminSponsorDetail from "./AdminSponsorDetail";

export default async function AdminSponsorenIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminSponsorDetail id={id} />;
}
