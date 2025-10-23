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
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user"
    },
    file: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    classPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  },
  {
    tableName: "materials",
  }
);
module.exports = Material;
