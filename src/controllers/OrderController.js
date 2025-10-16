const OrderService = require("../services/OrderService");

class OrderController {
    static async createOrder(req, res) {
        try {
            const orderData = req.body;
            const newOrder = await OrderService.createOrder(orderData);
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = OrderController;
