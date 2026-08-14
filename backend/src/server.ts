import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  extractWhatsappMessages,
  verifyWhatsappWebhook,
} from "./services/whatsappWebhookService.js";
import { processIncomingMessage } from "./services/chatSessionService.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "cotizador-chatbot-backend",
  });
});

app.post("/messages", async (req, res) => {
  try {
    const { sessionId, message } = req.body as {
      sessionId?: string;
      message?: string;
    };

    if (!sessionId || !message) {
      return res.status(400).json({
        error: "sessionId and message are required",
      });
    }

    const result = await processIncomingMessage({
      sessionId,
      message,
      channel: "manual",
    });

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/webhooks/whatsapp", (req, res) => {
  try {
    const challenge = verifyWhatsappWebhook({
      mode: String(req.query["hub.mode"] ?? ""),
      token: String(req.query["hub.verify_token"] ?? ""),
      challenge: String(req.query["hub.challenge"] ?? ""),
    });

    if (!challenge) {
      return res.sendStatus(403);
    }

    return res.status(200).send(challenge);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

app.post("/webhooks/whatsapp", async (req, res) => {
  try {
    const messages = extractWhatsappMessages(req.body);

    for (const message of messages) {
      const result = await processIncomingMessage({
        sessionId: `whatsapp:${message.from}`,
        message: message.text,
        channel: "whatsapp",
      });

      console.log("Mensaje WhatsApp procesado:", {
        from: message.from,
        messageId: message.messageId,
        text: message.text,
        reply: result.reply,
        state: result.state,
        finalized: result.finalized,
        leadId: result.leadId,
      });
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});