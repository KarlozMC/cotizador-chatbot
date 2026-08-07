import { supabase } from "./supabaseClient.js";
import type { LeadDraft } from "../types/chatbot.js";
import { getBusinessId } from "./conversationSupabaseService.js";

export async function saveLeadToSupabase(lead: LeadDraft): Promise<string> {
  const businessId = await getBusinessId();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      business_id: businessId,
      channel: "manual",
      customer_name: lead.customerName,
      event_type: lead.eventType,
      event_date: normalizeEventDate(lead.eventDate),
      event_zone: lead.eventZone,
      event_place: lead.eventPlace,
      decoration_type: lead.decorationType,
      decoration_size: lead.decorationSize,
      theme_or_colors: lead.themeOrColors,
      budget: normalizeBudget(lead.budget),
      has_reference_image: lead.hasReferenceImage ?? false,
      quote_category: lead.quoteCategory,
      requires_transport: lead.requiresTransport,
      status: "listo_para_revision",
      notes: lead.notes,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error saving lead to Supabase: ${error.message}`);
  }

  return data.id;
}

function normalizeBudget(value?: string): number | null {
  if (!value) return null;

  const cleaned = value.replace(/[^\d.]/g, "");
  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeEventDate(value?: string): string | null {
  if (!value) return null;

  // Por ahora solo guardamos fechas claras tipo 2026-09-20.
  // Si el cliente escribe "20 de septiembre", lo dejamos null hasta agregar parser.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return null;
}