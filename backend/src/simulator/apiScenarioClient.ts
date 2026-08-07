const API_URL = process.env.API_URL ?? "http://localhost:3000/messages";

const messages = [
  "Hola",
  "Carlos",
  "Cumpleaños",
  "Arco organico",
  "20 de septiembre",
  "San Nicolas",
  "Salon",
  "Mediano",
  "Barbie rosa con dorado",
  "2500",
];

const sessionId = `api-test-${Date.now()}`;

console.log(`Probando API con sessionId: ${sessionId}`);
console.log("");

for (const message of messages) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      message,
    }),
  });

  const data = await response.json();

  console.log(`Cliente: ${message}`);
  console.log(`Bot: ${data.reply}`);
  console.log(`Estado: ${data.state}`);
  console.log(`Finalizado: ${data.finalized}`);
  console.log("");

  if (data.finalized) {
    console.log(`Lead ID: ${data.leadId}`);
    break;
  }
}