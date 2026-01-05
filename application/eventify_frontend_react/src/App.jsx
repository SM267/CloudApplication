import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("userEmail"))
  );

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("userEmail");
    setLoggedIn(false);
  }

  return loggedIn ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
