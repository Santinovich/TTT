import Header from "./pure/Header";
import SociosList from "./pure/SociosList";
import "./Dashboard.css";

function Dashboard() {
    return (
        <>
            <Header />
            <div className="dashboard">
                <div className="main-container">
                    <h2>Socios</h2>
                    <SociosList />
                </div>
            </div>
        </>
    );
}

export default Dashboard;
