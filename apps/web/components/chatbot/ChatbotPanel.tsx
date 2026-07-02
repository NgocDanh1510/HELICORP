"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useMemo, useState } from "react";
import { sendChatMessage, type ChatMessage } from "../../lib/services/chatbotService";

type ChatbotPanelProps = {
  onClose: () => void;
};

export function ChatbotPanel({ onClose }: ChatbotPanelProps) {
  const t = useTranslations("chatbot");
  const initialMessages = useMemo<ChatMessage[]>(() => [{ role: "assistant", content: t("greeting") }], [t]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();

    if (!message || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    const response = await sendChatMessage(
      message,
      nextMessages.filter((item) => item.content !== t("greeting"))
    );

    setIsSending(false);

    if (!response) {
      setMessages((currentMessages) => [...currentMessages, { role: "assistant", content: t("error") }]);
      return;
    }

    setMessages((currentMessages) => [...currentMessages, { role: "assistant", content: response.reply }]);
  };

  return (
    <aside className="w-[min(calc(100vw-40px),380px)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
        <div>
          <h2 className="font-semibold text-ink dark:text-white">{t("title")}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{t("subtitle")}</p>
        </div>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-aurora">
          {t("minimize")}
        </button>
      </div>

      <div className="max-h-[360px] space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-lg px-3 py-2 text-sm leading-6 ${
              message.role === "user"
                ? "ml-8 bg-aurora text-white"
                : "mr-8 bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isSending ? <p className="text-xs text-slate-500">{t("typing")}</p> : null}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none ring-aurora/20 focus:border-aurora focus:ring-4 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          placeholder={t("placeholder")}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="grid size-10 place-items-center rounded-lg bg-aurora text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          aria-label={t("send")}
        >
          <Send size={17} aria-hidden="true" />
        </button>
      </form>
    </aside>
  );
}
