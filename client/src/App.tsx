import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./ui/elements/sonner";
import { Home } from "./ui/screens/Home";
import { StreamingScreen } from "./ui/screens/StreamingScreen";
import { TooltipProvider } from "@/ui/elements/tooltip";
import DraggableCard from "./ui/components/DraggableCard";
import { Button } from "./ui/elements/button";
import { MessageSquare } from "lucide-react";
import { useDraggableCardStore } from "@/stores/useDraggableCardStore";

import background from "/assets/bg-nuage.png";
import { useGameEventsExperimental } from "./hooks/useGameEventsExperimental";

export default function App() {
  useGameEventsExperimental();
  const { isVisible, setIsVisible } = useDraggableCardStore();

  return (
    <TooltipProvider>
      <Router>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${background}')` }}
          />
          <DraggableCard>
            <div className="space-y-4">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span>Active Streams example:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total Resources example:</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Duration example:</span>
                  <span className="font-medium">2h 15m</span>
                </div>
              </div>
            </div>
          </DraggableCard>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stream/:id?" element={<StreamingScreen />} />
        </Routes>
        {!isVisible && (
          <Button
            onClick={() => setIsVisible(true)}
            className="fixed bottom-4 right-4 z-50 bg-gray-800/95 text-white shadow-xl border border-gray-600 backdrop-blur-sm hover:bg-gray-700/95"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Show Assistant
          </Button>
        )}
        <Toaster position="bottom-right" />
      </Router>
    </TooltipProvider>
  );
}
