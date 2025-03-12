import Header from "./pure/Header";
import SociosList from "./pure/SociosList";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { Socio } from "../context/DataContext";
import { SocioEditor } from "./pure/SocioEditor";

function Dashboard() {

    const [selectedSocio, setSelectedSocio] = useState<Socio>()

    useEffect(() => {
        console.log(selectedSocio)
    }, [selectedSocio])

    return (
        <>
            <Header />
            <div className="dashboard">
                <div className="main-container">
                    <h2>Socios</h2>
                    <SociosList selectedSocio={selectedSocio} setSelectedSocio={setSelectedSocio} />
                    <SocioEditor selectedSocio={selectedSocio} setSelectedSocio={setSelectedSocio} />
                </div>
            </div>
        </>
    );
}

export default Dashboard;
