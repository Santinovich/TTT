import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose, faPencil, faSave } from "@fortawesome/free-solid-svg-icons";
import { SelectedSocio } from "./SociosList";
import { useContext, useEffect, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Barrio, DataContext } from "../../context/DataContext";

import "./SocioEditor.css";
import { CreateSocio } from "./CreateSocio";
import { ToastContext } from "../../context/ToastContext";

const dateToSQLiteString = (date: Date): string => {
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  console.log(dateStr)
  return dateStr
}

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
  if (!data) data = "";
  if (typeof data === "number") data = data.toString();
  const [inputValue, setInputValue] = useState(data);

  useEffect(() => {
    if (!data) data = ""
    if (typeof data === "number") data = data.toString();
    setInputValue(data);
  }, [data])


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

function DateData({
  title,
  data,
  setNewData,
  isBeingEdited = false,
}: {
  title: string;
  data: Date | undefined;
  setNewData?: React.Dispatch<React.SetStateAction<string>>;
  isBeingEdited?: boolean;
}) {
  const [inputValue, setInputValue] = useState(data ? dateToSQLiteString(data) : "");

  useEffect(() => {
    setInputValue(data ? dateToSQLiteString(data): "");
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("dentro del input", e.target.value)
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
            type="date"
            value={inputValue}
            onChange={handleInputChange}
          />
        ) : data ? (
          <span>{data.toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
        ) : (
          <span className="no-data">Sin datos</span>
        )}
      </div>
    </div>
  );
}

function BooleanData({
  title,
  value,
  setNewValue,
  isBeingEdited = false,
}: {
  title: string;
  value: boolean;
  setNewValue?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isBeingEdited?: boolean;
}) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.checked);
    if (setNewValue) {
      setNewValue(e.target.checked);
    }
  };

  return (
    <div className="socio-data">
      <span className="info-text">{title}</span>
      <div>
        {isBeingEdited ? (
          <input type="checkbox" checked={inputValue} onChange={handleInputChange} />
        ) : (
          <span>{value ? "Sí" : "No"} </span>
        )}
      </div>
    </div>
  );
}

