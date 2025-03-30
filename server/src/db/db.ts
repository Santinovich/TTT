import fs from "fs";
import path from "path";
import { Database } from "sqlite3";

const dbFile = "TTT.db";
const schemaFile = "schema.sql";
const insertsFile = "inserts.sql";

const dbExists = fs.existsSync(path.join(__dirname, dbFile));

const db = new Database(path.join(__dirname, dbFile), (err) => {
  if (err) throw err;
  if (!dbExists) {
    const createDbSql = fs.readFileSync(path.join(__dirname, schemaFile), "utf8");

    db.exec(createDbSql.toString(), (err) => {
      if (err) throw err;
      const insertsSql = fs.readFileSync(path.join(__dirname, insertsFile), "utf8");
      db.exec(insertsSql.toString(), (err) => {
        if (err) throw err;
      });
    });
  }
});

export default db;
