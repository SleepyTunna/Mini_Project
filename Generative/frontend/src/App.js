import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import CareerPath from "./pages/CareerPath";
import Roadmap from "./pages/Roadmap";
import Flowchart from "./pages/Flowchart";
import AIChatBot from "./components/AIChatBot";
import { AppProvider } from "./context/AppContext";

function AppContent() {
  return (
    <div className="bg-white text-gray-800 transition-colors min-h-screen professional-background">
      <Navbar />
        
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/career-path" element={<CareerPath />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/flowchart" element={<Flowchart />} />
      </Routes>
      <AIChatBot />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}