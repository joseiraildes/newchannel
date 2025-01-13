const { DataTypes } = require("sequelize");
const db = require("../database/config.js");

const User = db.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true

  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  senha: DataTypes.STRING,
  biografia: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = User;