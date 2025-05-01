import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./app/router"; // ✅ import centralized routes

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;