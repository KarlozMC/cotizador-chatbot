import type { ConversationContext } from "../types/chatbot.js";
import { updateConversation, saveMessage } from "./conversationSupabaseService.js";
import { buildInternalLeadSummary } from "./internalSummaryService.js";
import { saveLeadToJson } from "./leadStorageService.js";
import { saveLeadToSupabase } from "./leadSupabaseService.js";

export interface FinalizeConversationResult {
  leadId: string;
  localFilePath: string;
  internalSummary: string;
}

export async function finalizeConversation(params: {
  conversationId: string;
  context: ConversationContext;
}): Promise<FinalizeConversationResult> {
  const internalSummary = buildInternalLeadSummary(params.context.lead);
  params.context.lead.internalSummary = internalSummary;

  const localFilePath = await saveLeadToJson(params.context.lead);
  const leadId = await saveLeadToSupabase(params.context.lead);

  await saveMessage({
    conversationId: params.conversationId,
    sender: "sistema",
    messageText: internalSummary,
    messageType: "system",
  });

  await updateConversation({
    conversationId: params.conversationId,
    leadId,
    currentState: params.context.state,
    status: "requiere_humano",
  });

  return {
    leadId,
    localFilePath,
    internalSummary,
  };
}