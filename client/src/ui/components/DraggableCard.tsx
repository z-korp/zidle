import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { X, Minus, Send, MessageSquare, Settings, History } from "lucide-react";
import "react-resizable/css/styles.css";
import botAvatar from "/assets/AIagent_pfp/bot1.png"; // Importez l'image

type TabType = "chat" | "settings" | "history";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Action {
  id: number;
  action: string;
  timestamp: Date;
  status: "success" | "pending" | "error";
}

interface DraggableCardProps {
  title: string;
  children: React.ReactNode;
  aiAvatarUrl?: string; // Optional AI avatar URL
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  children,
  aiAvatarUrl = botAvatar, // Utilisez l'image importée comme valeur par défaut
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [actions] = useState<Action[]>([
    {
      id: 1,
      action: "Started streaming NFT #123",
      timestamp: new Date(),
      status: "success",
    },
    {
      id: 2,
      action: "Resource collection initiated",
      timestamp: new Date(),
      status: "pending",
    },
    // Exemples d'actions
  ]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <div className="flex flex-col h-full">
            {/* Messages Area avec padding ajusté */}
            <div className="flex-grow overflow-auto mb-6 space-y-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
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

            {/* Input Area avec meilleur espacement et style */}
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
      case "settings":
        return (
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">AI Settings</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Temperature</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">
                    Response Length
                  </label>
                  <select className="bg-gray-700 rounded-md p-2 text-sm">
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="memory" className="rounded" />
                  <label htmlFor="memory" className="text-sm text-gray-300">
                    Enable Memory
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="space-y-4 overflow-auto pr-2">
            {actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    action.status === "success"
                      ? "bg-green-500"
                      : action.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <div className="flex-grow">
                  <p className="text-sm">{action.action}</p>
                  <p className="text-xs text-gray-400">
                    {action.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
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
            <div className="drag-handle cursor-move bg-gray-700 p-2 rounded-t-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* AI Avatar - Taille augmentée */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/50">
                    <img
                      src={aiAvatarUrl}
                      alt="AI Assistant"
                      className="w-full h-full object-cover"
                    />
                    {/* Online indicator - Position ajustée */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700" />
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
              {/* Tabs */}
              <div className="flex border-b border-gray-600">
                <button
                  className={`px-3 py-1 text-sm transition-colors ${
                    activeTab === "chat"
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("chat")}
                >
                  <MessageSquare className="h-4 w-4 inline-block" />
                </button>
                <button
                  className={`px-3 py-1 text-sm transition-colors ${
                    activeTab === "history"
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  <History className="h-4 w-4 inline-block" />
                </button>
                <button
                  className={`px-3 py-1 text-sm transition-colors ${
                    activeTab === "settings"
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-4 w-4 inline-block" />
                </button>
              </div>
            </div>

            <CardContent
              className={`transition-all duration-200 flex flex-col ${
                isMinimized ? "h-0 p-0" : "p-4 h-[calc(100%-88px)]"
              }`}
            >
              {renderTabContent()}
            </CardContent>
          </Card>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default DraggableCard;
