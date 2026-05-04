const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Sets = sequelize.define(
  "Sets",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    Topic_type: {
      // Exactly one of: 'python' | 'sql' | 'aiml'
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    Question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    Options: {
      // Stored in DB as: {"A":"...","B":"...","C":"...","D":"..."}
      // Sequelize will auto parse/stringify via the getter/setter below
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const raw = this.getDataValue("Options");
        try {
          return JSON.parse(raw);   // returns { A: "...", B: "...", C: "...", D: "..." }
        } catch {
          return raw;
        }
      },
      set(value) {
        this.setDataValue(
          "Options",
          typeof value === "string" ? value : JSON.stringify(value)
        );
      },
    },

    Correct_option: {
      // Stored as "A", "B", "C", or "D"
      type: DataTypes.STRING(1),
      allowNull: false,
    },
  },
  {
    tableName: "SETS",          // exact table name in SSMS
    schema: "dbo",              // exact schema
    timestamps: false,          // your table has no created_at / updated_at
  }
);

module.exports = Sets;