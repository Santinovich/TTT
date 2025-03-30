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
        <div className="logo">
          <img src={TTT} alt="TTT" />
          <span> TTT</span>
        </div>

        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    );
  }
}

export default Header;
