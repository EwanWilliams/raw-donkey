import React, { useEffect, useState } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🔍 Check auth status from backend on app load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", // important for cookies
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          setUsername("");
          return;
        }

        const data = await res.json();

        if (data?.username) {
          setIsLoggedIn(true);
          setUsername(data.username);
        } else {
          setIsLoggedIn(false);
          setUsername("");
        }
      } catch (err) {
        console.error("Auth verify error:", err);
        setIsLoggedIn(false);
        setUsername("");
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyAuth();
  }, []);

  // Called after successful /api/auth/login on Login page
  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUsername(name);
  };

  // Optional: also call a logout endpoint if you have one
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
      setUsername("");
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // For routes that should NOT be visible when logged in (e.g. /login)
  const ProtectedRoute2 = ({ children }) => {
    if (isLoggedIn) {
      return <Navigate to="/browse" replace />;
    }
    return children;
  };

  // Tiny loading state while we check /api/auth/verify
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                <ProtectedRoute2>
                  <Login onLogin={handleLogin} />
                </ProtectedRoute2>
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}
