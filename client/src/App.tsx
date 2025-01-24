import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./ui/elements/sonner";
import { Home } from "./ui/screens/Home";
import { StreamingScreen } from "./ui/screens/StreamingScreen";
import { TooltipProvider } from "@/ui/elements/tooltip";

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
