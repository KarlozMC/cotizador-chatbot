import "dotenv/config";
import {
  createInitialContext,
  getBotResponse,
  handleMessage,
} from "../flows/vaDecoracionesFlow.js";
import { createConversation, saveMessage, updateConversation } from "../services/conversationSupabaseService.js";
import { buildInternalLeadSummary } from "../services/internalSummaryService.js";
import { saveLeadToJson } from "../services/leadStorageService.js";
import { saveLeadToSupabase } from "../services/leadSupabaseService.js";
import { simulatorScenarios } from "./scenarios.js";

const scenarioName = process.argv[2] ?? "normal";

const scenario = simulatorScenarios.find((item) => item.name === scenarioName);

if (!scenario) {
  console.error(`Escenario no encontrado: ${scenarioName}`);
  console.error(`Escenarios disponibles: ${simulatorScenarios.map((item) => item.name).join(", ")}`);
  process.exit(1);
}

let context = createInitialContext();
const conversationId = await createConversation();

console.log(`Ejecutando escenario: ${scenario.name}`);
console.log("");

const initialBotResponse = getBotResponse(context);
console.log(`Bot: ${initialBotResponse}`);
await saveMessage({
  conversationId,
  sender: "bot",
  messageText: initialBotResponse,
});

for (const message of scenario.messages) {
  console.log(`Cliente: ${message}`);

  await saveMessage({
    conversationId,
    sender: "cliente",
    messageText: message,
  });

  context = handleMessage(context, message);

  const botResponse = getBotResponse(context);
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
    const internalSummary = buildInternalLeadSummary(context.lead);
    context.lead.internalSummary = internalSummary;

    const filePath = await saveLeadToJson(context.lead);
    console.log(`Ficha local guardada en: ${filePath}`);

    const leadId = await saveLeadToSupabase(context.lead);
    console.log(`Prospecto guardado en Supabase con ID: ${leadId}`);

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

    break;
  }
}