const ValueService = require("../services/ValueService");

class ValueController {
  static async createValue(req, res) {
    const { updatedValues } = req.body;
    if (!updatedValues || updatedValues.length === 0) {
      if (req.body.description && req.body.value) {
        const { description, value, start_date, end_date } = req.body;
        try {
          const newValue = await ValueService.createValue({
            description,
            value,
            start_date,
            end_date,
          });
          return res
            .status(201)
            .json({ message: "Value created successfully", value: newValue });
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }
      }
      return res
        .status(400)
        .json({ error: "Nenhum valor para atualizar foi fornecido no lote." });
    }

    try {
      const updatePromises = updatedValues.map((item) =>
        ValueService.createValue({
          description: item.description,
          value: item.displayValue,
        })
      );
      await Promise.all(updatePromises);

      return res
        .status(200)
        .json({ message: "Preços atualizados com sucesso." });
    } catch (error) {
      console.error("Erro no processamento em lote de preços:", error.message);
      return res.status(400).json({
        error: error.message || "Falha ao salvar as alterações de preço.",
      });
    }
  }
  static async getValue(req, res) {
    try {
      const values = await ValueService.getCurrentPrices();
      res.status(200).json({ values });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
module.exports = ValueController;
