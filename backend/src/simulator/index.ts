import "dotenv/config";
import * as readline from "node:readline";
import {
  createInitialContext,
  getBotResponse,
  handleMessage,
} from "../flows/vaDecoracionesFlow.js";
import { saveLeadToJson } from "../services/leadStorageService.js";
import { saveLeadToSupabase } from "../services/leadSupabaseService.js";
import {
  createConversation,
  saveMessage,
  updateConversation,
} from "../services/conversationSupabaseService.js";
import { buildInternalLeadSummary } from "../services/internalSummaryService.js";

let context = createInitialContext();
const conversationId = await createConversation();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Simulador Chatbot MVP - VA Decoraciones");
console.log("Escribe un mensaje como si fueras cliente. Escribe salir para terminar.");
console.log("");

const initialBotResponse = getBotResponse(context);
console.log(`Bot: ${initialBotResponse}`);
await saveMessage({
  conversationId,
  sender: "bot",
  messageText: initialBotResponse,
});

rl.on("line", async (input: string) => {
  if (input.toLowerCase() === "salir") {
    console.log("Simulador finalizado.");
    rl.close();
    return;
  }

  await saveMessage({
    conversationId,
    sender: "cliente",
    messageText: input,
  });

  context = handleMessage(context, input);

  const botResponse = getBotResponse(context);

  console.log("");
  console.log(`Bot: ${botResponse}`);
  console.log("");

  await saveMessage({
    conversationId,
    sender: "bot",
    messageText: botResponse,
  });

  await updateConversation({
    conversationId,
    currentState: context.state,
    status: context.state === "requiere_humano" ? "requiere_humano" : "activa",
  });

  if (context.state === "requiere_humano") {
    const filePath = await saveLeadToJson(context.lead);
    console.log(`Ficha local guardada en: ${filePath}`);

    const leadId = await saveLeadToSupabase(context.lead);
    console.log(`Prospecto guardado en Supabase con ID: ${leadId}`);
    console.log("");

    const internalSummary = buildInternalLeadSummary(context.lead);
    console.log("Resumen interno para seguimiento:");
    console.log(internalSummary);
    console.log("");

    await saveMessage({
      conversationId,
      sender: "sistema",
      messageText: internalSummary,
      messageType: "system",
    });

    await updateConversation({
      conversationId,
      leadId,
      currentState: context.state,
      status: "requiere_humano",
    });
  }
});