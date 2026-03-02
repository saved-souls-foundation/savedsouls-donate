import AdminEmailDetail from "./AdminEmailDetail";

export default async function AdminEmailsIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEmailDetail id={id} />;
}
