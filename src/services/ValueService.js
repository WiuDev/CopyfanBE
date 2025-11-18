const Value = require("../models/Values");
const { Op } = require("sequelize");
const sequelize = require("../database/index");

const DESCRIPTIONS = {
  PRECO_BASE_PB: "Preço base P&B",
  ACRESCIMO_COLORIDO: "Acréscimo Colorido",
  ACRESCIMO_FRENTE_VERSO: "Acréscimo Frente e Verso",
  PRECO_ENCADERNACAO: "Preço de Encadernação",
};

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
        description: { [Op.in]: Object.values(DESCRIPTIONS) },
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

  static async createValue({ description, value, start_date, end_date }) {
    if (!Object.values(DESCRIPTIONS).includes(description)) {
      throw new Error(
        `Invalid description. Try: ${Object.values(DESCRIPTIONS).join(", ")}`
      );
    }
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
        throw new Error(`Invalid value provided for ${description}.`);
    }
    const now = new Date();
    return await sequelize.transaction(async (t) => {
      await Value.update(
        { end_date: now },
        {
          where: {
            description,
            end_date: { [Op.eq]: null },
          },
          transaction: t,
        }
      );
      const newValue = await Value.create(
        { description, value: numericValue, start_date : start_date || now, end_date: null },
        { transaction: t }
      );
      return newValue;
    });
  }
}

module.exports = ValueService;
