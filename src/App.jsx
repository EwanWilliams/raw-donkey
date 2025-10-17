import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/navbar";
import Browse from "./pages/browse";
import Create from "./pages/create";
import Login from "./pages/login";

export default function App() {
  // Track login state here
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Functions to change login status
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
        {/* Navbar always visible */}
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/create" element={<Create />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

