import AgendaClient from "./AgendaClient";

export const metadata = {
  title: "Agenda | Admin",
  robots: { index: false, follow: false },
};

export default function AgendaPage() {
  return <AgendaClient />;
}
