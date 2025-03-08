const sqlite = require("sqlite3")

const db = new sqlite.Database("TTT.db");

db.all("select * from barrio",(error,rows)=>{console.log(rows)})
