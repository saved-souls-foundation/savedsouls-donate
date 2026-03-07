"use client";

export default function AgendaError({ error }: { error: Error }) {
  return (
    <div className="p-8">
      <h2>Agenda fout:</h2>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
}
