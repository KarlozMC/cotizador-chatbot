import {
  createInitialContext,
  getBotResponse,
  handleMessage,
} from "../flows/vaDecoracionesFlow.js";
import {
  createConversation,
  saveMessage,
  updateConversation,
} from "./conversationSupabaseService.js";
import { finalizeConversation } from "./conversationFinalizerService.js";
import type { ConversationContext } from "../types/chatbot.js";

const sessions = new Map<
  string,
  {
    conversationId: string;
    context: ConversationContext;
    finalized: boolean;
  }
>();

export async function processIncomingMessage(params: {
  sessionId: string;
  message: string;
  channel: "manual" | "whatsapp" | "facebook" | "instagram" | "web";
}): Promise<{
  reply: string;
  state: string;
  finalized: boolean;
  leadId: string | null;
}> {
  let session = sessions.get(params.sessionId);

  if (!session) {
    const conversationId = await createConversation();
    const context = createInitialContext();
    const initialBotResponse = getBotResponse(context);

    await saveMessage({
      conversationId,
      sender: "bot",
      messageText: initialBotResponse,
    });

    session = {
      conversationId,
      context,
      finalized: false,
    };

    sessions.set(params.sessionId, session);
  }

  if (session.finalized) {
    return {
      reply: "Esta conversacion ya fue registrada. En breve revisaran tu cotizacion.",
      state: session.context.state,
      finalized: true,
      leadId: null,
    };
  }

  await saveMessage({
    conversationId: session.conversationId,
    sender: "cliente",
    messageText: params.message,
  });

  session.context = handleMessage(session.context, params.message);
  const botResponse = getBotResponse(session.context);

  await saveMessage({
    conversationId: session.conversationId,
    sender: "bot",
    messageText: botResponse,
  });

  await updateConversation({
    conversationId: session.conversationId,
    currentState: session.context.state,
    status:
      session.context.state === "resumen_cotizacion"
        ? "requiere_humano"
        : "activa",
  });

  let leadId: string | null = null;

  if (session.context.state === "resumen_cotizacion") {
    const result = await finalizeConversation({
      conversationId: session.conversationId,
      context: session.context,
    });

    leadId = result.leadId;
    session.finalized = true;
  }

  return {
    reply: botResponse,
    state: session.context.state,
    finalized: session.finalized,
    leadId,
  };
}