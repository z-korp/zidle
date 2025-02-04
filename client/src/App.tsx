import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./ui/elements/sonner";
import { Home } from "./ui/screens/Home";
import { StreamingScreen } from "./ui/screens/StreamingScreen";
import { TooltipProvider } from "@/ui/elements/tooltip";
import DraggableCard from "./ui/components/DraggableCard";

import background from "/assets/bg-nuage.png";
import { useGameEventsExperimental } from "./hooks/useGameEventsExperimental";

export default function App() {
  useGameEventsExperimental();
  return (
    <TooltipProvider>
      <Router>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${background}')` }}
          />
          <DraggableCard title="AIdwin">
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
        <Toaster position="bottom-right" />
      </Router>
    </TooltipProvider>
  );
}
