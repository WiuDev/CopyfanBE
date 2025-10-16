const Payment = require('../models/Payments');
const { v4: UUIDV4 } = require('uuid');

class PaymentService {
    static STATUS = {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
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
    static async createPayment({order_id, user_id, totalValue, methodPayment}, transaction) {
        if (!totalValue || totalValue <= 0) {
            throw new Error("Total value must be greater than zero");
        }
        const payment = await Payment.create({
            id: UUIDV4(),
            statusPayment: PaymentService.STATUS.PENDING,
            order_id: order_id,
            user_id: user_id,
            totalValue: totalValue,
            methodPayment: methodPayment
        }, { transaction });
        return payment;
    }
    static async updatePaymentStatus(paymentId, status, transaction = null) {
        if(!Object.values(PaymentService.STATUS).includes(status)) {
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
}

module.exports = PaymentService;