import React, { useEffect, useRef, useState } from "react";
import { useAgentStore } from "@/stores/useAgentStore";
import { DateTime } from "luxon";
import { ScrollArea } from "@/ui/elements/scroll-area";

export const MessagesList: React.FC = () => {
  const { messages } = useAgentStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<{[key: string]: boolean}>({});

  const toggleExpand = (idx: number) => {
    setExpandedMessages(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const renderMessageContent = (message: any) => {
    if (message.type === "chat_reply") {
      try {
        const parsedContent = JSON.parse(message.message);
        return parsedContent.message;
      } catch {
        return message.message;
      }
    }

    if (typeof message.message === 'object') {
      return JSON.stringify(message.message, null, 2);
    }
    
    return message.message || '';
  };

  const renderDetails = (message: any) => {
    switch (message.type) {
      case "goal_created":
      case "goal_completed":
      case "goal_updated":
        return message.data ? (
          <pre className="text-xs bg-gray-900 p-2 rounded mt-2">
            {JSON.stringify(message.data, null, 2)}
          </pre>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full min-h-0 flex-1">
      <div className="p-0 space-y-4">
        {messages.map((message, idx) => {
          const formattedTime = DateTime.fromISO(
            message.timestamp,
          ).toLocaleString(DateTime.TIME_SIMPLE);

          if (message.type === "action_start") return null;

          const hasDetails = ["goal_created", "goal_completed", "goal_updated"].includes(message.type);
          let title = "";
          let body = "";

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

          return (
            <div key={idx} className="p-3 bg-gray-800 rounded-lg shadow-md">
              <div 
                className={`flex justify-between items-center text-sm text-gray-100 ${hasDetails ? 'cursor-pointer' : ''}`}
                onClick={() => hasDetails && toggleExpand(idx)}
              >
                <div className="flex items-center gap-1">
                  <span className="mr-1">{message.emoji || '💬'}</span>
                  <span className="font-semibold">{message.type}</span>
                  {hasDetails && (
                    <span className="text-xs ml-2">
                      {expandedMessages[idx] ? '🔽' : '▶️'}
                    </span>
                  )}
                </div>
                <span>{formattedTime}</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {renderMessageContent(message)}
              </div>
              {expandedMessages[idx] && renderDetails(message)}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
