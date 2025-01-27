import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { X, Minus, MessageSquare, Settings, History } from "lucide-react";
import botAvatar from "/assets/AIagent_pfp/bot1.png";
import { ChatTab } from "./AIAssistant/ChatTab";
import { HistoryTab } from "./AIAssistant/HistoryTab";
import { SettingsTab } from "./AIAssistant/SettingsTab";
import { useDaydreamsWs } from "@/hooks/useDaydreams";
import { useAgentStore } from "@/stores/useAgentStore";

import "react-resizable/css/styles.css";

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
  const { sendMessage } = useDaydreamsWs();
  const { messages: messagesBack } = useAgentStore();

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
    console.log(messagesBack);
  }, [messagesBack]);

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
          <ChatTab
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={handleSendMessage}
          />
        );
      case "history":
        return <HistoryTab actions={actions} />;
      case "settings":
        return <SettingsTab />;
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
