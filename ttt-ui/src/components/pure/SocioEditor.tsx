import { SelectedSocio } from "./SociosList";
import "./SocioEditor.css";

export function SocioEditor({ selectedSocio, setSelectedSocio }: SelectedSocio) {
  return (
    <div className="socio-editor-container">
      {!selectedSocio ? (
        <span className="info-text">Seleccionar un socio para detalles</span>
      ) : (
        <div className="socio-editor">
          <div className="col50">
            <h2>
              {selectedSocio.apellido}, {selectedSocio.nombre}
            </h2>
            {selectedSocio.ubicacion ? (
              <>
                <h4>
                  Comuna {selectedSocio.ubicacion?.barrio?.comuna},{" "}
                  {selectedSocio.ubicacion?.barrio?.nombre}
                </h4>
                <span>{selectedSocio.ubicacion.domicilio}</span>
              </>
            ) : (
              "Sin datos de ubicacion"
            )}
          </div>
          <div className="col50">
            <div className="col personales">
              <span>DNI {selectedSocio.numeroDni}</span>

              {(selectedSocio.fechaNacimiento ? (
                <span>
                    {selectedSocio.fechaNacimiento.getDate()}/{selectedSocio.fechaNacimiento.getMonth()+1}/{selectedSocio.fechaNacimiento.getFullYear()}
                </span>
              ) : null)}
 
              
            </div>
            <div className="col contacto">
              <h3>Contacto</h3>
              <span>
                Telefono:{" "}
                {selectedSocio.contacto?.telefono ? selectedSocio.contacto?.telefono : "Sin datos"}
              </span>
              <span>
                Email:{" "}
                {selectedSocio.contacto?.correo ? selectedSocio.contacto?.correo : "Sin datos"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
