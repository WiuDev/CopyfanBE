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
    price_unitary_freeze: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,

    },
    price_binding_freeze: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    }, 
    total_price_freeze: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    }
  },
  {
    tableName: "materials_orders",
  }
);
module.exports = MaterialsOrders;