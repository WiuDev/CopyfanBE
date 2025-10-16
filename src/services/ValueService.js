const Value = require("../models/Values");
const { Op } = require("sequelize");

const DESCRIPTIONS = {
    PRECO_BASE_PB: "Preço base preto e branco por página",
    ACRESCIMO_COLORIDO: "Acréscimo por página para impressão colorida",
    ACRESCIMO_FRENTE_VERSO: "Acréscimo por impressão frente e verso",
    PRECO_ENCADERNACAO: "Preço fixo por encadernação",
}


class ValueService {

    static DESCRIPTIONS = DESCRIPTIONS;
  /**
   * @param {Transaction} t
   * @returns {Promise<Object>}
   */
  static async getCurrentPrices(t) {
    const now = new Date();
    const prices = await Value.findAll({
      where: {
        description: {[Op.in]: Object.values(DESCRIPTIONS)},
        start_date: { [Op.lte]: now },
        [Op.or]: [
          { end_date: { [Op.eq]: null } },
          { end_date: { [Op.gte]: now } },
        ],
      },
      transaction: t,
    });
    if (!prices || prices.length < Object.keys(DESCRIPTIONS).length) {
      throw new Error("No current prices found");
    }
    const pricesMap = prices.reduce((map, price) => {
      map[price.description] = price;
      return map;
    }, {});

    return pricesMap;
  }
  static async createValue({ description, value, start_date, end_date}) {
    if (!Object.values(DESCRIPTIONS).includes(description)) {
        throw new Error(`Invalid description. Try: ${Object.values(DESCRIPTIONS).join(', ')}`);
    }
    return await Value.create({
      description,
      value,
      start_date,
      end_date
    });
  }
}

module.exports = ValueService;