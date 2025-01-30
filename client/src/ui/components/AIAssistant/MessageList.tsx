import React, { useEffect, useRef } from "react";
import { useAgentStore } from "@/stores/useAgentStore";
import { DateTime } from "luxon";

export const MessagesList: React.FC = () => {
  const { messages } = useAgentStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-2 overflow-y-auto">
      {messages.map((message, idx) => {
        // Format timestamp using Luxon
        const formattedTime = DateTime.fromISO(
          message.timestamp,
        ).toLocaleString(DateTime.TIME_SIMPLE);

        // Default emoji if none provided
        const emoji = message.emoji || "💬";

        let content = "";

        switch (message.type) {
          case "welcome":
            content = `[${formattedTime}] ${emoji} ${message.message}`;
            break;
          case "response":
            content = `[${formattedTime}] ${emoji} Response: ${message.message}`;
            break;
          case "error":
            content = `[${formattedTime}] ${emoji} Error: ${message.error}`;
            break;
          case "goal_created":
            content = `[${formattedTime}] ${emoji} Goal Created: ${message.data.description}`; // (ID: ${message.data.id})`;
            break;
          case "goal_updated":
            content = `[${formattedTime}] ${emoji} Goal Updated: ${message.data.status}`; // (ID: ${message.data.id})`;
            break;
          case "goal_completed":
            content = `[${formattedTime}] ${emoji} Goal Completed: ${message.data.result}`; // (ID: ${message.data.id})`;
            break;
          case "goal_failed":
            content = `[${formattedTime}] ${emoji} Goal Failed (ID: ${message.data.id}): ${message.data.error}`;
            break;
          case "action_start":
            content = `[${formattedTime}] ${emoji} Action Started: ${message.data.actionType}`;
            break;
          case "action_complete":
            content = `[${formattedTime}] ${emoji} Action Completed: ${message.data.actionType}`; // - Result: ${JSON.stringify(  message.data.result,)}`;
            break;
          case "action_error":
            content = `[${formattedTime}] ${emoji} Action Error (${message.data.actionType}): ${message.data.error}`;
            break;
          case "system":
            content = `[${formattedTime}] ${emoji} System: ${message.message}`;
            break;
          default:
            content = `[${formattedTime}] ${emoji} Unknown message type`;
        }

        return (
          <div key={idx} className="text-sm leading-relaxed mt-2">
            {content}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
