import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/router"; // ✅ import centralized routes

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
