"use client";

import { Bot, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ChatbotPanel = dynamic(() => import("./ChatbotPanel").then((module) => module.ChatbotPanel), {
  ssr: false,
  loading: () => null
});

export function ChatbotMount() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("chatbot");

  return (
    <div className="fixed bottom-5 right-5 z-30">
      {isOpen ? <ChatbotPanel onClose={() => setIsOpen(false)} /> : null}
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="mt-3 grid size-12 place-items-center rounded-full bg-aurora text-white shadow-soft"
        aria-label={isOpen ? t("close") : t("open")}
      >
        {isOpen ? <X size={21} aria-hidden="true" /> : <Bot size={22} aria-hidden="true" />}
      </button>
    </div>
  );
}
