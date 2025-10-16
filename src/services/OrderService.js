const Order = require("../models/Orders");
const User = require("../models/Users");
const Payment = require("../models/Payments");
const Material = require("../models/Materials");
const MaterialOrder = require("../models/MaterialsOrders");
import {sequelize} from "../database/index";
import PaymentService from "./PaymentService";
import {v4 as UUIDV4} from 'uuid';

class OrderService {
    static STATUS = {
        WAITING_PAYMENT: 'waiting_payment',
        PROCESSING: 'processing',
        FAILED: 'failed',
        COMPLETED: 'completed'
    }
    static async createOrder({user_id, materials }) {
        const orderResult = await sequelize.transaction(async (t) => {
            const user = await User.findByPk(user_id, { transaction: t });
            if(!user) {
                throw new Error("User not found");
            }

            const order = await Order.create({ id: UUIDV4(), user_id, status: OrderService.STATUS.WAITING_PAYMENT }, { transaction: t });

            const payment = await PaymentService.createPayment({ order_id: order.id }, t);
            order.payment_id = payment.id;
            await order.save({ transaction: t });

            const materialIds = materials.map(m => m.material_id);

            const existingMaterialsCount = await Material.count({ where: { id: materialIds }, transaction: t });
            if(existingMaterialsCount !== materialIds.length) {
                throw new Error("One or more materials not found");
            }

            const materialOrderData = materials.map(m => ({
                id_material: m.material_id,
                id_order: order.id,
                front_back: m.front_back,
                colored: m.colored,
                binding: m.binding,
                quantity: m.quantity,
                start_page: m.start_page,
                end_page: m.end_page
            }));
            await MaterialOrder.bulkCreate(materialOrderData, { transaction: t });

            return order;
        });

        return orderResult;
    }
}
