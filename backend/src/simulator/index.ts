import * as readline from "node:readline";
import {
  createInitialContext,
  getBotResponse,
  handleMessage,
} from "../flows/vaDecoracionesFlow.js";

let context = createInitialContext();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Simulador Chatbot MVP - VA Decoraciones");
console.log("Escribe un mensaje como si fueras cliente. Escribe salir para terminar.");
console.log("");
console.log(`Bot: ${getBotResponse(context)}`);

rl.on("line", (input: string) => {
  if (input.toLowerCase() === "salir") {
    console.log("Simulador finalizado.");
    rl.close();
    return;
  }

  context = handleMessage(context, input);
  console.log("");
  console.log(`Bot: ${getBotResponse(context)}`);
  console.log("");
});