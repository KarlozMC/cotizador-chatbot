import { vaDecoracionesConfig } from "../config/vaDecoraciones.js";
import { findFaqAnswer } from "../services/faqService.js";
import type { ConversationContext, ConversationState } from "../types/chatbot.js";
import { getDaysUntilEvent, isUrgentEvent } from "../services/eventUrgencyService.js";

const nextStateMap: Record<ConversationState, ConversationState> = {
  inicio: "esperando_nombre",
  esperando_nombre: "esperando_tipo_evento",
  esperando_tipo_evento: "esperando_tipo_decoracion",
  esperando_tipo_decoracion: "esperando_fecha",
  esperando_fecha: "esperando_zona",
  esperando_zona: "esperando_lugar",
  esperando_lugar: "esperando_tamano",
  esperando_tamano: "esperando_tematica",
  esperando_tematica: "esperando_presupuesto",
  esperando_presupuesto: "resumen_cotizacion",
  resumen_cotizacion: "requiere_humano",
  requiere_humano: "cerrado",
  cerrado: "cerrado",
};

export function createInitialContext(): ConversationContext {
  return {
    state: "inicio",
    lead: {
      hasReferenceImage: false,
    },
  };
}

export function handleMessage(
  context: ConversationContext,
  message: string
): ConversationContext {
  const normalizedMessage = message.trim();
  const faqAnswer = findFaqAnswer(normalizedMessage);

  const updatedContext: ConversationContext = {
    ...context,
    lastFaqAnswer: faqAnswer ?? undefined,
    lead: {
      ...context.lead,
    },
  };

  captureLeadData(updatedContext, normalizedMessage);

  updatedContext.state = nextStateMap[context.state];

  return updatedContext;
}

export function getBotResponse(context: ConversationContext): string {
  const flowResponse = getFlowResponse(context);

  if (context.lastFaqAnswer) {
    return `${context.lastFaqAnswer}\n\n${flowResponse}`;
  }

  return flowResponse;
}

function getFlowResponse(context: ConversationContext): string {
  switch (context.state) {
    case "inicio":
      return `Hola, bienvenido a ${vaDecoracionesConfig.businessName}. Te ayudo a cotizar tu decoracion con globos. Para darte una mejor opcion, te hare unas preguntas rapidas.`;

    case "esperando_nombre":
      return "Para iniciar, ¿me puedes compartir tu nombre?";

    case "esperando_tipo_evento":
      return "¿Que tipo de evento estas organizando? Puede ser cumpleaños, baby shower, bautizo, XV años, boda, graduacion, evento empresarial, evento escolar u otro.";

    case "esperando_tipo_decoracion":
      return "¿Que tipo de decoracion te interesa? Puede ser arco organico moderno, pared de globos, torres de globos, bouquet flotante personalizado, decoracion completa o si aun no sabes, tambien puedo ayudarte con ideas.";

    case "esperando_fecha":
      return `¿Para que fecha necesitas la decoracion? Te recomendamos reservar con al menos ${vaDecoracionesConfig.reservationDays} dias de anticipacion para coordinar disponibilidad, materiales y logistica.`;

    case "esperando_zona":
      return `¿En que zona sera el evento? Estamos en ${vaDecoracionesConfig.baseCity}. ${vaDecoracionesConfig.transportPolicy}`;

    case "esperando_lugar":
      return "¿Donde sera el montaje? Puede ser casa, salon, jardin, escuela, negocio u otro.";

    case "esperando_tamano":
      return "¿Que tamaño tienes en mente? Sencillo, mediano, grande o aun no estas seguro.";

    case "esperando_tematica":
      return "¿Tienes alguna tematica, colores o idea en mente? Tambien puedes enviar una foto de referencia para cotizar con mas precision.";

    case "esperando_presupuesto":
      return `¿Tienes algun presupuesto aproximado? Nuestras decoraciones comienzan desde $${vaDecoracionesConfig.startingPrice} MXN.`;

    case "resumen_cotizacion":
      return buildLeadSummary(context);

    case "requiere_humano":
      return "Gracias, ya tenemos la informacion principal. En breve revisaran tu cotizacion y te atenderan para darte mas detalle sobre precio, disponibilidad y logistica.";

    case "cerrado":
      return "La solicitud quedo registrada para seguimiento.";

    default:
      return "Disculpa, no pude procesar tu mensaje. ¿Me puedes compartir de nuevo la informacion?";
  }
}

