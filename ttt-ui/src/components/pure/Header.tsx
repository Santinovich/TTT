import "./Header.css";
import TTT from "../../assets/ttt.png";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

function Header() {
  const dataContext = useContext(DataContext);
  if (dataContext) {
    const { token, setToken } = dataContext;

    const handleLogout = () => {
        if (token) {
            localStorage.removeItem("token");
            setToken(null);
            window.location.href = "/login";
        }
    };

    return (
        <div className="header">
            <button className="logo">
                <img src={TTT} alt="TTT" />
                <span>TTT</span>
            </button>
            <div className="buttons">
                <button>Acerca de</button>
                {!window.location.href.includes("/login") ? (
                    <button onClick={handleLogout}>Cerrar sesión</button>
                ) : null}
            </div>
        </div>
    );
  }
}

export default Header;
