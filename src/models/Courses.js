const {DataTypes} = require("sequelize");

const connection = require("../database/index")

const Course = connection.define("Course", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  levelSeries: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
    tableName: "courses",
})

module.exports = Course;
