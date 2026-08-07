import { vaDecoracionesConfig } from "../config/vaDecoraciones.js";

export function findFaqAnswer(message: string): string | null {
  const normalizedMessage = normalizeText(message);

  if (matchesAny(normalizedMessage, ["precio", "cuanto cuesta", "costo", "vale"])) {
    return getFaqAnswer("Cuanto cuesta una decoracion?");
  }

  if (matchesAny(normalizedMessage, ["paquete", "paquetes"])) {
    return getFaqAnswer("Manejan paquetes?");
  }

  if (matchesAny(normalizedMessage, ["tematica", "tematicas", "tema", "personaje", "colores"])) {
    return getFaqAnswer("Que tematicas manejan?");
  }

  if (
    matchesAny(normalizedMessage, [
      "anticipacion",
      "apartar",
      "reservar",
      "reservacion",
      "fecha",
    ])
  ) {
    return getFaqAnswer("Con cuanto tiempo debo apartar?");
  }

  if (matchesAny(normalizedMessage, ["anticipo", "adelanto", "separa"])) {
    return getFaqAnswer("Cuanto se pide de anticipo?");
  }

  if (
    matchesAny(normalizedMessage, [
      "tarjeta",
      "transferencia",
      "efectivo",
      "deposito",
      "pago",
      "pagos",
    ])
  ) {
    return getFaqAnswer("Aceptan tarjeta?");
  }

  if (matchesAny(normalizedMessage, ["traslado", "envio", "domicilio", "fuera de escobedo"])) {
    return getFaqAnswer("Cobran envio o traslado?");
  }

  return null;
}

function getFaqAnswer(question: string): string | null {
  const faq = vaDecoracionesConfig.faq.find((item) => item.question === question);

  return faq?.answer ?? null;
}

function matchesAny(message: string, keywords: string[]): boolean {
  return keywords.some((keyword) => message.includes(normalizeText(keyword)));
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}