const { DataTypes } = require("sequelize");
const db = require("../database/config.js");



const Post = db.define("posts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fonte: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false
  }
})


module.exports = Post