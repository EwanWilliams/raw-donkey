import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,          
} from "react-router-dom";

import Navbar from "./pages/components/navbar";
import Browse from "./pages/browse";
import Create from "./pages/create";
import Login from "./pages/login";
import Settings from "./pages/settings";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUsername(name);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const ProtectedRoute2 = ({ children }) => {
    if (isLoggedIn) {
      return <Navigate to="/browse" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
        <Navbar
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>}/>
            <Route path="/login" element={<ProtectedRoute2><Login onLogin={handleLogin} /></ProtectedRoute2>}/>
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}
