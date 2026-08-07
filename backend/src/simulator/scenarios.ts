export interface SimulatorScenario {
  name: string;
  messages: string[];
}

export const simulatorScenarios: SimulatorScenario[] = [
  {
    name: "normal",
    messages: [
      "Hola",
      "Carlos",
      "Cumpleaños",
      "Arco organico",
      "20 de septiembre",
      "General Escobedo",
      "Salon",
      "Mediano",
      "Barbie rosa con dorado",
      "2500",
    ],
  },
  {
    name: "urgente",
    messages: [
      "Hola",
      "Ana",
      "Baby shower",
      "Arco organico",
      "15 de agosto",
      "San Nicolas",
      "Casa",
      "Mediano",
      "Rosa pastel y dorado",
      "3000",
    ],
  },
  {
    name: "fuera_escobedo",
    messages: [
      "Hola",
      "Luis",
      "Bautizo",
      "Torres de globos",
      "25 de septiembre",
      "Monterrey",
      "Jardin",
      "Sencillo",
      "Blanco con azul",
      "2000",
    ],
  },
  {
    name: "grande_personalizada",
    messages: [
      "Hola",
      "Mariana",
      "XV años",
      "Pared de globos y decoracion completa",
      "10 de octubre",
      "Apodaca",
      "Salon",
      "Grande",
      "Elegante en negro, dorado y plateado",
      "8000",
    ],
  },
];