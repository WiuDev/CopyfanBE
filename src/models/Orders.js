const {DataTypes} = require("sequelize");

const connection = require("../database/index")

const Orders = connection.define("Orders", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    },
    status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    }
}, {
    tableName: "orders",
})  

module.exports = Orders;