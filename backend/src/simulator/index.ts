import "dotenv/config";
import * as readline from "node:readline";
import {
  createInitialContext,
  getBotResponse,
  handleMessage,
} from "../flows/vaDecoracionesFlow.js";
import {
  createConversation,
  saveMessage,
  updateConversation,
} from "../services/conversationSupabaseService.js";
import { finalizeConversation } from "../services/conversationFinalizerService.js";

let context = createInitialContext();
let conversationFinalized = false;
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

  if (conversationFinalized) {
    console.log("");
    console.log("Esta conversacion ya fue registrada. Escribe salir para terminar el simulador.");
    console.log("");
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

  if (context.state === "resumen_cotizacion") {
    const result = await finalizeConversation({
      conversationId,
      context,
    });

    console.log(`Ficha local guardada en: ${result.localFilePath}`);
    console.log(`Prospecto guardado en Supabase con ID: ${result.leadId}`);
    console.log("Resumen interno para seguimiento:");
    console.log(result.internalSummary);
    console.log("");

    conversationFinalized = true;
  }
});