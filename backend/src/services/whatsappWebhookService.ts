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

export function extractWhatsappStatuses(payload: unknown): Array<{
  messageId: string;
  status: string;
  timestamp?: string;
  recipientId?: string;
  errors?: unknown;
}> {
  const body = payload as any;

  const value = body?.entry?.[0]?.changes?.[0]?.value;
  const statuses = value?.statuses;

  if (!Array.isArray(statuses)) {
    return [];
  }

  return statuses.map((status) => ({
    messageId: String(status.id),
    status: String(status.status),
    timestamp: status.timestamp ? String(status.timestamp) : undefined,
    recipientId: status.recipient_id ? String(status.recipient_id) : undefined,
    errors: status.errors,
  }));
}