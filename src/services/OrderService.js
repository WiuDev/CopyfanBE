const Order = require("../models/Orders");
const User = require("../models/Users");
const PaymentService = require("../services/PaymentService");
const MaterialOrderService = require("../services/MaterialOrderService");
const sequelize = require("../database/index");
const { v4: UUIDV4 } = require("uuid");

class OrderService {
  static STATUS = {
    WAITING_PAYMENT: "waiting_payment",
    PROCESSING: "processing",
    FAILED: "failed",
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
          await MaterialOrderService.createMaterialOrder(
            item,
            order.id,
            t
          );
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
}


module.exports = OrderService;