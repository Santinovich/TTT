import { SelectedSocio } from "./SociosList";
import "./SocioEditor.css";

export function SocioData({ title, data }: { title: string; data: string | number | null | undefined }) {
  return (
    <div className="socio-data">
      <span className="info-text">{title}</span>
      {data !== null && data !== undefined ? <h3>{data}</h3> : <h3 className="no-data">Sin datos</h3>}
    </div>
  );
}

export function SocioEditor({ selectedSocio, setSelectedSocio }: SelectedSocio) {
  return (
    <div className="socio-editor-container">
      {!selectedSocio ? (
        <span className="info-text">Seleccionar un socio para detalles</span>
      ) : (
        <div className="socio-editor">
          <div className="data-group">
            <SocioData
              title="Apellido y nombre"
              data={selectedSocio.apellido + ", " + selectedSocio.nombre}
            />
            <SocioData title={"DNI"} data={selectedSocio.numeroDni} />
            {selectedSocio.fechaNacimiento ? (
              <SocioData
                title="Fecha de nacimiento"
                data={`${selectedSocio.fechaNacimiento.getDate()} / ${
                  selectedSocio.fechaNacimiento.getMonth() + 1
                } / ${selectedSocio.fechaNacimiento.getFullYear()}`}
              />
            ) : null}
          </div>
          <div className="data-group">
            <SocioData title={"Domicilio"} data={selectedSocio.ubicacion?.domicilio} />
            <SocioData
              title={"Barrio"}
              data={
                selectedSocio.ubicacion?.barrio
                  ? selectedSocio.ubicacion?.barrio?.nombre +
                    ", comuna " +
                    selectedSocio.ubicacion?.barrio?.comuna
                  : null
              }
            />
            <SocioData title="Teléfono" data={selectedSocio.contacto?.telefono} />
            <SocioData title="Email" data={selectedSocio.contacto?.correo} />
          </div>
          <div className="data-group">
            <span className="info-text">Información miscelánea</span>
            {
              selectedSocio.isAfiliadoPj ? (
                <h3>Afiliado al Partido Justicialista</h3>
              ):null
            }
          </div>
        </div>
      )}
    </div>
  );
}
