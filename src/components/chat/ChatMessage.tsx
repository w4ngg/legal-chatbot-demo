import type { ReactNode } from "react";

interface ChatMessageProps {
  role: "assistant" | "user";
  children: ReactNode;
}

export function ChatMessage({ role, children }: ChatMessageProps) {
  if (role === "user") {
    return <div className="flex justify-end">{children}</div>;
  }

  return <div className="flex justify-start">{children}</div>;
}

