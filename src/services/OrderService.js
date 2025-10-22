const Order = require("../models/Orders");
const Material = require("../models/Materials");
const MaterialOrder = require("../models/MaterialsOrders");
const User = require("../models/Users");
const Payment = require("../models/Payments");
const PaymentService = require("../services/PaymentService");
const MaterialOrderService = require("../services/MaterialOrderService");
const sequelize = require("../database/index");
const { v4: UUIDV4 } = require("uuid");

class OrderService {
  static STATUS = {
    WAITING_PAYMENT: "waiting_payment",
    PROCESSING: "processing",
    CANCELED: "canceled",
    COMPLETED: "completed",
  };
  static async createOrder({ user_id, materials, methodPayment }) {
    let totalValue = 0;
    const orderResult = await sequelize.transaction(async (t) => {
      const user = await User.findByPk(user_id, { transaction: t });
      if (!user) {
        throw new Error("User not found");
      }

      const order = await Order.create(
        { id: UUIDV4(), user_id, status: OrderService.STATUS.WAITING_PAYMENT },
        { transaction: t }
      );

      for (const item of materials) {
        const { total_price_freeze } =
          await MaterialOrderService.createMaterialOrder(item, order.id, t);
        totalValue += total_price_freeze;
      }

      const payment = await PaymentService.createPayment(
        {
          order_id: order.id,
          user_id: user.id,
          totalValue: totalValue,
          methodPayment: methodPayment,
        },
        t
      );
      order.payment_id = payment.id;
      await order.save({ transaction: t });
      return order;
    });
    return orderResult;
  }
  static async updateOrderStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (
      status !== OrderService.STATUS.WAITING_PAYMENT &&
      status !== OrderService.STATUS.PROCESSING &&
      status !== OrderService.STATUS.CANCELED &&
      status !== OrderService.STATUS.COMPLETED
    ) {
      throw new Error(
        "Invalid status value. Try: 'waiting_payment', 'processing', 'canceled', 'completed'"
      );
    }
    order.status = status;
    await order.save();
    return order;
  }
  static async getAllOrders() {
    const orders = await Order.findAll();
    return orders;
  }
  static async getOrderById(orderId) {
    const order = await Order.findByPk(orderId);
    return order;
  }
  static async getOrdersByUser(userId) {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["statusPayment", "totalValue"],
        },
        {
          model: Material,
          as: "materials",
          through: {
            model: MaterialOrder,
            attributes: ["start_page", "end_page", "quantity"],
          },
          attributes: ["name", "classPeriod", "total_pages"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return orders;
  }
}

module.exports = OrderService;
