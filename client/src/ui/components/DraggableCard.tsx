import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { X, Minus, Send } from "lucide-react";
import "react-resizable/css/styles.css";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface DraggableCardProps {
  title: string;
  children: React.ReactNode;
  aiAvatarUrl?: string; // Optional AI avatar URL
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  children,
  aiAvatarUrl = "/ai-assistant.png", // Default avatar
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleResize = (
    event: React.SyntheticEvent,
    { size: newSize }: { size: { width: number; height: number } },
  ) => {
    setSize(newSize);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div className="absolute z-50">
        <ResizableBox
          width={size.width}
          height={size.height}
          minConstraints={[200, 200]}
          maxConstraints={[800, 800]}
          onResize={handleResize}
          resizeHandles={["se"]}
          handle={
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 rounded-sm" />
            </div>
          }
        >
          <Card className="w-full h-full bg-gray-800/95 text-white shadow-xl border border-gray-600 backdrop-blur-sm">
            <div className="drag-handle cursor-move bg-gray-700 p-2 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* AI Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-green-500/50">
                  <img
                    src={aiAvatarUrl}
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-700" />
                </div>
                <span className="text-sm font-medium">{title}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-red-500/20 hover:text-red-400"
                  onClick={() => {
                    // Handle close action
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent
              className={`transition-all duration-200 flex flex-col ${
                isMinimized ? "h-0 p-0" : "p-4 h-[calc(100%-48px)]"
              }`}
            >
              {/* Messages Area */}
              <div className="flex-grow overflow-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2 mt-auto">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-grow resize-none rounded-md bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  className="px-3 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default DraggableCard;
