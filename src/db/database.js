const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_ROOT_HOST,
  user: process.env.DB_ROOT_USER,
  password: process.env.DB_ROOT_PASSWORD,
  database: process.env.DB_ROOT_DATABASE,
});

// Cek Koneksi
// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("Koneksi berhasil");
// });

module.exports = { connection };
