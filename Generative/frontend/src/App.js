import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import Dashboard from "./pages/Dashboard";
import CareerPath from "./pages/CareerPath";
import Courses from "./pages/Courses";
import MockTest from "./pages/MockTest";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import Roadmap from "./pages/Roadmap";
import LogoShowcase from "./pages/LogoShowcase";
import { AppProvider } from "./context/AppContext";

function AppContent() {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <div className="bg-white text-gray-900 transition-colors min-h-screen">
      <Navbar />
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/career-path" element={<CareerPath />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logo-showcase" element={<LogoShowcase />} />
        </Routes>
        
        {/* Floating Chat Button */}
        <button 
          onClick={() => setShowChatBot(!showChatBot)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40"
        >
          💬
        </button>
        
        {/* ChatBot Widget */}
        {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
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