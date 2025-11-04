const Course = require("./Courses");
const Material = require("./Materials");
const User = require("./Users");
const MaterialOrder = require("./MaterialsOrders");
const Payment = require("./Payments");
const Value = require("./Values");
const Order = require("./Orders");

//Material e Pedido - N:N
Material.belongsToMany(Order, { through: MaterialOrder, foreignKey: 'material_id', as: 'orders'});
Order.belongsToMany(Material, { through: MaterialOrder, foreignKey: 'order_id', as: 'materials'});

//Usuário e Pedido - 1:N
Order.belongsTo(User, { foreignKey: 'user_id', as: 'users' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

//Pedido e Pagamento - 1:1
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order_details' });
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });

//Curso e Usuário - 1:N
User.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Course.hasMany(User, { foreignKey: 'course_id', as: 'users' });

//Curso e Material - 1:N
Course.hasMany(Material, { foreignKey: 'course_id', as: 'materials' });
Material.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

MaterialOrder.belongsTo(Order, { foreignKey: 'order_id', as: 'OrderDetails' });+
MaterialOrder.belongsTo(Material, { foreignKey: 'material_id', as: 'MaterialDetails' });
Order.hasMany(MaterialOrder, { foreignKey: 'order_id', as: 'Items' });

User.hasMany(Material, { foreignKey: 'user_id', as: 'uploadedMaterials' });
Material.belongsTo(User, { foreignKey: 'user_id', as: 'uploader' });

module.exports = {
    Course,
    Material,
    User,
    MaterialOrder,
    Payment,
    Value,
    Order
}