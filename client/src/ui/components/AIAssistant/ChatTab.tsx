import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "../../elements/button";
import { UserChatMessage } from "@/types/message";

interface ChatTabProps {
  messages: UserChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  inputText,
  setInputText,
  handleSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("messages", messages);
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto mb-6 space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.timestamp}
              className={`flex ${
                message.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                  message.from === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {message.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-auto pt-2 pb-2 border-t border-gray-700">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow resize-none rounded-md bg-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px]"
          rows={1}
        />
        <Button
          onClick={handleSendMessage}
          className="px-4 bg-blue-600 hover:bg-blue-700 self-end h-[44px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
