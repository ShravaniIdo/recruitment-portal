// // backend/config/db.js

// require("dotenv").config(); // ✅ load .env here too as a safety net

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     dialect: "mssql",
//     dialectOptions: {
//       options: {
//         server: process.env.DB_HOST,  // ✅ server goes inside dialectOptions for tedious
//         port: Number(process.env.DB_PORT) || 1433,
//         database: process.env.DB_NAME,
//         encrypt: true,
//         trustServerCertificate: true,
//       },
//     },
//     logging: false,
//   }
// );

// module.exports = sequelize;

// backend/config/db.js

const { Sequelize } = require("sequelize");

console.log("ENV CHECK:", process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mssql",
    host: process.env.DB_HOST, // ✅ required
    port: process.env.DB_PORT || 1433,

    dialectOptions: {
      options: {
        server: process.env.DB_HOST, // ✅ REQUIRED for tedious
        encrypt: true,
        trustServerCertificate: true,
      },
    },

    logging: false,
  }
);

module.exports = sequelize;