import { supabase } from "@/lib/supabase";
import type { Lead } from "@/types/lead";
import Link from "next/link";

async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export default async function Home() {
  const leads = await getLeads();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Prospectos VA Decoraciones
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Solicitudes capturadas por el chatbot para revisión y seguimiento.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Evento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Zona
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Decoración
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Categoría
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Urgente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      <Link href={`/prospectos/${lead.id}`} className="hover:underline">
                        {lead.customer_name ?? "Sin nombre"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {lead.event_type ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {lead.event_date ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {lead.event_zone ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {lead.decoration_type ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {lead.quote_category ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={
                          lead.is_urgent
                            ? "rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                            : "rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                        }
                      >
                        {lead.is_urgent ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {lead.status}
                    </td>
                  </tr>
                ))}

                {leads.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Todavía no hay prospectos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}