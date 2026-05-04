const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Candidate = sequelize.define(
  "Candidate",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    Application_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    Fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Contact_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Email",
      validate: { isEmail: true },
    },

    Resume_path: DataTypes.STRING,

    Gender: DataTypes.STRING,
    Father_Name: DataTypes.STRING,
    Mother_Name: DataTypes.STRING,
    Father_Occupation: DataTypes.STRING,
    Mother_Occupation: DataTypes.STRING,

    Permanent_address: DataTypes.TEXT,
    Correspondence_address: DataTypes.TEXT,

    Ssc_details: DataTypes.TEXT,
    Hsc_details: DataTypes.TEXT,
    Degree_details: DataTypes.TEXT,

    Candidate_profile: DataTypes.STRING,

    Experience_details: DataTypes.TEXT,

    Result: {
      type: DataTypes.STRING,
      defaultValue: "PENDING",
    },

    Marks: DataTypes.INTEGER,
  },
  {
    tableName: "CANDIDATE_INFO_NEW", // ✅ NEW TABLE
    timestamps: false,
  }
);

module.exports = Candidate;