function BarrioData({
  title,
  value,
  setNewValue,
  isBeingEdited = false,
}: {
  title: string;
  value: Barrio | undefined;
  setNewValue: React.Dispatch<React.SetStateAction<Barrio | undefined>>;
  isBeingEdited?: boolean;
}) {
  const dataContext = useContext(DataContext);

  const [inputValue, setInputValue] = useState(value?.id || undefined);

  useEffect(() => {
    if (!value) return;
    setInputValue(value.id);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(parseInt(e.target.value));
    setNewValue(dataContext?.barrios.find(b => b.id === parseInt(e.target.value)));
    console.log(e.target.value)
  };

  return (
    <div className="socio-data">
      <span className="info-text">{title}</span>
      <div>
        {isBeingEdited && dataContext ? (
          <select value={inputValue} onChange={handleInputChange}>
            <option key={-1} value={-1}></option>
            {dataContext.barrios.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        ) : value ? (
          <span>{value.nombre}</span>
        ) : (
          <span className="info-text">Sin datos</span>
        )}
      </div>
    </div>
  );
}


export function SocioEditor({ selectedSocio, setSelectedSocio }: SelectedSocio) {
  const dataContext = useContext(DataContext);
  const toastContext = useContext(ToastContext);

  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);
  const [isCreateSocioVisible, setCreateSocioVisible] = useState<boolean>(false);

  const [newApellido, setNewApellido] = useState<string>("");
  const [newNombre, setNewNombre] = useState<string>("");
  const [newNumeroDni, setNewNumeroDni] = useState<string>("");
  const [newFechaNacimiento, setNewFechaNacimiento] = useState<string>("");
  const [newIsAfiliadoPj, setNewIsAfiliadoPj] = useState<boolean | undefined>(undefined);

  const [newDomicilio, setNewDomicilio] = useState<string>("");
  const [newBarrio, setNewBarrio] = useState<Barrio | undefined>(undefined);

  const [newEmail, setEmail] = useState<string>("");
  const [newTelefono, setTelefono] = useState<string>("");

  useEffect(() => {
      setNewApellido("");
      setNewNombre("");
      setNewNumeroDni("");
      setNewFechaNacimiento("");
      setNewBarrio(undefined)
      setNewDomicilio("");
      setNewIsAfiliadoPj(undefined);
      setEmail("");
      setTelefono("");

  }, [selectedSocio]);

  useEffect(() => {
    setSelectedSocio(dataContext?.getSocio(selectedSocio ? selectedSocio.id : -1));
  }, [dataContext?.socios])

  const handlePostNewData = async () => {
    setIsBeingEdited(false);
    if (selectedSocio) {
      let newUbicacion = undefined;
      let newContacto = undefined;

      if (newDomicilio || newBarrio) {
        newUbicacion = {
          domicilio: newDomicilio || selectedSocio.ubicacion?.domicilio,
          barrio: newBarrio || selectedSocio.ubicacion?.barrio,
        };
      }
      if (newTelefono || newEmail) {
        newContacto = {
          telefono: parseInt(newTelefono) || undefined,
          correo: newEmail || undefined,
        };
      }
    
      const newData = {
        nombre: newNombre || undefined,
        apellido: newApellido || undefined,
        numeroDni: parseInt(newNumeroDni) || undefined,
        fechaNacimiento: newFechaNacimiento ? newFechaNacimiento + "T03:00:00Z" : undefined,
        isAfiliadoPj: newIsAfiliadoPj === undefined ? selectedSocio.isAfiliadoPj : newIsAfiliadoPj,
        ubicacion: newUbicacion,
        contacto: newContacto,
      };

      const response = await fetch("/api/v1/socios/" + selectedSocio.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (response.ok) {
        dataContext?.fetchSocios();
        const {message} = await response.json();
        toastContext?.addToast({text: message});
      } else {
        const {error} = await response.json();
        toastContext?.addToast({text: error || "Error desconocido al actualizar socio.", type: "error"});
      }
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
              <TextData title="Nombre" data={selectedSocio.nombre} setNewData={setNewNombre} isBeingEdited={isBeingEdited}/>
              <TextData title="Apellido" data={selectedSocio.apellido} setNewData={setNewApellido} isBeingEdited={isBeingEdited} />
              <TextData title="DNI" data={selectedSocio.numeroDni} setNewData={setNewNumeroDni} isBeingEdited={isBeingEdited} />
              <DateData title="Fecha de nacimiento" data={selectedSocio.fechaNacimiento || undefined} setNewData={setNewFechaNacimiento} isBeingEdited={isBeingEdited} />
            </div>
            <div className="data-group">
              <TextData title="Domicilio" data={selectedSocio.ubicacion?.domicilio} setNewData={setNewDomicilio} isBeingEdited={isBeingEdited} />
              <BarrioData title={"Barrio"} value={selectedSocio.ubicacion?.barrio ? selectedSocio.ubicacion?.barrio : undefined} setNewValue={setNewBarrio} isBeingEdited={isBeingEdited} />
              <TextData title="Teléfono" data={selectedSocio.contacto?.telefono} setNewData={setTelefono} isBeingEdited={isBeingEdited} />
              <TextData title="Email" data={selectedSocio.contacto?.correo} setNewData={setEmail} isBeingEdited={isBeingEdited}/>
            </div>
            <div className="data-group">
              <BooleanData title="Afiliado PJ" value={selectedSocio.isAfiliadoPj} setNewValue={setNewIsAfiliadoPj} isBeingEdited={isBeingEdited} />
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

      <CreateSocio visible={isCreateSocioVisible} setIsVisible={setCreateSocioVisible}/>

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
        <EditorButton icon={faAdd} onClick={() => setCreateSocioVisible(!isCreateSocioVisible)} visible={true} />
      </div>
    </div>
  );
}
