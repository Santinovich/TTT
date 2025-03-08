const { Database } = require("sqlite3");
const db = new Database("TTT.db");
module.exports = db;