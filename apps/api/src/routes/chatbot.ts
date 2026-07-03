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

type AzureResponsesApiResponse = {
  output?: Array<{
    type?: string;
    role?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

router.post("/", async (req, res, next) => {
  try {
    const data = chatbotSchema.parse(req.body);
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    if (!endpoint || !apiKey || !deployment) {
      res.status(503).json({ message: "Chatbot is not configured" });
      return;
    }

    const input = [
      ...(data.history ?? []),
      {
        role: "user",
        content: data.message
      }
    ];

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        model: deployment,
        instructions:
          "You are a concise HeliCorp product advisor. Help customers compare HeliPhone Aurora models, colors, storage and checkout steps. Reply in the same language as the user.",
        input,
        temperature: 0.4,
        max_output_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chatbot provider error:", response.status, errorText);
      res.status(502).json({ message: "Chatbot provider failed", status: response.status, details: errorText });
      return;
    }

    const result = (await response.json()) as AzureResponsesApiResponse;
    const replyObj = result.output?.[0]?.content?.find((c: any) => c.type === "output_text");
    const reply = replyObj?.text?.trim();

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
