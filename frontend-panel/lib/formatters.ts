const statusLabels: Record<string, string> = {
  nuevo: "Nuevo",
  recopilando_datos: "Recopilando datos",
  listo_para_revision: "Listo para revisión",
  cotizado: "Cotizado",
  apartado: "Apartado",
  perdido: "Perdido",
  cerrado: "Cerrado",
};

const quoteCategoryLabels: Record<string, string> = {
  sencilla: "Sencilla",
  mediana: "Mediana",
  grande_personalizada: "Grande / personalizada",
  requiere_revision: "Requiere revisión",
};

const decorationSizeLabels: Record<string, string> = {
  sencillo: "Sencillo",
  mediano: "Mediano",
  grande: "Grande",
  no_definido: "No definido",
};

export function formatStatus(value: string | null | undefined): string {
  if (!value) return "-";

  return statusLabels[value] ?? value;
}

export function formatQuoteCategory(value: string | null | undefined): string {
  if (!value) return "-";

  return quoteCategoryLabels[value] ?? value;
}

export function formatDecorationSize(value: string | null | undefined): string {
  if (!value) return "-";

  return decorationSizeLabels[value] ?? value;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return "-";

  return value ? "Sí" : "No";
}