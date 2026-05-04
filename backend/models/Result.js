const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Result = sequelize.define(
  "Result",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    Candidate_id: DataTypes.INTEGER,
    Application_no: DataTypes.STRING,

    Score: DataTypes.INTEGER,
    Total_questions: DataTypes.INTEGER,
    Percentage: DataTypes.FLOAT,

    Status: DataTypes.STRING,
    Violations: DataTypes.INTEGER,

    Python_score: DataTypes.INTEGER,
    Sql_score: DataTypes.INTEGER,
    Aiml_score: DataTypes.INTEGER,

    Subject_stats: DataTypes.TEXT,

    Time_taken_secs: DataTypes.INTEGER,
  },
  {
    tableName: "RESULT_NEW",
    timestamps: false,
  }
);

module.exports = Result;