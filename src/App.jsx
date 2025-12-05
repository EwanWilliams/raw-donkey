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
  const [username, setUsername] = useState("");   // 👈 username from JWT (via backend)

  // 🌙 THEME STATE
  const [theme, setTheme] = useState("light");

  // ------ FETCH USER DETAILS (username, etc.) ------
  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/user/details", {
        credentials: "include",
      });
      if (!res.ok) {
        setUsername("");
        return;
      }
      const data = await res.json();
      if (data?.username) {
        setUsername(data.username);
      } else {
        setUsername("");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setUsername("");
    }
  };

  // ------ AUTH VALIDATION ------
  const validateUser = async () => {
    try {
      const result = await fetch("/api/auth/verify", {
        method: "HEAD",
        credentials: "include",
      });
      const ok = result.ok;
      setIsLoggedIn(ok);

      if (ok) {
        await fetchUserDetails();
      } else {
        setUsername("");
      }

      return ok;
    } catch (err) {
      console.error("Error validating user:", err);
      setIsLoggedIn(false);
      setUsername("");
      return false;
    }
  };

  useEffect(() => {
    validateUser().finally(() => setCheckingAuth(false));
  }, []);

  const handleLogin = async () => {
    const ok = await validateUser();
    if (ok) {
      await fetchUserDetails();
    }
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
      setUsername("");   // 
    }
  };

  // ------ THEME SETUP ------
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // ------ PROTECTED ROUTE ------
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  if (checkingAuth) return <p>Loading...</p>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
          username={username}     
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
                  isLoggedIn={isLoggedIn}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
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
