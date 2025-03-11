import { DataProvider } from "./context/DataContext";
import Dashboard from "./components/Dashboard";
import Componente from "./context/Componente";

function App() {
    return (
        <DataProvider>
            <Dashboard />
            <Componente />
        </DataProvider>
    );
}

export default App;
