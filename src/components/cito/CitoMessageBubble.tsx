import type { ReactNode } from "react";
import { Bot, User } from "lucide-react";
import type { CitoMessage } from "../../types";

interface CitoMessageBubbleProps {
  message: CitoMessage;
  children?: ReactNode;
}

function formatTimestamp(timestamp: string) {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }

  return parsed.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CitoMessageBubble({ message, children }: CitoMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[92%] space-y-2">
        <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
              isUser
                ? "border-accent-gold/30 bg-accent-gold/15 text-accent-gold"
                : "border-white/10 bg-navy-900 text-silver-200"
            }`}
          >
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>

          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isUser
                ? "rounded-br-md bg-accent-gold text-navy-950"
                : "rounded-bl-md border border-white/10 bg-navy-800 text-silver-100"
            }`}
          >
            <p className="text-sm leading-6">{message.text}</p>
            <p className={`mt-2 text-[11px] ${isUser ? "text-navy-800/80" : "text-silver-400"}`}>
              {formatTimestamp(message.timestamp)}
            </p>
          </div>
        </div>

        {children ? <div className={isUser ? "mr-10" : "ml-10"}>{children}</div> : null}
      </div>
    </div>
  );
}
