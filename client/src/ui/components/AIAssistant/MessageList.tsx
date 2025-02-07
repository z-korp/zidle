import React, { useEffect, useRef } from "react";
import { useAgentStore } from "@/stores/useAgentStore";
import { DateTime } from "luxon";
import { ScrollArea } from "@/ui/elements/scroll-area";

export const MessagesList: React.FC = () => {
  // Comment line 8 and uncomment line 9 to switch between real and test data
  const { messages } = useAgentStore();
  //const messages = testMessages;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full min-h-0 flex-1">
      <div className="p-0 space-y-4">
        {messages.map((message, idx) => {
          // Format the timestamp with Luxon
          const formattedTime = DateTime.fromISO(
            message.timestamp,
          ).toLocaleString(DateTime.TIME_SIMPLE);

          // Define title and body based on the message type
          let title = "";
          let body = "";
          const emoji = message.emoji || "💬";

          switch (message.type) {
            case "welcome":
              title = "Welcome";
              body = message.message;
              break;
            case "response":
              title = "Response";
              body = message.message;
              break;
            case "error":
              title = "Error";
              body = message.error;
              break;
            case "goal_created":
              title = "Goal Created";
              body = `${message.data?.horizon.toUpperCase()} TERM - ${message.data?.description}`;
              break;
            case "goal_updated":
              title = "Goal Updated";
              body = message.data?.status;
              break;
            case "goal_completed":
              title = "Goal Completed";
              body = message.data?.description;
              break;
            case "goal_failed":
              title = "Goal Failed";
              body = `ID: ${message.data.id} – ${message.data.error}`;
              break;
            case "action_start":
              title = "Action Started";
              body = message.data?.actionType;
              break;
            case "action_complete":
              title = "Action Completed";
              body = message.data?.result;
              break;
            case "action_error":
              title = "Action Error";
              body = `(${message.data?.actionType}) ${message.data?.error}`;
              break;
            case "system":
              title = "System";
              body = message.message;
              break;
            case "thinking_start":
              title = "Thinking";
              body = message.message;
              break;
            case "thinking_end":
              title = "Thinking Complete";
              body = "";
              break;
            default:
              title = "Message";
              body = message || "";
          }

          if (message.type === "action_start") return;

          return (
            <div key={idx} className="p-3 bg-gray-800 rounded-lg shadow-md">
              {/* Header: date, title, and emoji */}
              <div className="flex justify-between items-center text-sm text-gray-100">
                <div className="flex items-center gap-1">
                  <span className="mr-1">{emoji}</span>
                  <span className="font-semibold">{title}</span>
                </div>
                <span>{formattedTime}</span>
              </div>
              {/* Body text */}
              {body && <div className="mt-1 text-xs text-gray-400">{body}</div>}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
