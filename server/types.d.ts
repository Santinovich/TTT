interface DbBarrio {
  id: number;
  nombre: string;
  comuna: number;
}

interface DbContacto {
  id: number;
  telefono: number;
  correo: string;
  id_socio: number;
}

interface DbJubilacion {
  id: number;
  id_socio: number;
  img_pami: string;
}

interface DbSocio {
  id: number;
  nombre: string;
  apellido: string;
  nacimiento: string;
  num_dni: number;
  url_dni: string;
  is_afiliado_pj: number;
}

interface DbUbicacion {
  id: number;
  domicilio: string;
  id_socio: number;
  id_barrio: number;
}

interface DbUser {
  id: number;
  username: string;
  password_hash: string;
  password_salt: string;
  auth_level: number;
  id_socio: number | null;
}

interface Barrio {
  id: number;
  nombre: string;
  comuna: number;
}

interface Ubicacion {
  id: number;
  domicilio: string;
  idSocio: number;
  barrio?: Barrio;
}

interface Contacto {
  id: number;
  telefono: number;
  correo: string;
  idSocio: number;
}

interface Jubilacion {
  id: number;
  idSocio: number;
  imgPami: string;
}

interface Socio {
  id: number;
  nombre: string;
  apellido: string | null | undefined;
  fechaNacimiento: Date | null | undefined;
  numeroDni: number | null | undefined;
  urlDni?: string | null | undefined;
  isAfiliadoPj: boolean | null | undefined;
  ubicacion?: Ubicacion | null | undefined;
  contacto?: Contacto | null | undefined;
  jubilacion?: Jubilacion | null | undefined;
}

interface Jubilado extends Socio {
  jubilacion: Jubilacion;
}

interface LoginProfile {
  userId: number;
  username: string;
  authLevel: number;
  socio: Socio | null;
}