const { DataTypes } = require("sequelize");

const connection = require("../database/index");

const Orders = connection.define(
  "Orders",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
  }
);

module.exports = Orders;
