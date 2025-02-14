import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "../../elements/button";
import { UserChatMessage } from "@/types/message";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { TypingIndicator } from "./TypingIndicator";

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
  }, [messages]);

  // Comment line 35 and uncomment line 36 to switch between real and test data
  // const displayMessages =
  //   process.env.NODE_ENV === "development" ? testMessages : messages;
  const displayMessages = messages;

  // Vérifie si le dernier message est de l'utilisateur
  const isWaitingForResponse =
    displayMessages.length > 0 &&
    displayMessages[displayMessages.length - 1].from === "user";

  return (
    <div className="h-full flex flex-col">
      {/* Messages list - flexible height */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {displayMessages.map((message) => (
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
            ))}
            {isWaitingForResponse && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input area - fixed height */}
      <div className="flex gap-2 mt-4 pt-2 pb-2 border-t border-gray-700">
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
