const MaterialOrderService = require("../services/MaterialOrderService");
const OrderService = require("../services/OrderService");

class OrderController {
  static async createOrder(req, res) {
    const user_id = req.user?.id;
    const { materials, methodPayment } = req.body;
    try {
      if (!user_id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }
      if (!materials || materials.length === 0) {
        return res
          .status(400)
          .json({ error: "Materials array is required and cannot be empty." });
      }
      if (!methodPayment) {
        return res.status(400).json({ error: "Payment method is required." });
      }
      const newOrder = await OrderService.createOrder({
        user_id,
        materials,
        methodPayment,
      });
      res.status(201).json({
        message: "Order created successfully",
        order: newOrder.id,
        status: newOrder.status,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async updateOrderStatus(req, res) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        status
      );
      res.status(200).json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const order = await OrderService.getOrderById(orderId);
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getOrdersByUser(req, res) {
    try {
      const userId = req.user.id;
      const orders = await OrderService.getOrdersByUser(userId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async calculateOrderPrice(req, res) {
    const calculationData = req.body;
    try {
      const totalPrice = await MaterialOrderService.calculatePrice(
        calculationData
      );
      const formattedPrice = `R$ ${totalPrice.toFixed(2).replace(".", ",")}`;
      res
        .status(200)
        .json({ totalPrice: totalPrice, formattedPrice: formattedPrice });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
module.exports = OrderController;
