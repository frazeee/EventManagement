import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Initial from "./Initial";
import { useState } from "react";

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (credentials) => {
    if (
      credentials.username === "admin" &&
      credentials.password === "password"
    ) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/login" element={<Login onLogin={login} />} />

        <Route
          path="/admin"
          element={
            isAuthenticated ? <Initial /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
