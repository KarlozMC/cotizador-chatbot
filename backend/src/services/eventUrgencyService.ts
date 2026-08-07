import { vaDecoracionesConfig } from "../config/vaDecoraciones.js";
import { parseEventDate } from "./dateParserService.js";

export function getDaysUntilEvent(eventDate?: string): number | null {
  const parsedDate = parseEventDate(eventDate);

  if (!parsedDate) return null;

  const today = startOfDay(new Date());
  const event = startOfDay(new Date(`${parsedDate}T00:00:00`));

  const diffMs = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function isUrgentEvent(eventDate?: string): boolean {
  const daysUntilEvent = getDaysUntilEvent(eventDate);

  if (daysUntilEvent === null) return false;

  return daysUntilEvent < vaDecoracionesConfig.reservationDays;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}