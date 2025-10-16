const ValueService = require("../services/ValueService");

class ValueController {
    static async createValue(req, res) {
        const {description, value, start_date, end_date} = req.body;
        try {
            const newValue = await ValueService.createValue({description, value, start_date, end_date});
            res.status(201).json({ message: "Value created successfully", value: newValue });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ValueController;
