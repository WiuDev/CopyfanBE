const Payment = require("../models/Payments");
const { v4: UUIDV4 } = require("uuid");
const sequelize = require("../database/index");
const Order = require("../models/Orders");
const { Op } = require("sequelize");

class PaymentService {
  static STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
  };

  /**
   * @param {Object} data
   * @param {UUID} data.order_id
   * @param {number} data.totalValue
   * @param {string} data.methodPayment
   * @param {UUID} data.user_id
   * @param {Transaction} transaction
   * @returns {Promise<Payment>}
   */
  static async createPayment(
    { order_id, user_id, totalValue, methodPayment },
    transaction
  ) {
    if (!totalValue || totalValue <= 0) {
      throw new Error("Total value must be greater than zero");
    }
    const payment = await Payment.create(
      {
        id: UUIDV4(),
        statusPayment: PaymentService.STATUS.PENDING,
        order_id: order_id,
        user_id: user_id,
        totalValue: totalValue,
        methodPayment: methodPayment,
      },
      { transaction }
    );
    return payment;
  }
  static async updatePaymentStatus(paymentId, status, transaction = null) {
    if (!Object.values(PaymentService.STATUS).includes(status)) {
      throw new Error("Invalid payment status");
    }
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
      throw new Error("Payment not found");
    }
    payment.statusPayment = status;
    await payment.save({ transaction });
    return payment;
  }
  static async getPaymentDetails(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  }
  static async getAllPayments() {
    const payments = await Payment.findAll({
      order: [["createdAt", "DESC"]],
      include: [{
        model: Order,
        as: "order_details",
        where: { status: { [Op.ne]: 'canceled' } },
        required: true,
      }],
      where: {statusPayment: { [Op.ne]: 'canceled' } },
    });
    return payments;
  }
  static async updatePaymentStatusByOrderId({
    orderId,
    status,
    mpId,
    transaction = null,
  }) {
    if (!Object.values(PaymentService.STATUS).includes(status)) {
      throw new Error("Invalid payment status");
    }
    const payment = await Payment.findOne({
      where: { order_id: orderId },
      transaction,
    });

    if (!payment) {
      throw new Error("Payment not found for this order.");
    }

    payment.statusPayment = status;
    payment.mp_id = mpId;

    await payment.save({ transaction });
    return payment;
  }
  /**
   * @returns {Promise<string>}
   */
  static async getCompletedPaymentTotal() {
    const result = await Payment.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("totalValue")), "totalRevenue"],
      ],
      where: {
        statusPayment: PaymentService.STATUS.COMPLETED,
      },
      raw: true,
    });
    return result.totalRevenue || "0.00";
  }
}

module.exports = PaymentService;
