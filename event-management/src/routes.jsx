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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/login" element={<Login />} />

        <Route path="/bsa-admin" element={<Initial />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
