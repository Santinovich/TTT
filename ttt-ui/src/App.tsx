import { DataProvider } from "./context/DataContext";
import Dashboard from "./components/Dashboard";
import ToastContainer from "./components/pure/ToastContainer";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <Dashboard />
        <ToastContainer />
      </DataProvider>
    </ToastProvider>
  );
}

export default App;
