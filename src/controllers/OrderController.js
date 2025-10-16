const OrderService = require("../services/OrderService");

class OrderController {
  static async createOrder(req, res) {
    const user_id = req.userId;
    const { materials, methodPayment } = req.body;
    try {
        if (!materials || materials.length === 0) {
            return res.status(400).json({ error: "Materials array is required and cannot be empty." });
        }
        if (!methodPayment) {
            return res.status(400).json({ error: "Payment method is required." });
        }
        const newOrder = await OrderService.createOrder({ user_id, materials, methodPayment });
        res.status(201).json({ message: "Order created successfully", order: newOrder.id, status: newOrder.status });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
