CREATE TABLE IF NOT EXISTS "contacto" (
	"id"	INTEGER NOT NULL,
	"telefono"	INTEGER,
	"correo"	TEXT,
	"id_socio"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_socio") REFERENCES "socio"("id")
);
CREATE TABLE IF NOT EXISTS "jubilacion" (
	"id"	INTEGER NOT NULL,
	"id_socio"	INTEGER NOT NULL,
	"img_pami"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_socio") REFERENCES "socio"("id")
);
CREATE TABLE IF NOT EXISTS "ubicacion" (
	"id"	INTEGER NOT NULL,
	"domicilio"	TEXT,
	"id_socio"	INTEGER NOT NULL,
	"id_barrio"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_barrio") REFERENCES "barrio"("id"),
	FOREIGN KEY("id_socio") REFERENCES "socio"("id")
);
CREATE TABLE IF NOT EXISTS "barrio" (
	"id"	INTEGER NOT NULL,
	"nombre"	TEXT,
	"comuna"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "socio" (
	"id"	INTEGER NOT NULL,
	"nombre"	TEXT NOT NULL,
	"apellido"	TEXT,
	"nacimiento"	TEXT,
	"num_dni"	INTEGER,
	"url_dni"	TEXT,
	"is_afiliado_pj"	INTEGER DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);
