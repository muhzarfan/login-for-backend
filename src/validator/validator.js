const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connection } = require("../db/database.js");

const register = async (request, h) => {
  const { username, password } = request.payload;

  try {
    // Cek apakah username sudah ada
    const userExists = await new Promise((resolve, reject) => {
      const queryString = "SELECT * FROM users WHERE username = ?";
      connection.query(queryString, [username], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      });
    });

    if (userExists) {
      // Apabila username ada, return error
      return h.response("Username sudah digunakan").code(400);
    }

    // Hash password dan simpan user baru
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQueryString =
      "INSERT INTO users (username, password) VALUES (?, ?)";
    await new Promise((resolve, reject) => {
      connection.query(
        insertQueryString,
        [username, hashedPassword],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    return h.response({ message: "User berhasil didaftarkan" }).code(201);
  } catch (error) {
    console.error("Error during registration:", error);
    return h.response("Gagal mendaftar").code(500);
  }
};

const login = async (request, h) => {
  const { username, password } = request.payload;

  try {
    const user = await new Promise((resolve, reject) => {
      const queryString = "SELECT * FROM users WHERE username = ?";
      connection.query(queryString, [username], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });

    if (!user) {
      return h.response("Username atau password salah").code(401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return h.response("Username atau password salah").code(401);
    }

    const token = jwt.sign({ username: user.username }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // response kalau username dan password benar
    return h.response({ message: "Login berhasil", token }).code(200);
  } catch (error) {
    console.error("Error during login:", error);
    return h.response("Gagal melakukan login").code(500);
  }
};

module.exports = {
  register,
  login,
};
