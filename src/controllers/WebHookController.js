const mercadopago = require("mercadopago");
const OrderService = require("../services/OrderService");
const PaymentService = require("../services/PaymentService");
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const { MercadoPagoConfig, Payment } = require("mercadopago");

async function handleWebhookNotification(req, res) {
  const notification = req.body;

  const notificationId = notification.data?.id || notification.id;

  if (notification && notification.type === "payment" && notificationId) {
    try {
      const client = new MercadoPagoConfig({
        accessToken: MERCADOPAGO_ACCESS_TOKEN,
      });
      const paymentService = new Payment(client);
      const mpResponse = await paymentService.get({
        id: notificationId,
      });

      const paymentInfo = mpResponse
      if (!paymentInfo || !paymentInfo.external_reference) {
        console.error(
          "ERRO: Objeto de Pagamento incompleto ou nulo:",
          paymentInfo
        );
        throw new Error("Dados de pagamento MP incompletos.");
      }

      const orderId = paymentInfo.external_reference || paymentInfo.id;
      const paymentStatus = paymentInfo.status;
      const mpTransactionId = paymentInfo.id;

      let newPaymentStatus = PaymentService.STATUS.PENDING;
      let newOrderStatus = OrderService.STATUS.WAITING_PAYMENT;

      if (paymentStatus === "approved") {
        newPaymentStatus = PaymentService.STATUS.COMPLETED;
        newOrderStatus = OrderService.STATUS.PROCESSING;
      } else if (
        paymentStatus === "rejected" ||
        paymentStatus === "cancelled"
      ) {
        newPaymentStatus = PaymentService.STATUS.FAILED;
        newOrderStatus = OrderService.STATUS.CANCELED;
      }
      await PaymentService.updatePaymentStatusByOrderId({
        orderId,
        status: newPaymentStatus,
        mpId: mpTransactionId,
      });
      await OrderService.updateOrderStatus(orderId, newOrderStatus);

      console.log(
        `✅ WEBHOOK SUCESSO: Pedido ${orderId} atualizado para ${newOrderStatus}`
      );
      return res.status(200).send("Webhook Processed");
    } catch (error) {
      console.error("ERRO NO PROCESSAMENTO DO WEBHOOK:", error);
      return res.status(200).send("Error but acknowledging");
    }
  }

  return res.status(200).send("Notification received, no action taken");
}

function handleSuccessRedirect(req, res) {
  console.log("✅ Retorno de Sucesso UX Recebido:", req.query);
  res.send("Pagamento OK. O aplicativo irá atualizar o status...");
}

function handleFailureRedirect(req, res) {
  console.log("❌ Retorno de Falha UX Recebido:", req.query);
  res.send("Falha no pagamento. O aplicativo irá notificar.");
}

module.exports = {
  handleWebhookNotification,
  handleSuccessRedirect,
  handleFailureRedirect,
};
