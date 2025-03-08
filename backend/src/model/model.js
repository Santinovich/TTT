class Barrio {
  constructor(id, nombre, comuna) {
    this.id = id;
    this.nombre = nombre;
    this.comuna = comuna;

  }
}

class Ubicacion {
  constructor(id, domicilio, idSocio, barrio) {
    this.id = id;
    this.domicilio = domicilio;
    this.idSocio = idSocio;
    this.barrio = barrio;
  }
}

class Contacto {
  constructor(id, telefono, correo, idSocio) {
    this.id = id;
    this.telefono = telefono;
    this.correo = correo;
    this.idSocio = idSocio;
  }
}

class Jubilacion {
  constructor(id, idSocio, imgPami) {
    this.id = id;
    this.idSocio = idSocio;
    this.imgPami = imgPami;
  }
}

class Socio {
  /**
   * @param {string} nombre
   * @param {string} apellido
   * @param {number} numeroDni
   * @param {string} urlDni
   * @param {Ubicacion} ubicacion
   * @param {Contacto} contacto
   */
  constructor(id, nombre, apellido, numeroDni = null, urlDni = null, ubicacion = null, contacto = null) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.numeroDni = numeroDni;
    this.urlDni = urlDni;
    this.ubicacion = ubicacion;
    this.contacto = contacto;
  }
}

class Jubilado extends Socio {
  constructor(id, nombre, apellido, numeroDni, urlDni, ubicacion, jubilacion) {
    super(id, nombre, apellido, numeroDni, urlDni, ubicacion);
    this.jubilacion = jubilacion;
  }
}

module.exports = { Socio, Jubilado, Jubilacion, Ubicacion, Contacto, Barrio};
