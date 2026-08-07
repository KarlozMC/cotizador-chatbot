import { vaDecoracionesConfig } from "../config/vaDecoraciones.js";

console.log("Chatbot MVP iniciado correctamente.");
console.log(`Negocio cargado: ${vaDecoracionesConfig.businessName}`);
console.log(`Ubicacion base: ${vaDecoracionesConfig.baseCity}`);
console.log(`Precio inicial: desde $${vaDecoracionesConfig.startingPrice} MXN`);
console.log(`Anticipo: ${vaDecoracionesConfig.depositPercentage}%`);
console.log(`Reservacion recomendada: ${vaDecoracionesConfig.reservationDays} dias`);