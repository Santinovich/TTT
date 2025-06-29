import { useContext, useEffect, useState } from "react";
import SociosList from "../components/sections/SociosList";
import "./Dashboard.css";
import { SocioDto } from "ttt-shared/dto/socio.dto";
import { DataContext } from "../context/DataContext";

function Dashboard() {
  const dataContext = useContext(DataContext);
  if (!dataContext) return;

  const [selectedSocio, setSelectedSocio] = useState<SocioDto | null>(null);

  // Se actualiza el socio seleccionado si sus datos cambiaron para evitar que se cierre el detalle
  useEffect(() => {
    const i = dataContext.socios.findIndex(s => s.id === selectedSocio?.id);
    if (selectedSocio && i !== -1) {
      setSelectedSocio(dataContext.socios[i]);
    }
  }, [dataContext.socios]);

  return (
    <>
      <div className="dashboard">
        <div className="main-container">
          <SociosList selectedSocio={selectedSocio} setSelectedSocio={setSelectedSocio}/>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
