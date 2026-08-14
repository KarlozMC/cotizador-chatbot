import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Lead } from "@/types/lead";
import { updateLeadStatus } from "./actions";

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo lead:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return null;
  }

  return data;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
}) {
  return (
    <div className="border-b border-slate-200 py-3">
      <dt className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900">
        {typeof value === "boolean" ? (value ? "Sí" : "No") : value ?? "-"}
      </dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  console.log("ID recibido en detalle:", id);
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Volver a prospectos
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {lead.customer_name ?? "Prospecto sin nombre"}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Solicitud capturada por el chatbot.
              </p>
            </div>

            <div className="flex gap-2">
              <span
                className={
                  lead.is_urgent
                    ? "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                    : "rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700"
                }
              >
                {lead.is_urgent ? "Urgente" : "No urgente"}
              </span>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {lead.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Seguimiento
            </h2>

            <form action={updateLeadStatus} className="mt-4 flex flex-wrap gap-3">
              <input type="hidden" name="leadId" value={lead.id} />

              <select
                name="status"
                defaultValue={lead.status}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="nuevo">Nuevo</option>
                <option value="recopilando_datos">Recopilando datos</option>
                <option value="listo_para_revision">Listo para revisión</option>
                <option value="cotizado">Cotizado</option>
                <option value="apartado">Apartado</option>
                <option value="perdido">Perdido</option>
                <option value="cerrado">Cerrado</option>
              </select>

              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Guardar estado
              </button>
            </form>
          </section>
          
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Datos del evento
            </h2>

            <dl className="mt-3">
              <DetailRow label="Cliente" value={lead.customer_name} />
              <DetailRow label="Evento" value={lead.event_type} />
              <DetailRow label="Fecha" value={lead.event_date} />
              <DetailRow
                label="Días para el evento"
                value={lead.days_until_event}
              />
              <DetailRow label="Zona" value={lead.event_zone} />
              <DetailRow label="Lugar" value={lead.event_place} />
              <DetailRow label="Decoración" value={lead.decoration_type} />
              <DetailRow label="Tamaño" value={lead.decoration_size} />
              <DetailRow label="Temática / colores" value={lead.theme_or_colors} />
              <DetailRow label="Presupuesto" value={lead.budget} />
              <DetailRow label="Categoría" value={lead.quote_category} />
              <DetailRow label="Requiere traslado" value={lead.requires_transport} />
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Resumen interno
            </h2>

            <pre className="mt-4 whitespace-pre-wrap rounded-md bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              {lead.internal_summary ?? "Sin resumen interno."}
            </pre>
          </section>
        </div>
      </section>
    </main>
  );
}