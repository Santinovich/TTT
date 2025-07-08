import "./SociosList.css";

import { Dispatch, useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { SocioDto } from "ttt-shared/dto/socio.dto";
import { calculateYears } from "../../utils/calculateYears";
import SocioPanel from "./SocioPanel";
import DropdownMenu from "../pure/DropdownMenu";
import Etiqueta from "../pure/Etiqueta";
import { EtiquetaDto } from "ttt-shared/dto/etiqueta.dto";
import CreateSocioWindow from "../windows/CreateSocioWindow";
import EtiquetasManagerWindow from "../windows/EtiquetasManagerWindow";
import { exportCsv } from "../../utils/exportCsv";
import { Genero } from "ttt-shared/enum/genero.enum";
import React from "react";


function NombreFilter({nombreSearch, setNombreSearch}: {nombreSearch?: string; setNombreSearch: Dispatch<string>}) {
    return (
        <input
            type="text"
            placeholder="Buscar por nombre de socio"
            value={nombreSearch}
            onChange={(e) => {
                setNombreSearch(e.target.value);
            }}
        />
    );
}

function IdFilter({idSearch, setIdSearch}: {idSearch: string; setIdSearch: Dispatch<string>}) {
    return (
        <input
            type="text"
            placeholder="Buscar por ID de socio"
            value={idSearch}
            onChange={(e) => {
                setIdSearch(e.target.value);
            }}
        />
    );
}

function GeneroFilter({ genero, setGenero }: { genero: Genero | ""; setGenero: Dispatch<Genero | ""> }) {
    return (
        <select
            value={genero}
            onChange={(e) => {
                console.log("Genero seleccionado:", e.target.value);
                setGenero(e.target.value as Genero);
            }}
        >
            <option value="">Todos los géneros</option>
            {Object.values(Genero).map((g) => (
                <option key={g} value={g}>
                    {g}
                </option>
            ))}
        </select>
    );
}

type EdadRange = [number | "", number | ""];

function EdadRangeFilter({ edadRange, setEdadRange }: { edadRange: EdadRange; setEdadRange: Dispatch<EdadRange> }) {

    const handleEdadChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newRange = [...edadRange] as EdadRange;

        if (value === "") {
            newRange[index] = "";
        } else {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                newRange[index] = numValue;
            }
        }

        setEdadRange(newRange);
    }

    return (
        <div className="edad-range-filter">
            <label>Edad:</label>
            <input
                type="number"
                onChange={(e) => handleEdadChange(e, 0)}
                value={edadRange[0] === "" ? "" : edadRange[0]}
                placeholder="Desde"
            />
            -
            <input
                type="number"
                onChange={(e) => handleEdadChange(e, 1)}
                value={edadRange[1] === "" ? "" : edadRange[1]} 
                placeholder="Hasta"
            />
        </div>
    );
}

