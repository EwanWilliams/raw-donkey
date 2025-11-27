import React, { useEffect, useState } from "react";
import { Analytics } from '@vercel/analytics/react';
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
import RecipeDetails from "./pages/details";
import Settings from "./pages/settings";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✅ Call this to check the current session cookie
  const validateUser = async () => {
    try {
      const result = await fetch("/api/auth/verify", {
        method: "HEAD",
        credentials: "include",
      });
      const ok = result.ok;
      setIsLoggedIn(ok);
      return ok;
    } catch (err) {
      console.error("Error validating user:", err);
      setIsLoggedIn(false);
      return false;
    }
  };

  // Run once on app load
  useEffect(() => {
    validateUser().finally(() => setCheckingAuth(false));
  }, []);

  // Called by <Login /> after a successful POST /api/auth/login
  const handleLogin = async () => {
    // Check cookie again after login
    await validateUser();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggedIn(false);
    }
  };

  // Simple protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // While checking initial auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse" element={<Browse />} />

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
  path="/login"
  element={
    <Login
      onLogin={handleLogin}
      onLogout={handleLogout}
      isLoggedIn={isLoggedIn}
    />
  }
/>



            <Route path="/recipe/:id" element={<RecipeDetails />} />
          </Routes>
        </main>
        <Analytics />
      </div>
    </Router>
  );
}
