const PaymentService = require("../services/PaymentService");

class PaymentController {
    static async getPaymentDetails(req, res) {
        try {
            const paymentId = req.params.id;
            const payment = await PaymentService.getPaymentDetails(paymentId);
            res.status(200).json(payment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getAllPayments(req, res) {
        try {
            const payments = await PaymentService.getAllPayments();
            res.status(200).json(payments);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
module.exports = PaymentController;