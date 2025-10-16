import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/Navbar";
import Browse from "./pages/Browse";
import Create from "./pages/Create";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
        {/* Navbar stays on top of every page */}
        <Navbar />

        {/* Main Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/create" element={<Create />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
