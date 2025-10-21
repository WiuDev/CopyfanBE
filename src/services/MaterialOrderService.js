const MaterialOrder = require("../models/MaterialsOrders");
const ValueService = require("./ValueService");
const Material = require("../models/Materials");

class MaterialOrderService {
  static cleanAndParse(priceValue) {
    if (typeof priceValue !== "string" && !isNaN(Number(priceValue))) {
      return Number(priceValue);
    }

    let cleaned = String(priceValue).trim();

    cleaned = cleaned.replace(/[^\d.,]/g, "").replace(",", ".");

    return parseFloat(cleaned);
  }
  /**
   * @param {object} materialOrderData
   * @param {string} order_id
   * @param {Transaction} t
   * @returns {Promise<{materialOrder: MaterialOrder, total_price_freeze: number}>}
   */

  static async createMaterialOrder(materialOrderData, order_id, t) {
    const currentPrices = await ValueService.getCurrentPrices(t);

    const { material_id,start_page, end_page, colored, front_back, binding, quantity } =
      materialOrderData;

    const material = await Material.findByPk(material_id, { transaction: t });
    if (!material) {
      throw new Error(`Material com ID ${material_id} não encontrado.`);
    }
    const safeTotalPages = material.total_pages;

    const finalQuantity = Number(quantity);
    const numStartPage = Number(start_page);
    const numEndPage = Number(end_page);

    if (numEndPage > safeTotalPages || numStartPage < 1 || numStartPage > numEndPage) {
      throw new Error(
        `O intervalo de páginas solicitado (${numStartPage}-${numEndPage}) é inválido para um arquivo de ${safeTotalPages} páginas.`
      );
    }

    const totalPages = numEndPage - numStartPage + 1;

    const basePrice = MaterialOrderService.cleanAndParse(
      currentPrices[ValueService.DESCRIPTIONS.PRECO_BASE_PB.trim()].value
    );
    const colorIncrement = colored
      ? MaterialOrderService.cleanAndParse(
          currentPrices[ValueService.DESCRIPTIONS.ACRESCIMO_COLORIDO.trim()]
            .value
        )
      : 0;
    const frontBackPriceIncrement = front_back
      ? MaterialOrderService.cleanAndParse(
          currentPrices[ValueService.DESCRIPTIONS.ACRESCIMO_FRENTE_VERSO.trim()]
            .value
        )
      : 0;
    const bindingPrice_freeze = binding
      ? MaterialOrderService.cleanAndParse(
          currentPrices[ValueService.DESCRIPTIONS.PRECO_ENCADERNACAO.trim()]
            .value
        )
      : 0;

    if (isNaN(basePrice) || basePrice <= 0) {
      throw new Error(
        "Erro: O preço base P&B não é um número válido ou não foi configurado."
      );
    }

    const price_unitary_freeze =
      basePrice + colorIncrement + frontBackPriceIncrement;
    const total_price_freeze =
      price_unitary_freeze * totalPages * finalQuantity + bindingPrice_freeze;

    const materialOrder = await MaterialOrder.create(
      {
        ...materialOrderData,
        order_id: order_id,
        price_unitary_freeze: price_unitary_freeze,
        price_binding_freeze: bindingPrice_freeze,
        total_price_freeze: total_price_freeze,
      },
      { transaction: t }
    );

    return { materialOrder, total_price_freeze };
  }

  /**
     * Calcula o preço de um item de pedido em tempo real, sem persistir no DB.
     * @param {Object} calculationData - { material_id, start_page, end_page, colored, front_back, binding, quantity }
     * @returns {Promise<number>} O preço total calculado.
     */

  static async calculatePrice(calculationData) {
    const currentPrices = await ValueService.getCurrentPrices();
    const { material_id, start_page, end_page, colored, front_back, binding, quantity } = calculationData;
    const material = await Material.findByPk(material_id);
    if (!material) {
      throw new Error(`Material com ID ${material_id} não encontrado.`);
    }
    const safeTotalPages = material.total_pages;
    const finalQuantity = Number(quantity);
    const requestedStartPage = Number(start_page);
    const requestedEndPage = Number(end_page);

    if (requestedStartPage < 1 || requestedEndPage < 1) {
        throw new Error("As páginas inicial e final devem ser maiores que zero.");
    }
    if (finalQuantity <= 0) {
        throw new Error("A quantidade de cópias deve ser maior que zero.");
    }
    if (requestedStartPage > requestedEndPage) {
        throw new Error("A página inicial não pode ser maior que a página final.");
    }
    if (requestedEndPage > safeTotalPages) {
        throw new Error(`A página final (${requestedEndPage}) excede o total de páginas do arquivo (${safeTotalPages}).`);
    }

    const totalPagesToCharge = requestedEndPage - requestedStartPage + 1;

    const getPrice = (descKey) => MaterialOrderService.cleanAndParse(currentPrices[descKey.trim()].value);

    const basePrice = getPrice(ValueService.DESCRIPTIONS.PRECO_BASE_PB);
    const colorIncrement = colored ? getPrice(ValueService.DESCRIPTIONS.ACRESCIMO_COLORIDO) : 0;
    const frontBackIncrement = front_back ? getPrice(ValueService.DESCRIPTIONS.ACRESCIMO_FRENTE_VERSO) : 0;
    const bindingPrice_freeze = binding ? getPrice(ValueService.DESCRIPTIONS.PRECO_ENCADERNACAO) : 0;

    if (isNaN(basePrice) || basePrice <= 0) {
      throw new Error("Erro: O preço base P&B não é um número válido ou não foi configurado.");
    }

    const price_unitary_freeze = basePrice + colorIncrement + frontBackIncrement;
    const total_price = price_unitary_freeze * totalPagesToCharge * finalQuantity + bindingPrice_freeze;

    return total_price;
  }

}

module.exports = MaterialOrderService;
