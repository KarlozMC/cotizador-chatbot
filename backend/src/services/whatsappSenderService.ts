export async function sendWhatsappTextMessage(params: {
  to: string;
  text: string;
}): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v20.0";

  if (!accessToken) {
    console.log("WHATSAPP_ACCESS_TOKEN no configurado. Respuesta no enviada.");
    return;
  }

  if (!phoneNumberId) {
    console.log("WHATSAPP_PHONE_NUMBER_ID no configurado. Respuesta no enviada.");
    return;
  }

  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.to,
      type: "text",
      text: {
        body: params.text,
      },
    }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(`Error sending WhatsApp message: ${JSON.stringify(responseBody)}`);
  }

  console.log("Respuesta enviada por WhatsApp:", {
    to: params.to,
    response: responseBody,
  });
}