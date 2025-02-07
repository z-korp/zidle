import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { X, Minus, MessageSquare, Settings, Cloud } from "lucide-react";
import botAvatar from "/assets/AIagent_pfp/bot1.png";
import { ChatTab } from "./AIAssistant/ChatTab";
import { DreamingHistoryTab } from "./AIAssistant/DreamingHistoryTab";
import { SettingsTab } from "./AIAssistant/SettingsTab";
import { useDaydreamsWs } from "@/hooks/useDaydreams";
import { useDraggableCardStore } from "@/stores/useDraggableCardStore";

import "react-resizable/css/styles.css";

type TabType = "chat" | "settings" | "history";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

/*interface Action {
  id: number;
  action: string;
  timestamp: Date;
  status: "success" | "pending" | "error";
}*/

interface DraggableCardProps {
  title: string;
  children: React.ReactNode;
  aiAvatarUrl?: string; // Optional AI avatar URL
}

/**
 * DraggableCard Component
 * A draggable and resizable card that serves as an AI assistant interface
 * Features:
 * - Draggable positioning
 * - Resizable dimensions
 * - Multiple tabs (Chat, History, Settings)
 * - Real-time chat functionality
 * - Minimizable window
 */
const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  children,
  aiAvatarUrl = botAvatar, // Default to bot avatar if none provided
}) => {
  // WebSocket connection for AI communication
  const { sendMessage } = useDaydreamsWs();
  const {
    position,
    size,
    isMinimized,
    isVisible,
    activeTab,
    messages,
    inputText,
    setPosition,
    setSize,
    setIsMinimized,
    setIsVisible,
    setActiveTab,
    addMessage,
    setInputText,
  } = useDraggableCardStore();

  // Reference for auto-scrolling chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls chat to the bottom when new messages arrive
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handles card dragging and updates position
   */
  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  /**
   * Handles card resizing and updates dimensions
   */
  const handleResize = (
    event: React.SyntheticEvent,
    { size: newSize }: { size: { width: number; height: number } },
  ) => {
    setSize(newSize);
  };

  /**
   * Handles sending messages in chat
   * Creates new message object and sends via WebSocket
   */
  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        sender: "user",
        timestamp: new Date(),
      };
      addMessage(newMessage);
      setInputText("");
      sendMessage(inputText);
    }
  };

  /**
   * Renders the appropriate content based on active tab
   */
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
        return <DreamingHistoryTab />;
      case "settings":
        return <SettingsTab />;
    }
  };

  if (!isVisible) return null;

  return (
    // Draggable wrapper with bounds constraint
    <Draggable
      handle=".drag-handle"
      position={position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div className="absolute z-50">
        {/* Resizable container with handles */}
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
          {/* Main card content */}
          <Card className="w-full h-full bg-gray-800/95 text-white shadow-xl border border-gray-600 backdrop-blur-sm">
            {/* Draggable header area */}
            <div className="drag-handle cursor-move bg-gray-700 p-2 rounded-t-lg">
              {/* Header content with avatar and controls */}
              <div className="flex items-center justify-between mb-2">
                {/* Avatar and title section */}
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/50">
                    <img
                      src={aiAvatarUrl}
                      alt="AI Assistant"
                      className="w-full h-full object-cover"
                    />
                    {/* Online status indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700" />
                  </div>
                  <span className="text-sm font-medium">{title}</span>
                </div>
                {/* Window controls */}
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
                    onClick={() => setIsVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Tab navigation */}
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
                  <Cloud className="h-4 w-4 inline-block" />
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

            {/* Main content area with animation */}
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
