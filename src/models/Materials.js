const { DataTypes } = require("sequelize");

const connection = require("../database/index");

const Material = connection.define(
  "Material",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    classPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "materials",
  }
);
module.exports = Material;
