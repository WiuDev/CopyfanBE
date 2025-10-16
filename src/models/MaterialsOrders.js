const { DataTypes } = require("sequelize");

const connection = require("../database/index");

const MaterialsOrders = connection.define(
  "MaterialsOrders",
  {
    material_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    front_back: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    colored: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    binding: {                                                                                                                                              
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_page: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    end_page: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "materials_orders",
  }
);
module.exports = MaterialsOrders;