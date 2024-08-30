import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./ui/elements/sonner";
import { Home } from "./ui/screens/Home";

import background from "/assets/bg-nuage.png";

export default () => {
  return (
    <Router>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${background}')` }}
        />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
};
