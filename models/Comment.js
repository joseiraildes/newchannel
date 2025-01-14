const { DataTypes } = require("sequelize");
const db = require("../database/config.js");

const Comments = db.define("comentarios", {
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
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "posts",
      key: "id"
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Comments;