"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { sendChatMessage, type ChatMessage } from "../../lib/services/chatbotService";
import { getProducts, type Product } from "../../lib/services/productService";

type ChatbotPanelProps = {
  onClose: () => void;
};

const suggestedPrompts = [
  "Điện thoại dưới 10 triệu",
  "Gợi ý điện thoại chơi game",
  "Điện thoại chụp ảnh đẹp",
  "So sánh iPhone và Samsung",
  "Sản phẩm bán chạy",
  "Điện thoại có pin tốt",
  "Chính sách bảo hành",
  "Hướng dẫn mua hàng"
];

export function ChatbotPanel({ onClose }: ChatbotPanelProps) {
  const t = useTranslations("chatbot");
  const initialMessages = useMemo<ChatMessage[]>(() => [{ role: "assistant", content: t("greeting") }], [t]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const result = await getProducts();
        setProductsList(result.products || []);
      } catch (err) {
        console.error("Failed to load products in chatbot", err);
      }
    }
    void load();
  }, []);

  const sendMessage = async (messageText: string) => {
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: messageText }];
    setMessages(nextMessages);
    setIsSending(true);

    const response = await sendChatMessage(
      messageText,
      nextMessages.filter((item) => item.content !== t("greeting"))
    );

    setIsSending(false);

    if (!response) {
      setMessages((currentMessages) => [...currentMessages, { role: "assistant", content: t("error") }]);
      return;
    }

    setMessages((currentMessages) => [...currentMessages, { role: "assistant", content: response.reply }]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();

    if (!message || isSending) {
      return;
    }

    setInput("");
    await sendMessage(message);
  };

  const handleSuggestionClick = async (prompt: string) => {
    if (isSending) {
      return;
    }
    await sendMessage(prompt);
  };

  const renderMessageContent = (content: string, role: string) => {
    if (role === "user") {
      return <span>{content}</span>;
    }

    const cardRegex = /\[ProductCard:\s*([a-zA-Z0-9-]+)\]/g;
    const cleanText = content.replace(cardRegex, "").trim();
    const matches = Array.from(content.matchAll(cardRegex));
    const slugs = matches.map((m) => m[1]);

    return (
      <div className="space-y-2.5">
        {cleanText && <p className="whitespace-pre-line">{cleanText}</p>}

        {slugs.length > 0 && (
          <div className="mt-2 space-y-2">
            {slugs.map((slug) => {
              const product = productsList.find((p) => p.slug === slug);
              if (!product) return null;

              return (
                <div
                  key={slug}
                  className="flex gap-2.5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative aspect-[4/3] w-16 flex-shrink-0 overflow-hidden rounded bg-slate-55 bg-slate-100 dark:bg-slate-950">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h4 className="truncate text-xs font-bold text-slate-800 dark:text-white">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {product.price.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                    <Link
                      href={`/san-pham/${product.slug}.html`}
                      className="mt-1 self-start rounded bg-slate-900 px-2.5 py-1 text-[9px] font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
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
            {renderMessageContent(message.content, message.role)}
          </div>
        ))}

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="mt-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Câu hỏi gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void handleSuggestionClick(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:border-aurora hover:bg-slate-100 hover:text-aurora dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-aurora dark:hover:text-aurora transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

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
