const MaterialOrder = require("../models/MaterialsOrders");
const ValueService = require("./ValueService");

class MaterialOrderService {
  /**
   * @param {object} materialOrderData
   * @param {string} order_id
   * @param {Transaction} t
   * @returns {Promise<MaterialOrder>}
   */
  static async createMaterialOrder(materialOrderData, order_id, t) {
    const currentPrices = await ValueService.getCurrentPrices(t);

    const {start_page, end_page, colored, front_back, binding, quantity} = materialOrderData;
    const total = end_page - start_page + 1;
    const basePrice = parseFloat(currentPrices[ValueService.DESCRIPTIONS.PRECO_BASE_PB].valor);
    const colorIncrement = colored ? parseFloat(currentPrices[ValueService.DESCRIPTIONS.ACRESCIMO_COLORIDO].valor) : 0;
    const frontBackPriceIncrement = front_back ? parseFloat(currentPrices[ValueService.DESCRIPTIONS.ACRESCIMO_FRENTE_VERSO].valor) : 0;
    const bindingPrice_freeze = binding ? parseFloat(currentPrices[ValueService.DESCRIPTIONS.PRECO_ENCADERNACAO].valor) : 0;

    const price_unitary_freeze = basePrice + colorIncrement + frontBackPriceIncrement;

    const total_price_freeze = (price_unitary_freeze * total * quantity) + bindingPrice_freeze;



    const materialOrder = await MaterialOrder.create({
        ...materialOrderData,
        order_id: order_id,
        price_unitary_freeze: price_unitary_freeze,
        price_binding_freeze: bindingPrice_freeze,
        total_price_freeze: total_price_freeze
    }, { transaction: t });

    return { materialOrder, total_price_freeze}
  }
}

module.exports = MaterialOrderService;