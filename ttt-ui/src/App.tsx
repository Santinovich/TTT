import { DataProvider } from "./context/DataContext";
import Dashboard from "./components/Dashboard";

function App() {
    return (
        <DataProvider>
            <Dashboard />
        </DataProvider>
    );
}

export default App;
