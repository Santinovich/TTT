import { useContext, useState } from "react";
import "./AgregarSocio.css";
import {  DataContext } from "../context/DataContext";

function Agregar() {
  const dataContext = useContext(DataContext);

  const [isOpen, setIsOpen] = useState(false);
  
  // Nuevos estados para los inputs adicionales
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [nacimiento, setNacimiento] = useState(""); 

  const toggleVentana = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateSocio = async () => {
    const response = await fetch("/api/v1/socios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, apellido, numeroDni: dni, fechaNacimiento: nacimiento})
    });

    if (response.ok) {
      dataContext?.fetchSocios();
    }
  };

  // Función para borrar los datos de los inputs
  const handleDelete = () => {
    setNombre("");
    setApellido("");
    setDni("");
    setNacimiento(""); // Asegurarse de borrar también la fecha
  };

  return (
    <div className="Agregar">
      <button className="boton" onClick={toggleVentana}>
        {isOpen ? "Cerrar Socio" : "Agregar Socio"}
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={toggleVentana}>
          <div
            className="modal-content left-half"
            onClick={(e) => e.stopPropagation()} // Para evitar cerrar el modal al hacer clic dentro
          >
            <div className="modal-header">
              <h2 className="modal-header-text">Nuevo Socio</h2>
              <button className="add" onClick={handleCreateSocio}>
                Agregar
              </button>
              <button className="delete" onClick={handleDelete}>
                Borrar
              </button>
            </div>

            {/* INPUTS DE LA PESTAÑA NUEVO SOCIO */}
            <div className="input-container">
              <label htmlFor="nombre" className="hidden-label">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="in-name"
              />
              <label htmlFor="apellido" className="hidden-label">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="in-apellido"
              />
              <label htmlFor="dni" className="hidden-label">
                DNI
              </label>
              <input
                id="dni"
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="in-dni"
              />
              <label htmlFor="nacimiento" className="hidden-label">
                Nacimiento
              </label>
              <input
                id="nacimiento"
                type="date"
                placeholder="Nacimiento"
                value={nacimiento}
                onChange={(e) => setNacimiento(e.target.value)}
                className="in-nacimiento"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agregar;