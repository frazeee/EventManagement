import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Initial from "./Initial";
import NotFound from "./NotFound";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />

        <Route path="/registration-list" element={<App />} />

        <Route path="/bsa-admin" element={<Initial />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
