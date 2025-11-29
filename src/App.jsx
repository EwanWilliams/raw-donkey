// App.jsx
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
import RecipeDetails from "./pages/details";
import Settings from "./pages/settings";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🌙 THEME STATE
  const [theme, setTheme] = useState("light");

  // ------ AUTH VALIDATION ------
  const validateUser = async () => {
    try {
      const result = await fetch("/api/auth/verify", {
        method: "HEAD",
        credentials: "include",
      });
      const ok = result.ok;
      setIsLoggedIn(ok);
      return ok;
    } catch {
      setIsLoggedIn(false);
      return false;
    }
  };

  useEffect(() => {
    validateUser().finally(() => setCheckingAuth(false));
  }, []);

  const handleLogin = async () => {
    await validateUser();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsLoggedIn(false);
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
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse" element={<Browse />} />

            <Route path="/create" element={
              <ProtectedRoute><Create /></ProtectedRoute>
            }/>

            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            }/>

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
      </div>
    </Router>
  );
}
