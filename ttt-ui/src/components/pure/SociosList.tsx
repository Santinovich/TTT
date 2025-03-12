import { Dispatch, useContext, useState } from "react";
import { DataContext, Socio } from "../../context/DataContext";
import ListSelector from "./ListSelector";
import "./sociosList.css";
import { SocioEditor } from "./SocioEditor";

export interface SelectedSocio {
  selectedSocio: Socio | undefined;
  setSelectedSocio: Dispatch<React.SetStateAction<Socio | undefined>>;
}

function SociosList({ selectedSocio, setSelectedSocio }: SelectedSocio) {
  const dataContext = useContext(DataContext);

  const [barrioSearch, setBarrioSearch] = useState<string>("");
  const [barriosIdFilters, setBarriosIdFilters] = useState<number[]>([]);

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
    const getFilteredSocios = (): Socio[] => {
      if (barriosIdFilters.length === 0) {
        return dataContext.socios
      }
      const filteredSocios: Socio[] = dataContext.socios.filter(s => barriosIdFilters.includes(s.ubicacion?.barrio?.id ?? -1))
      console.log(filteredSocios)
      return filteredSocios;
    }

    const BarriosListSelector = () => {
      if (barrioSearch) {
        const elements = dataContext.barrios
          .filter((b) => {
            return !barriosIdFilters.includes(b.id);
          })
          .filter((b) => {
            const regex = new RegExp(".*" + barrioSearch + ".*", "i");
            return b.nombre.match(regex) ? true : false;
          })
          .map((b) => {
            console.log(b);
            return { key: b.id, value: b.nombre };
          });

        if (elements.length > 0) {
          return (
            <ListSelector
              elements={elements}
              callback={(id) => {
                const barrio = dataContext.barrios.find((b) => b.id === id);
                if (barrio) addBarrioFilter(barrio.id);
                setBarrioSearch("");
              }}
            />
          );
        }
      }
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
        <div className="col">
          <table className="socios-list" rules="none">
            <thead>
              <tr>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Edad</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredSocios().map((s) => {
                // TODO: corregir
                const fechaNacimiento = s.fechaNacimiento ? s.fechaNacimiento : new Date();
                const edad = calculateYears(fechaNacimiento, new Date());
                return (
                  <tr key={s.id} onClick={() => setSelectedSocio(s)}>
                    <td>{s.apellido}</td>
                    <td>{s.nombre}</td>
                    <td>{edad}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <SocioEditor selectedSocio={selectedSocio} setSelectedSocio={setSelectedSocio} />
        </div>
      </div>
    );
  }
  return null;
}

export default SociosList;
