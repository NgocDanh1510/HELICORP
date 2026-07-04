export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function sendChatMessage(message: string, history: ChatMessage[]) {
  try {
    const response = await fetch(`${apiUrl}/api/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, history: history.slice(-8) })
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as { reply: string };
  } catch {
    return null;
  }
}
