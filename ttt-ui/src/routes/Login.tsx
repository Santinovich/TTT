import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";

import "./Login.css";

export default function Login() {
  const dataContext = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  if (dataContext) {
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      dataContext.login(username, password);
    };

    return (
      <>
        <div className="login">
          <div className="login-container">
            <h2>Inicio de sesión</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="username"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
