const { DataTypes } = require("sequelize");

const connection = require("../database/index");

const Payments = connection.define(
  "Payments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    statusPayment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    methodPayment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "payments",
  }
);

module.exports = Payments;
