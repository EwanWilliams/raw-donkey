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
import RecipeDetails from "./pages/details";
import Settings from "./pages/settings";

export default function App() {
  

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
            <Route path="/create" element={<Create />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/settings"element={<Settings />}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}