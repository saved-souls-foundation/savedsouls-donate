import AdminEmailTemplateEditClient from "./AdminEmailTemplateEditClient";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEmailTemplateEditPage({ params }: Props) {
  const { id } = await params;
  return <AdminEmailTemplateEditClient id={id} />;
}
