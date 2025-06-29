import "./SociosList.css";

import { Dispatch, useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { SocioDto } from "ttt-shared/dto/socio.dto";
import { calculateYears } from "../../utils/calculateYears";
import SocioDetails from "./SocioDetails";

type PjFilterType = "todos" | "afiliado" | "no-afiliado";
type JubiladoFilterType = "todos" | "jubilado" | "joven";

function SociosList({ selectedSocio, setSelectedSocio }: { selectedSocio: SocioDto | null; setSelectedSocio: Dispatch<SocioDto | null> }) {
    const dataContext = useContext(DataContext);

    if (dataContext !== undefined) {
        const [barrioSearch, setBarrioSearch] = useState<string>("");
        const [nombreSearch, setNombreSearch] = useState<string>("");
        const [barriosIdFilters, setBarriosIdFilters] = useState<number[]>([]);
        const [isAfiliadoPjFilter, setIsAfiliadoPjFilter] = useState<PjFilterType>("todos");
        const [isJubiladoFilter, setIsJubiladoFilter] = useState<JubiladoFilterType>("todos");

        const handleBarrioSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
            setBarrioSearch(event.target.value);
        };

        const handleSocioSelect = (socio: SocioDto) => {
            if (selectedSocio?.id === socio.id) {
                setSelectedSocio(null);
            } else {
                setSelectedSocio(socio);
            }
        };

        const addBarrioFilter = (id: number) => {
            setBarriosIdFilters([...barriosIdFilters, id]);
        };

        const deleteBarrioFilter = (id: number) => {
            const updatedFilters = barriosIdFilters.filter((filter) => filter !== id);
            setBarriosIdFilters(updatedFilters);
        };

        const getFilteredSocios = (): SocioDto[] => {
            const filteredSocios = dataContext.socios
                .filter((s) => {
                    return barriosIdFilters.length === 0 ? true : barriosIdFilters.includes(s.ubicacion?.barrioId ?? -1);
                })
                .filter((s) => {
                    if (nombreSearch.trim() === "") return true;
                    const regex = new RegExp(".*" + nombreSearch + ".*", "i");
                    return s.nombre.match(regex) || s.apellido?.match(regex);
                });
            return filteredSocios;
        };

        function BarriosFilter() {
            return (
                <div className="barrios-filter">
                    <input list="barrios" placeholder="Barrios" value={barrioSearch} onChange={handleBarrioSearch} />
                    <datalist id="barrios">
                        {dataContext?.barrios
                            .filter((b) => {
                                return !barriosIdFilters.includes(b.id);
                            })
                            .filter((b) => {
                                const regex = new RegExp(".*" + barrioSearch + ".*", "i");
                                return b.nombre.match(regex) ? true : false;
                            })
                            .map((b) => (
                                <option key={b.id} value={b.nombre} onClick={() => addBarrioFilter(b.id)} />
                            ))}
                    </datalist>
                    <div>
                        {barriosIdFilters.map((id) => {
                            const b = dataContext?.barrios.find((b) => b.id === id);
                            if (b) {
                                return (
                                    <div key={id} className="filter selected" onClick={() => deleteBarrioFilter(b.id)}>
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
            <section>
                <h2>Socios</h2>
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
                        <div className="socios-list">
                            <div className="socios-list-row">
                                <span>ID</span>
                                <span>Nombre</span>
                                <span>Apellido</span>
                                <span>Edad</span>
                            </div>
                            {getFilteredSocios().length > 0
                                ? getFilteredSocios().map((s) => {
                                      const edad = s.fechaNacimiento ? calculateYears(s.fechaNacimiento, new Date()) : "N/A";
                                      return (
                                          <>
                                              <div
                                                  key={s.id}
                                                  className={`socios-list-row ${selectedSocio?.id === s.id ? "selected" : ""}`}
                                                  onClick={() => handleSocioSelect(s)}
                                              >
                                                  <span>{s.id}</span>
                                                  <span>{s.nombre}</span>
                                                  <span>{s.apellido}</span>
                                                  <span>{edad}</span>
                                              </div>
                                              {selectedSocio === s ? <SocioDetails socio={s} /> : null}
                                          </>
                                      );
                                  })
                                : null}
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={nombreSearch}
                                onChange={(e) => {
                                    setNombreSearch(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    return null;
}

export default SociosList;
