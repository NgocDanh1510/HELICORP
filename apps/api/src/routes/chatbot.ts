import { Router } from "express";
import { z } from "zod";

const router = Router();

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000)
});

const chatbotSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(chatMessageSchema).max(8).optional()
});

type AzureChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

router.post("/", async (req, res, next) => {
  try {
    const data = chatbotSchema.parse(req.body);
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    if (!endpoint || !apiKey || !deployment) {
      res.status(503).json({ message: "Chatbot is not configured" });
      return;
    }

    const baseUrl = endpoint.replace(/\/$/, "");
    const url = `${baseUrl}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;
    const messages = [
      {
        role: "system",
        content:
          "You are a concise HeliCorp product advisor. Help customers compare HeliPhone Aurora models, colors, storage and checkout steps. Reply in the same language as the user."
      },
      ...(data.history ?? []),
      {
        role: "user",
        content: data.message
      }
    ];

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        messages,
        temperature: 0.4,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      res.status(502).json({ message: "Chatbot provider failed" });
      return;
    }

    const result = (await response.json()) as AzureChatCompletionResponse;
    const reply = result.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      res.status(502).json({ message: "Chatbot provider returned an empty response" });
      return;
    }

    res.json({ reply });
  } catch (error) {
    next(error);
  }
});

export default router;
