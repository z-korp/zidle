import React, { useState } from "react";
import Draggable from "react-draggable";
import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { X, Minus } from "lucide-react";

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

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div className="absolute z-50">
        <Card className="w-[300px] bg-gray-800/95 text-white shadow-xl border border-gray-600 backdrop-blur-sm">
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
            className={`transition-all duration-200 ${
              isMinimized ? "h-0 p-0 overflow-hidden" : "p-4"
            }`}
          >
            {children}
          </CardContent>
        </Card>
      </div>
    </Draggable>
  );
};

export default DraggableCard;
