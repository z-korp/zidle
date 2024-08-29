import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./ui/elements/sonner";
import { Home } from "./ui/screens/Home";
import TestNFTs from "./ui/screens/TestNFTs";

export default () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestNFTs />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
};
