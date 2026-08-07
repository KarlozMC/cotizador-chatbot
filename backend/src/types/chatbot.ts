export type ConversationState =
  | "inicio"
  | "esperando_nombre"
  | "esperando_tipo_evento"
  | "esperando_tipo_decoracion"
  | "esperando_fecha"
  | "esperando_zona"
  | "esperando_lugar"
  | "esperando_tamano"
  | "esperando_tematica"
  | "esperando_presupuesto"
  | "resumen_cotizacion"
  | "requiere_humano"
  | "cerrado";

export type DecorationSize = "sencillo" | "mediano" | "grande" | "no_definido";

export type QuoteCategory =
  | "sencilla"
  | "mediana"
  | "grande_personalizada"
  | "requiere_revision";

export interface LeadDraft {
  customerName?: string;
  eventType?: string;
  eventDate?: string;
  eventZone?: string;
  eventPlace?: string;
  decorationType?: string;
  decorationSize?: DecorationSize;
  themeOrColors?: string;
  budget?: string;
  hasReferenceImage?: boolean;
  quoteCategory?: QuoteCategory;
  requiresTransport?: boolean;
  notes?: string;
  isUrgent?: boolean;
  daysUntilEvent?: number | null;
  internalSummary?: string;
}

export interface ConversationContext {
  state: ConversationState;
  lead: LeadDraft;
  lastFaqAnswer?: string;
}