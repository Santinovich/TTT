import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPencil, faSave } from "@fortawesome/free-solid-svg-icons";
import { SelectedSocio } from "./SociosList";
import "./SocioEditor.css";
import { useEffect, useRef, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Barrio, Socio } from "../../context/DataContext";

function TextData({
  title,
  data,
  setNewData,
  isBeingEdited = false,
}: {
  title: string;
  data: string | number | null | undefined;
  setNewData?: React.Dispatch<React.SetStateAction<string>>;
  isBeingEdited?: boolean;
}) {
  if (!data) data = ""
  if (typeof data === "number") data = data.toString();
  const [inputValue, setInputValue] = useState(data);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (setNewData) {
      setNewData(e.target.value);
    }
  };

  return (
    <div className="socio-data">
      <span className="info-text">{title}</span>
      <div>
        {isBeingEdited ? (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
        ) : data !== "" ? (
          <span>{data} </span>
        ) : (
          <span className="no-data">Sin datos </span>
        )}
      </div>
    </div>
  );
}

export function SocioEditor({ selectedSocio, setSelectedSocio }: SelectedSocio) {
  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);

  const [newApellido, setNewApellido] = useState<string>("");
  const [newNombre, setNewNombre] = useState<string>("");
  const [newNumeroDni, setNewNumeroDni] = useState<string>("");
  const [newFechaNacimiento, setNewFechaNacimiento] = useState<string>("");

  const [newDomicilio, setDomicilio] = useState<string>("");
  const [newBarrio, setBarrio] = useState<Barrio | undefined>(undefined);

  const [newEmail, setEmail] = useState<string>("");
  const [newTelefono, setTelefono] = useState<string>("");

  useEffect(() => {
      setNewApellido("");
      setNewNombre("");
      setNewNumeroDni("");
      setNewFechaNacimiento("");
      setDomicilio("");
  }, [selectedSocio]);

  const handlePostNewData = () => {
    setIsBeingEdited(false);
    if (selectedSocio) {
      const newSocio: Socio = {
        id: selectedSocio.id,
        nombre: newNombre,
        apellido: newApellido,
        numeroDni: parseInt(newNumeroDni) || null,
        fechaNacimiento: new Date(newFechaNacimiento),
        ubicacion: null,
        contacto: null,
        isAfiliadoPj: false
      };
      console.log(newSocio)
    }
  };

  const handleCloseSocio = () => {
    setSelectedSocio(undefined);
    setIsBeingEdited(false);
    setNewApellido("");
    setNewNombre("");
    setNewNumeroDni("");
    setNewFechaNacimiento("");
  }

  const strNombre = (nombre: string, apellido?: string): string => {
    if (apellido) {
      return apellido + ", " + nombre;
    }
    return nombre;
  };

  function EditorButton({
    icon,
    onClick,
    visible = true,
  }: {
    icon: IconProp;
    onClick: () => void;
    visible: boolean;
  }) {
    return visible ? (
      <button onClick={onClick}>
        <FontAwesomeIcon icon={icon} width={"12px"} />
      </button>
    ) : null;
  }

  return (
    <div className="socio-editor-container">
      <div className="socio-editor">
        {!selectedSocio ? (
          <span className="info-text">Seleccionar un socio para detalles</span>
        ) : (
          <div className="data-container">
            <div className="data-group">
              <TextData
                title="Apellido y nombre"
                data={strNombre(selectedSocio.nombre, selectedSocio.apellido)}
                isBeingEdited={isBeingEdited}
              />
              <TextData
                title={"DNI"}
                data={selectedSocio.numeroDni}
                setNewData={setNewNumeroDni}
                isBeingEdited={isBeingEdited}
              />
              {selectedSocio.fechaNacimiento ? (
                <TextData
                  title="Fecha de nacimiento"
                  data={`${selectedSocio.fechaNacimiento.getDate()} / ${
                    selectedSocio.fechaNacimiento.getMonth() + 1
                  } / ${selectedSocio.fechaNacimiento.getFullYear()}`}
                  isBeingEdited={isBeingEdited}
                />
              ) : null}
            </div>
            <div className="data-group">
              <TextData
                title="Domicilio"
                data={selectedSocio.ubicacion?.domicilio}
                setNewData={setDomicilio}
                isBeingEdited={isBeingEdited}
              />
              {/* <TextData
                title={"Barrio"}
                data={
                  selectedSocio.ubicacion?.barrio
                    ? selectedSocio.ubicacion?.barrio?.nombre +
                      ", comuna " +
                      selectedSocio.ubicacion?.barrio?.comuna
                    : undefined
                }
              /> */}
              <TextData
                title="Teléfono"
                data={selectedSocio.contacto?.telefono}
                setNewData={setTelefono}
                isBeingEdited={isBeingEdited}
              />
              <TextData
                title="Email"
                data={selectedSocio.contacto?.correo}
                setNewData={setEmail}
                isBeingEdited={isBeingEdited}
              />
            </div>
            <div className="data-group">
              <span className="info-text">Información miscelánea</span>
              {selectedSocio.isAfiliadoPj ? <h3>Afiliado al Partido Justicialista</h3> : null}
              <div className="file-upload">
                <label className="file-label">
                  <input type="file" accept=".pdf,.jpg,.png" />
                  <p>📂 Cargar DNI</p>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="editor-buttons">
        <EditorButton icon={faClose} onClick={handleCloseSocio} visible={!!selectedSocio} />
        <EditorButton
          icon={faPencil}
          onClick={() => setIsBeingEdited(!isBeingEdited)}
          visible={!!selectedSocio}
        />
        <EditorButton
          icon={faSave}
          onClick={handlePostNewData}
          visible={!!selectedSocio && isBeingEdited}
        />
      </div>
    </div>
  );
}
