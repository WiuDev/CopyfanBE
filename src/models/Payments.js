const {DataTypes} = require("sequelize");

const connection = require("../database/index")

const Payments = connection.define("Payments", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    },
    statusPayment: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    },
    methodPayment: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    totalValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    }
}, {
    tableName: "payments",
})

module.exports = Payments;