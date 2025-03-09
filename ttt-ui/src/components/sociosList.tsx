import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import "./sociosList.css"

function sociosList() {
  const dataContext = useContext(DataContext);

  const calculateYears = (date1: Date, date2: Date): number => {
    const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Incluyendo años bisiestos
    return Math.floor(differenceInMilliseconds / millisecondsPerYear);
  }

  if (dataContext !== undefined) {
    return (
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
      </table>
    );
  }
  return null;
}

export default sociosList;
