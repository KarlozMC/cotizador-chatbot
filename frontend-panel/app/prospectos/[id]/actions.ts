"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  const { error } = await supabase
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