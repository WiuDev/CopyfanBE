const { DataTypes } = require("sequelize");

const connection = require("../database/index");

const Values = connection.define(
  "Values",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "values",
  }
);

module.exports = Values;
