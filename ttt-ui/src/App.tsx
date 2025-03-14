import { DataProvider } from "./context/DataContext";
import Dashboard from "./components/Dashboard";
import ToastContainer from "./components/pure/ToastContainer";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <Dashboard />
        <ToastContainer />
      </ToastProvider>
    </DataProvider>
  );
}

export default App;
