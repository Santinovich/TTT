import { DataProvider } from "./context/DataContext";
import Dashboard from "./components/Dashboard";
import Agregar from "./components/AgregarSocio";

function App() {
    return (
        <DataProvider>
            <Dashboard />
            <Agregar />
        </DataProvider>
    );
}

export default App;
