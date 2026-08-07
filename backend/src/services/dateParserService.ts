const MONTHS: Record<string, string> = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

export function parseEventDate(value?: string): string | null {
  if (!value) return null;

  const normalized = normalizeText(value);

  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return normalized;
  }

  const slashMatch = normalized.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?$/);
  if (slashMatch) {
    const day = pad(slashMatch[1]);
    const month = pad(slashMatch[2]);
    const year = slashMatch[3] ?? getCurrentYear();

    return `${year}-${month}-${day}`;
  }

  const textMatch = normalized.match(/^(\d{1,2})\s*(de\s*)?([a-z]+)(\s*(de\s*)?(\d{4}))?$/);
  if (textMatch) {
    const day = pad(textMatch[1]);
    const monthName = textMatch[3];
    const year = textMatch[6] ?? getCurrentYear();
    const month = MONTHS[monthName];

    if (!month) return null;

    return `${year}-${month}-${day}`;
  }

  return null;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function pad(value: string): string {
  return value.padStart(2, "0");
}

function getCurrentYear(): string {
  return String(new Date().getFullYear());
}