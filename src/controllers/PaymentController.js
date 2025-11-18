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
  static async getAdminPaymentReport(req, res) {
    try {
      const allPayments = await PaymentService.getAllPayments();
      const totalRevenue = await PaymentService.getCompletedPaymentTotal();
      return res.status(200).json({
        payments: allPayments,
        totalRevenue: totalRevenue,
        reportDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao buscar relatório de pagamentos:", error.message);
      return res
        .status(500)
        .json({ error: "Falha ao gerar relatório de pagamentos." });
    }
  }
}
module.exports = PaymentController;
