import AdminLedenDetail from "./AdminLedenDetail";

export default async function AdminLedenIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminLedenDetail id={id} />;
}