function EtiquetasFilter({ etiquetasFilters, setEtiquetasFilters }: { etiquetasFilters: EtiquetaDto[]; setEtiquetasFilters: Dispatch<EtiquetaDto[]> }) {

    const dataContext = useContext(DataContext);
    if (!dataContext) return null;
    
    const [searchSelected, setSearchSelected] = useState<boolean>(false);
    const [etiquetaSearch, setEtiquetaSearch] = useState<string>("");

    const addEtiquetaFilter = (etiqueta: EtiquetaDto) => {
        setEtiquetasFilters([...etiquetasFilters, etiqueta]);
    };

    const deleteEtiquetaFilter = (id: number) => {
        const updatedFilters = etiquetasFilters.filter((filter) => filter.id !== id);
        setEtiquetasFilters(updatedFilters);
    };

    return (
        <div className="etiquetas-filter">
            <input
                list="etiquetas"
                placeholder="Etiquetas"
                value={etiquetaSearch}
                onChange={(e) => {
                    setEtiquetaSearch(e.target.value);
                }}
                onFocus={() => setSearchSelected(true)}
                onBlur={() => setSearchSelected(false)}
            />

            {searchSelected || etiquetaSearch.trim() !== "" ? (
                <DropdownMenu
                    elements={dataContext.etiquetas
                        .filter((e) =>
                            e.nombre.toLowerCase().includes(etiquetaSearch.toLowerCase())
                        )
                        .filter((e) => !etiquetasFilters.some((ef) => ef.id === e.id))
                        .map((e) => ({ key: e.id, value: e.nombre }))}
                    onSelect={(eId) => {
                        const etiqueta = dataContext.etiquetas.find((e) => e.id === Number(eId));
                        if (etiqueta) {
                            addEtiquetaFilter(etiqueta);
                            setEtiquetaSearch("");
                        }
                    }}
                />
            ) : null}

            {etiquetasFilters ? (
                <div className="etiquetas">
                    {etiquetasFilters.map((e) => (
                        <Etiqueta
                            key={e.id}
                            etiqueta={e}
                            onClick={() => deleteEtiquetaFilter(e.id)}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function BarriosFilter({barriosIdFilters, setBarriosIdFilters}: {barriosIdFilters: number[]; setBarriosIdFilters: Dispatch<number[]>}) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [searchSelected, setSearchSelected] = useState<boolean>(false);
    const [barrioSearch, setBarrioSearch] = useState<string>("");

    const addBarrioFilter = (id: number) => {
        setBarriosIdFilters([...barriosIdFilters, id]);
    };

    const deleteBarrioFilter = (id: number) => {
        const updatedFilters = barriosIdFilters.filter((filter) => filter !== id);
        setBarriosIdFilters(updatedFilters);
    };

    return (
        <div className="barrios-filter">
            <input
                list="barrios"
                placeholder="Barrios"
                value={barrioSearch}
                onChange={(e) => {
                    setBarrioSearch(e.target.value);
                }}
                onFocus={() => setSearchSelected(true)}
                onBlur={() => {
                    setSearchSelected(false);
                }}
            />

            {searchSelected || barrioSearch.trim() !== "" ? (
                <DropdownMenu
                    elements={dataContext.barrios
                        .filter((b) => {
                            return (
                                b.nombre.toLowerCase().includes(barrioSearch.toLowerCase()) &&
                                !barriosIdFilters.includes(b.id)
                            );
                        })
                        .map((b) => {
                            return { key: b.id, value: b.nombre };
                        })}
                    onSelect={(bId) => {
                        addBarrioFilter(Number(bId));
                        setBarrioSearch("");
                    }}
                />
            ) : null}

            {barriosIdFilters.length > 0 ? (
                <div className="etiquetas">
                    {barriosIdFilters.map((id) => {
                        const b = dataContext?.barrios.find((b) => b.id === id);
                        if (b) {
                            return (
                                <Etiqueta
                                    key={id}
                                    etiqueta={{ id: b.id, nombre: b.nombre }}
                                    onClick={() => deleteBarrioFilter(b.id)}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
            ) : null}
        </div>
    );
}


function SociosList({
    selectedSocio,
    setSelectedSocio,
}: {
    selectedSocio: SocioDto | null;
    setSelectedSocio: Dispatch<SocioDto | null>;
}) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [createSocioWindowHidden, setCreateSocioWindowHidden] = useState<boolean>(true);
    const [etiquetasManagerWindowHidden, setEtiquetasManagerWindowHidden] = useState<boolean>(true);

    useEffect(() => {
        if (dataContext.token) {
            dataContext.validateToken();
        }
    }, [createSocioWindowHidden, etiquetasManagerWindowHidden, dataContext.token]);

    const [filteredSocios, setFilteredSocios] = useState<SocioDto[]>(dataContext.socios);
    const [nombreSearch, setNombreSearch] = useState<string>("");
    const [generoFilter, setGeneroFilter] = useState<Genero | "">("");
    const [edadRange, setEdadRange] = useState<EdadRange>(["", ""]);
    const [idFilter, setIdFilter] = useState<string>("");
    const [barriosIdFilters, setBarriosIdFilters] = useState<number[]>([]);
    const [etiquetasFilters, setEtiquetasFilters] = useState<EtiquetaDto[]>([]);

    useEffect(() => {
        setFilteredSocios(
            dataContext.socios
                .filter((s) => {
                    return barriosIdFilters.length === 0
                        ? true
                        : barriosIdFilters.includes(s.ubicacion?.barrioId ?? -1);
                })
                .filter((s) => {
                    if (nombreSearch.trim() === "") return true;
                    const regex = new RegExp(".*" + nombreSearch + ".*", "i");
                    return s.nombre.match(regex) || s.apellido?.match(regex);
                })
                .filter((s) => {
                    if (idFilter.trim() === "") return true;
                    return s.id.toString().includes(idFilter);
                })
                .filter((s) => {
                    if (etiquetasFilters.length === 0) return true;
                    return etiquetasFilters.every((e) => s.etiquetas?.some((se) => se.id === e.id));
                })
                .filter((s) => {
                    if (generoFilter === "") return true;
                    return s.genero === generoFilter;
                })
                .filter((s) => {
                    if (edadRange[0] === "" && edadRange[1] === "") return true;
                    if (!s.fechaNacimiento) return false;
                    const start = edadRange[0] ? Number(edadRange[0]) : 0;
                    const end = edadRange[1] ? Number(edadRange[1]) : Infinity
                    const edad = calculateYears(s.fechaNacimiento, new Date());
                    return edad >= start && edad <= end;
                })
        );
    }, [dataContext.socios, nombreSearch, idFilter, barriosIdFilters, etiquetasFilters, generoFilter, edadRange]);

    const getSelectedIndex = () => {
        const i = filteredSocios.findIndex((s) => selectedSocio?.id === s.id);
        return i;
    };

    // Manejar navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (filteredSocios.length === 0 || !selectedSocio) return;


            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    const nextSocio = filteredSocios[getSelectedIndex() + 1];
                    if (nextSocio) {
                        setSelectedSocio(nextSocio);
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    const prevSocio = filteredSocios[getSelectedIndex() - 1];
                    if (prevSocio) {
                        setSelectedSocio(prevSocio);
                    }
                    break;
                case "Escape":
                    setSelectedSocio(null);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [filteredSocios, selectedSocio]);

    const resetFilters = () => {
        setNombreSearch("");
        setIdFilter("");
        setBarriosIdFilters([]);
        setEtiquetasFilters([]);
        setGeneroFilter("");
        setEdadRange(["", ""]);
    };

    const handleSocioSelect = (socio: SocioDto) => {
        if (selectedSocio?.id === socio.id) {
            setSelectedSocio(null);
        } else {
            setSelectedSocio(socio);
        }
    };

    return (
        <section>
            <CreateSocioWindow
                hidden={createSocioWindowHidden}
                setHidden={setCreateSocioWindowHidden}
                setSelectedSocio={setSelectedSocio}
            />
            <EtiquetasManagerWindow
                hidden={etiquetasManagerWindowHidden}
                setHidden={setEtiquetasManagerWindowHidden}
            />
            <h2>Socios</h2>
            <div className="socios-list-container">
                <div className="socios-list-side-panel">
                    <div className="filters">
                        <h3>Filtros</h3>
                        <button onClick={resetFilters}>Reiniciar filtros</button>
                        <IdFilter idSearch={idFilter} setIdSearch={setIdFilter} />
                        <NombreFilter
                            nombreSearch={nombreSearch}
                            setNombreSearch={setNombreSearch}
                        />
                        <GeneroFilter genero={generoFilter} setGenero={setGeneroFilter} />
                        <EdadRangeFilter
                            edadRange={[edadRange[0], edadRange[1]]}
                            setEdadRange={setEdadRange}
                        />
                        <BarriosFilter
                            barriosIdFilters={barriosIdFilters}
                            setBarriosIdFilters={setBarriosIdFilters}
                        />
                        <EtiquetasFilter
                            etiquetasFilters={etiquetasFilters}
                            setEtiquetasFilters={setEtiquetasFilters}
                        />
                        <h3>Acciones</h3>
                        <button
                            onClick={() => {
                                setCreateSocioWindowHidden(false);
                            }}
                        >
                            Alta de socio
                        </button>
                        <button onClick={() => exportCsv(filteredSocios, "socios")}>
                            Exportar .csv
                        </button>
                        <button onClick={() => setEtiquetasManagerWindowHidden(false)}>
                            Administrar etiquetas
                        </button>
                    </div>
                </div>
                <div className="col">
                    <div className="socios-list">
                        <div className="socios-list-row">
                            <span>ID</span>
                            <span>Apellido</span>
                            <span>Nombre</span>
                            <span>Edad</span>
                        </div>
                        {filteredSocios.length > 0 ? (
                            filteredSocios.map((s) => {
                                const edad = s.fechaNacimiento
                                    ? calculateYears(s.fechaNacimiento, new Date())
                                    : "N/A";
                                return (
                                    <React.Fragment key={s.id}>
                                        <div
                                            className={`socios-list-row ${
                                                selectedSocio?.id === s.id ? "selected" : ""
                                            }`}
                                            onClick={() => handleSocioSelect(s)}
                                        >
                                            <span>{s.id}</span>
                                            <span>{s.apellido}</span>
                                            <span>{s.nombre}</span>
                                            <span>{edad}</span>
                                        </div>
                                        {selectedSocio === s ? <SocioPanel socio={s} /> : null}
                                    </ React.Fragment>
                                );
                            })
                        ) : (
                            <span className="no-socios">
                                No hay socios que coincidan con los filtros
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );

    return null;
}

export default SociosList;
