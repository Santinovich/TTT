import { Dispatch, useContext, useState } from "react";
import { DataContext, Socio } from "../context/DataContext";
import ListSelector from "./pure/ListSelector";
import "./SociosList.css";
import { SocioEditor } from "./pure/SocioEditor";

export interface SelectedSocio {
  selectedSocio: Socio | undefined;
  setSelectedSocio: Dispatch<React.SetStateAction<Socio | undefined>>;
}
type PjFilterType = "todos" | "afiliado" | "no-afiliado";
type JubiladoFilterType = "todos" | "jubilado" | "joven";

function SociosList({ selectedSocio, setSelectedSocio }: SelectedSocio) {
  const dataContext = useContext(DataContext);
  if (dataContext !== undefined) {
    const [barrioSearch, setBarrioSearch] = useState<string>("");
    const [barriosIdFilters, setBarriosIdFilters] = useState<number[]>([]);
    const [isAfiliadoPjFilter, setIsAfiliadoPjFilter] = useState<PjFilterType>("todos");
    const [isJubiladoFilter, setIsJubiladoFilter] = useState<JubiladoFilterType>("todos");

    const calculateYears = (date1: Date, date2: Date): number => {
      const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
      const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Incluyendo años bisiestos
      return Math.floor(differenceInMilliseconds / millisecondsPerYear);
    };

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

    const getFilteredSocios = (): Socio[] => {
      const filteredSocios = dataContext.socios
        .filter((s) => {
          return barriosIdFilters.length === 0
            ? true
            : barriosIdFilters.includes(s.ubicacion?.barrio?.id ?? -1);
        })
        .filter((s) => {
          if (isAfiliadoPjFilter === "todos") return true;
          if (isAfiliadoPjFilter === "afiliado") return s.isAfiliadoPj;
          if (isAfiliadoPjFilter === "no-afiliado") return !s.isAfiliadoPj;
        })
        .filter((s) => {
          if (isJubiladoFilter === "todos") return true;
          if (isJubiladoFilter === "jubilado") return !!s.jubilacion;
          if (isJubiladoFilter === "joven") return !s.jubilacion;
        });
      return filteredSocios;
    };

    function BarriosListSelector() {
      if (barrioSearch && dataContext) {
        const elements = dataContext.barrios
          .filter((b) => {
            return !barriosIdFilters.includes(b.id);
          })
          .filter((b) => {
            const regex = new RegExp(".*" + barrioSearch + ".*", "i");
            return b.nombre.match(regex) ? true : false;
          })
          .map((b) => {
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
    }

    function BarriosFilter() {
      return (
        <div className="barrios-filter">
          <input
            type="text"
            placeholder="Barrios"
            value={barrioSearch}
            onChange={handleBarrioSearch}
          />
          <BarriosListSelector />
          <div>
            {barriosIdFilters.map((id) => {
              const b = dataContext?.barrios.find((b) => b.id === id);
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
      );
    }

    function PjFilter() {
      const handlePjFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as PjFilterType;
        setIsAfiliadoPjFilter(value);
      };

      return (
        <div className="pj-filter">
          <select value={isAfiliadoPjFilter} onChange={handlePjFilterChange}>
            <option value={"todos"}>Afiliados y no afiliados</option>
            <option value={"afiliado"}>Afiliados al PJ</option>
            <option value={"no-afiliado"}>No afiliados al PJ</option>
          </select>
        </div>
      );
    }

    function JubiladosFilter() {
      const handleJubiladosFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as JubiladoFilterType;
        setIsJubiladoFilter(value);
      };

      return (
        <div className="pj-filter">
          <select value={isJubiladoFilter} onChange={handleJubiladosFilterChange}>
            <option value={"todos"}>Jóvenes y jubilados</option>
            <option value={"jubilado"}>Jubilados</option>
            <option value={"joven"}>Jóvenes</option>
          </select>
        </div>
      );
    }

    return (
      <div className="socios-list-container">
        <div className="socios-list-side-panel">
          <div className="filters">
            <h3>Filtros</h3>
            <BarriosFilter />
            <PjFilter />
            <JubiladosFilter />
          </div>
        </div>
        <div className="col">
          <table className="socios-list" rules="none">
            <thead>
              <tr>
                <th>ID</th>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Edad</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredSocios().length > 0 ? (
                getFilteredSocios().map((s) => {
                  // TODO: corregir
                  const fechaNacimiento = s.fechaNacimiento ? s.fechaNacimiento : new Date();
                  const edad = calculateYears(fechaNacimiento, new Date());
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedSocio(s)}
                      className={selectedSocio?.id === s.id ? "selected" : ""}
                    >
                      <td>{s.id}</td>
                      <td>{s.apellido}</td>
                      <td>{s.nombre}</td>
                      <td>{edad}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "center", color: "var(--font-light" }}>
                    {"No hay socios para mostrar"}
                  </td>
                  <td></td>
                </tr>
              )}
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
