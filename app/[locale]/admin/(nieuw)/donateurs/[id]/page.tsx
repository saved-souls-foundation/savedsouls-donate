import AdminDonateurDetail from "./AdminDonateurDetail";

export default async function AdminDonateursIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminDonateurDetail id={id} />;
}
