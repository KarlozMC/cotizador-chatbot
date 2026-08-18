"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const validStatuses = [
  "nuevo",
  "recopilando_datos",
  "listo_para_revision",
  "cotizado",
  "apartado",
  "perdido",
  "cerrado",
];

export async function updateLeadStatus(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!leadId) {
    throw new Error("Missing leadId");
  }

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const { error } = await supabaseAdmin
    .from("leads")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/prospectos/${leadId}`);

  redirect(`/prospectos/${leadId}`);
}

export async function updateLeadNotes(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const notes = String(formData.get("notes") ?? "");

  if (!leadId) {
    throw new Error("Missing leadId");
  }

  const { error } = await supabaseAdmin
    .from("leads")
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/prospectos/${leadId}`);

  redirect(`/prospectos/${leadId}`);
}