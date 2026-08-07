import "dotenv/config";
import * as readline from "node:readline";
import {
  createInitialContext,
  getBotResponse,
  handleMessage,
} from "../flows/vaDecoracionesFlow.js";
import { saveLeadToJson } from "../services/leadStorageService.js";

let context = createInitialContext();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Simulador Chatbot MVP - VA Decoraciones");
console.log("Escribe un mensaje como si fueras cliente. Escribe salir para terminar.");
console.log("");
console.log(`Bot: ${getBotResponse(context)}`);

rl.on("line", async (input: string) => {
  if (input.toLowerCase() === "salir") {
    console.log("Simulador finalizado.");
    rl.close();
    return;
  }

  context = handleMessage(context, input);
  console.log("");
  console.log(`Bot: ${getBotResponse(context)}`);
  console.log("");

  if (context.state === "requiere_humano") {
  const filePath = await saveLeadToJson(context.lead);
  console.log(`Ficha del prospecto guardada en: ${filePath}`);
  console.log("");
}
});