import { useState } from "react";
import "./AgregarSocio.css";

function Agregar() {
  const [isOpen, setIsOpen] = useState(false);

  // Nuevos estados para los inputs adicionales
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [barrio, setBarrio] = useState("");
  const [nacimiento, setNacimiento] = useState(""); // Mantener el valor inicial vacío

  const toggleVentana = () => {
    setIsOpen(!isOpen);
  };

  // Función para borrar los datos de los inputs
  const handleDelete = () => {
    setNombre("");
    setApellido("");
    setDni("");
    setDomicilio("");
    setBarrio("");
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
              <button className="add">Agregar</button>
              <button className="delete" onClick={handleDelete}>Borrar</button>
            </div>
            
            {/* Inputs de nuevo socio */}
            <div className="input-container">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="in-name"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="in-apellido"
              />
              <input
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="in-dni"
              />
              <input
                type="text"
                placeholder="Domicilio"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
                className="in-domicilio"
              />
              <input
                type="text"
                placeholder="Barrio"
                value={barrio}
                onChange={(e) => setBarrio(e.target.value)}
                className="in-barrio"
              />
              <input
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

