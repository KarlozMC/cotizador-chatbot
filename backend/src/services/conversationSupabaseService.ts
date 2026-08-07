import { supabase } from "./supabaseClient.js";

const BUSINESS_NAME = "VA Decoraciones";

export async function getBusinessId(): Promise<string> {
  const { data, error } = await supabase
    .from("businesses")
    .select("id")
    .eq("name", BUSINESS_NAME)
    .single();

  if (error) {
    throw new Error(`Error finding business: ${error.message}`);
  }

  return data.id;
}

export async function createConversation(): Promise<string> {
  const businessId = await getBusinessId();

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      business_id: businessId,
      channel: "manual",
      current_state: "inicio",
      status: "activa",
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error creating conversation: ${error.message}`);
  }

  return data.id;
}

export async function saveMessage(params: {
  conversationId: string;
  sender: "cliente" | "bot" | "humano" | "sistema";
  messageText: string;
  messageType?: "text" | "image" | "audio" | "video" | "file" | "system";
}): Promise<void> {
  const { error } = await supabase.from("messages").insert({
    conversation_id: params.conversationId,
    sender: params.sender,
    message_text: params.messageText,
    message_type: params.messageType ?? "text",
  });

  if (error) {
    throw new Error(`Error saving message: ${error.message}`);
  }
}

export async function updateConversation(params: {
  conversationId: string;
  leadId?: string;
  currentState: string;
  status: "activa" | "requiere_humano" | "cerrada";
}): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .update({
      lead_id: params.leadId,
      current_state: params.currentState,
      status: params.status,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", params.conversationId);

  if (error) {
    throw new Error(`Error updating conversation: ${error.message}`);
  }
}