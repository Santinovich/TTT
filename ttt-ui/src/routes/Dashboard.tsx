import Header from "../components/pure/Header";
import SociosList from "../components/SociosList";
import "./Dashboard.css";
import { useState } from "react";
import { Socio } from "../context/DataContext";

function Dashboard() {
  const [selectedSocio, setSelectedSocio] = useState<Socio>();

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="main-container">
          <h2>Socios</h2>
          <SociosList selectedSocio={selectedSocio} setSelectedSocio={setSelectedSocio} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
