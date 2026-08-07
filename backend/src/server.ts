import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  createInitialContext,
  getBotResponse,
  handleMessage,
} from "./flows/vaDecoracionesFlow.js";
import {
  createConversation,
  saveMessage,
  updateConversation,
} from "./services/conversationSupabaseService.js";
import { finalizeConversation } from "./services/conversationFinalizerService.js";
import type { ConversationContext } from "./types/chatbot.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

const sessions = new Map<
  string,
  {
    conversationId: string;
    context: ConversationContext;
    finalized: boolean;
  }
>();

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

    let session = sessions.get(sessionId);

    if (!session) {
      const conversationId = await createConversation();
      const context = createInitialContext();
      const initialBotResponse = getBotResponse(context);

      await saveMessage({
        conversationId,
        sender: "bot",
        messageText: initialBotResponse,
      });

      session = {
        conversationId,
        context,
        finalized: false,
      };

      sessions.set(sessionId, session);
    }

    if (session.finalized) {
      return res.json({
        reply:
          "Esta conversacion ya fue registrada. En breve revisaran tu cotizacion.",
        finalized: true,
      });
    }

    await saveMessage({
      conversationId: session.conversationId,
      sender: "cliente",
      messageText: message,
    });

    session.context = handleMessage(session.context, message);
    const botResponse = getBotResponse(session.context);

    await saveMessage({
      conversationId: session.conversationId,
      sender: "bot",
      messageText: botResponse,
    });

    await updateConversation({
      conversationId: session.conversationId,
      currentState: session.context.state,
      status:
        session.context.state === "resumen_cotizacion"
          ? "requiere_humano"
          : "activa",
    });

    let leadId: string | null = null;

    if (session.context.state === "resumen_cotizacion") {
      const result = await finalizeConversation({
        conversationId: session.conversationId,
        context: session.context,
      });

      leadId = result.leadId;
      session.finalized = true;
    }

    return res.json({
      reply: botResponse,
      state: session.context.state,
      finalized: session.finalized,
      leadId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});