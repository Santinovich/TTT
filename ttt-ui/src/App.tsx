import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import Dashboard from "./routes/Dashboard";
import ToastContainer from "./components/ToastContainer";
import Login from "./routes/Login";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
          <ToastContainer />
        </DataProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
