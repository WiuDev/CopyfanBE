const MaterialOrder = require("../models/MaterialsOrders");
const ValueService = require("./ValueService");

class MaterialOrderService {
  // Função auxiliar robusta para limpar e converter preços do DB para Number
  static cleanAndParse(priceValue) {
    // Se já for um número (0, ou algum outro cálculo), retorne-o
    if (typeof priceValue !== "string" && !isNaN(Number(priceValue))) {
      return Number(priceValue);
    }

    let cleaned = String(priceValue).trim();

    // Remove caracteres de moeda/não-numéricos e substitui vírgula por ponto
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
    const currentPrices = await ValueService.getCurrentPrices(t); // CORRIGIDO: Ordem correta de desestruturação

    const { start_page, end_page, colored, front_back, binding, quantity } =
      materialOrderData; // Garante que a quantidade e as páginas são números

    const totalPages = Number(end_page) - Number(start_page) + 1;
    const finalQuantity = Number(quantity); // Conversão dos Preços Congelados

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

    // Checagem final de sanidade: garante que o preço base é válido
    if (isNaN(basePrice) || basePrice <= 0) {
      throw new Error(
        "Erro: O preço base P&B não é um número válido ou não foi configurado."
      );
    } // Cálculo do Total Congelado

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
}

module.exports = MaterialOrderService;