function captureLeadData(context: ConversationContext, message: string): void {
  switch (context.state) {
    case "esperando_nombre":
      context.lead.customerName = message;
      break;

    case "esperando_tipo_evento":
      context.lead.eventType = message;
      break;

    case "esperando_tipo_decoracion":
      context.lead.decorationType = message;
      break;

    case "esperando_fecha":
      context.lead.eventDate = message;
      context.lead.daysUntilEvent = getDaysUntilEvent(message);
      context.lead.isUrgent = isUrgentEvent(message);
      break;

    case "esperando_zona":
      context.lead.eventZone = message;
      context.lead.requiresTransport = !message
        .toLowerCase()
        .includes(vaDecoracionesConfig.baseCity.toLowerCase());
      break;

    case "esperando_lugar":
      context.lead.eventPlace = message;
      break;

    case "esperando_tamano":
      context.lead.decorationSize = normalizeDecorationSize(message);
      break;

    case "esperando_tematica":
      context.lead.themeOrColors = message;
      break;

    case "esperando_presupuesto":
      context.lead.budget = message;
      context.lead.quoteCategory = classifyQuote(context);
      break;

    default:
      break;
  }
}

function normalizeDecorationSize(message: string) {
  const value = message.toLowerCase();

  if (value.includes("sencill")) return "sencillo";
  if (value.includes("median")) return "mediano";
  if (value.includes("grand")) return "grande";

  return "no_definido";
}

function classifyQuote(context: ConversationContext) {
  const decorationType = context.lead.decorationType?.toLowerCase() ?? "";
  const decorationSize = context.lead.decorationSize;

  if (
    decorationSize === "grande" ||
    decorationType.includes("pared") ||
    decorationType.includes("completa") ||
    decorationType.includes("boda") ||
    decorationType.includes("xv")
  ) {
    return "grande_personalizada";
  }

  if (
    decorationSize === "mediano" ||
    decorationType.includes("arco") ||
    decorationType.includes("baby") ||
    decorationType.includes("bautizo")
  ) {
    return "mediana";
  }

  if (
    decorationSize === "sencillo" ||
    decorationType.includes("bouquet") ||
    decorationType.includes("torre")
  ) {
    return "sencilla";
  }

  return "requiere_revision";
}

function buildLeadSummary(context: ConversationContext): string {
  const lead = context.lead;

  return [
    "Gracias. Ya tengo estos datos para revisar tu cotizacion:",
    "",
    `Evento: ${lead.eventType ?? "No indicado"}`,
    `Fecha: ${lead.eventDate ?? "No indicada"}`,
    `Dias para el evento: ${lead.daysUntilEvent ?? "No calculado"}`,
    `Evento urgente: ${lead.isUrgent ? "Si" : "No"}`,
    `Zona: ${lead.eventZone ?? "No indicada"}`,
    `Lugar: ${lead.eventPlace ?? "No indicado"}`,
    `Decoracion: ${lead.decorationType ?? "No indicada"}`,
    `Tamaño: ${lead.decorationSize ?? "No indicado"}`,
    `Tematica o colores: ${lead.themeOrColors ?? "No indicado"}`,
    `Presupuesto: ${lead.budget ?? "No indicado"}`,
    `Categoria estimada: ${lead.quoteCategory ?? "Requiere revision"}`,
    `Requiere traslado: ${lead.requiresTransport ? "Si" : "No"}`,
  ].join("\n");
}