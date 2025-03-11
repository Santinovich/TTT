import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import ListSelector from "./ListSelector";
import "./sociosList.css";

function SociosList() {
  const dataContext = useContext(DataContext);

  const [barrioSearch, setBarrioSearch] = useState<string>("");
  const [barriosIdFilters, setBarriosIdFilters] = useState<number[]>([1, 2, 3]);

  const handleBarrioSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBarrioSearch(event.target.value);
  };

  const addBarrioFilter = (id: number) => {
    setBarriosIdFilters([...barriosIdFilters, id]);
  };

  const deleteBarrioFilter = (id: number) => {
    const updatedFilters = barriosIdFilters.filter((filter) => filter !== id);
    setBarriosIdFilters(updatedFilters);
  };

  const calculateYears = (date1: Date, date2: Date): number => {
    const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Incluyendo años bisiestos
    return Math.floor(differenceInMilliseconds / millisecondsPerYear);
  };

  if (dataContext !== undefined) {
    const BarriosListSelector = () => {
        if (barrioSearch) return (
        <ListSelector
          elements={dataContext.barrios
            .filter((b) => !(b.id in barriosIdFilters))
            .map((b) => {return {key: b.id, value: b.nombre}})}
          callback={(id) => {
            const barrio = dataContext.barrios.find((b) => b.id === id);
            if (barrio) addBarrioFilter(barrio.id);
          }}
        />
      );
    };

    return (
      <div className="socios-list-container">
        <div className="socios-list-side-panel">
          <div>
            <h3>Filtros</h3>
            <div className="barrios-filters">
              <input
                type="text"
                placeholder="Barrios"
                value={barrioSearch}
                onChange={handleBarrioSearch}
              />
              <BarriosListSelector />
              <div>
                {barriosIdFilters.map((id) => {
                  const b = dataContext.barrios.find((b) => b.id === id);
                  if (b) {
                    return (
                      <div
                        key={id}
                        className="filter selected"
                        onClick={() => deleteBarrioFilter(b.id)}
                      >
                        <span>{b.nombre}</span>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          </div>
        </div>
        <table className="socios-list" rules="none">
          <thead>
            <tr>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Edad</th>
            </tr>
          </thead>
          {dataContext.socios.map((s) => {
            const fechaNacimiento = new Date(s.fechaNacimiento);
            const edad = calculateYears(fechaNacimiento, new Date());
            return (
              <tr key={s.id}>
                <td>{s.apellido}</td>
                <td>{s.nombre}</td>
                <td>{edad}</td>
              </tr>
            );
          })}
          <tr>
            <td>
              <input type="text" name="newApellido" placeholder="Apellido" />
            </td>
            <td>
              <input type="text" name="newNombre" placeholder="Nombre" />
            </td>
            <td>
              <input type="date" name="newFechaNacimiento" placeholder="Fecha de nacimiento" />
            </td>
          </tr>
        </table>
      </div>
    );
  }
  return null;
}

export default SociosList;
