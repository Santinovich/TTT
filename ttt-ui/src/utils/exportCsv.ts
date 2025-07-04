import { SocioDto } from "ttt-shared/dto/socio.dto";

export const exportCsv = (socios: SocioDto[], filename: string) => {
    const headers = [
        "ID",
        "Nombre",
        "Apellido",
        "Número de DNI",
        "Fecha de Nacimiento",
        "Género",
        "Email",
        "Teléfono",
        "Dirección",
        "Etiquetas"
    ]

    const rows = socios.map(socio => [
        socio.id,
        socio.nombre,
        socio.apellido,
        socio.numeroDni,
        socio.fechaNacimiento ? new Date(socio.fechaNacimiento).toLocaleDateString() : "",
        socio.genero,
        socio.contacto?.correo? socio.contacto.correo : "",
        socio.contacto?.telefono? socio.contacto.telefono : "",
        socio.ubicacion?.domicilio ? socio.ubicacion.domicilio : "",
        socio.etiquetas ? socio.etiquetas.map(etiqueta => etiqueta.nombre).join(", ") : ""
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}