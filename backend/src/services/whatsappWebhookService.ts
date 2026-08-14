export function verifyWhatsappWebhook(params: {
  mode?: string;
  token?: string;
  challenge?: string;
}): string | null {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    throw new Error("Missing WHATSAPP_VERIFY_TOKEN environment variable");
  }

  if (params.mode === "subscribe" && params.token === verifyToken) {
    return params.challenge ?? null;
  }

  return null;
}

export function extractWhatsappMessages(payload: unknown): Array<{
  from: string;
  messageId: string;
  text: string;
}> {
  const body = payload as any;

  const value = body?.entry?.[0]?.changes?.[0]?.value;
  const messages = value?.messages;

  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message?.type === "text" && message?.text?.body)
    .map((message) => ({
      from: String(message.from),
      messageId: String(message.id),
      text: String(message.text.body),
    }));
}