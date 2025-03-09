import { DataProvider } from "./context/DataContext";
import SociosList from "./components/sociosList";

function App() {
  return (
    <DataProvider>
      <SociosList />
    </DataProvider>
  );
}

export default App;
