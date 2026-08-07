import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LeadDraft } from "../types/chatbot.js";

const DATA_DIR = path.resolve(process.cwd(), "data", "leads");

export async function saveLeadToJson(lead: LeadDraft): Promise<string> {
  await mkdir(DATA_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `lead-${timestamp}.json`;
  const filePath = path.join(DATA_DIR, fileName);

  const payload = {
    ...lead,
    savedAt: new Date().toISOString(),
  };

  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");

  return filePath;
}