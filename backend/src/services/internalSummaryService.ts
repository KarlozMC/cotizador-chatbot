import type { LeadDraft } from "../types/chatbot.js";

export function buildInternalLeadSummary(lead: LeadDraft): string {
  return [
    "Nuevo prospecto listo para revision",
    "",
    `Cliente: ${lead.customerName ?? "No indicado"}`,
    `Evento: ${lead.eventType ?? "No indicado"}`,
    `Fecha: ${lead.eventDate ?? "No indicada"}`,
    `Dias para el evento: ${lead.daysUntilEvent ?? "No calculado"}`,
    `Urgente: ${lead.isUrgent ? "Si" : "No"}`,
    `Zona: ${lead.eventZone ?? "No indicada"}`,
    `Lugar: ${lead.eventPlace ?? "No indicado"}`,
    `Decoracion: ${lead.decorationType ?? "No indicada"}`,
    `Tamaño: ${lead.decorationSize ?? "No indicado"}`,
    `Tematica / colores: ${lead.themeOrColors ?? "No indicado"}`,
    `Presupuesto: ${lead.budget ?? "No indicado"}`,
    `Categoria estimada: ${lead.quoteCategory ?? "Requiere revision"}`,
    `Requiere traslado: ${lead.requiresTransport ? "Si" : "No"}`,
    "",
    `Accion sugerida: ${getSuggestedAction(lead)}`,
  ].join("\n");
}

function getSuggestedAction(lead: LeadDraft): string {
  if (lead.isUrgent) {
    return "Revisar disponibilidad y logistica lo antes posible por fecha cercana.";
  }

  if (lead.quoteCategory === "grande_personalizada") {
    return "Solicitar o revisar foto de referencia y preparar cotizacion personalizada.";
  }

  if (lead.requiresTransport) {
    return "Calcular costo de traslado segun kilometros recorridos.";
  }

  if (lead.quoteCategory === "sencilla") {
    return "Validar detalles basicos y confirmar precio inicial o ajuste segun montaje.";
  }

  return "Revisar solicitud y preparar cotizacion segun detalles del evento.";
}