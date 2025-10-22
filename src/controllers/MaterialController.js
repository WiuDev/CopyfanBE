const MaterialService = require("../services/MaterialService");

class MaterialController {
  static async createMaterial(req, res) {
    try {
      const { name, classPeriod, course_id } = req.body;
      const user_id = req.user.id;
      if (!user_id) {
        throw new Error("User ID is required");
      }
      const file = req.file;
      if (!file) {
        throw new Error("File is required");
      }
      const material = await MaterialService.createMaterial({
        name,
        classPeriod,
        course_id,
        user_id,
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimetype: file.mimetype,
      });
      res.status(201).json(material);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getMaterial(req, res) {
    try {
      const materialId = req.params.id;
      const material = await MaterialService.getMaterial(materialId);
      const fileBuffer = material.file;
      const fileName = material.fileName;
      const mimetype = fileName.endsWith(".pdf")
        ? "application/pdf"
        : material.mimetype;
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", mimetype);
      res.setHeader("Content-Length", fileBuffer.length);
      res.status(200).send(fileBuffer);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  static async getAllMaterials(req, res) {
    try {
      const materials = await MaterialService.getAllMaterials();
      res.status(200).json(materials);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getMaterialDetails(req, res) {
    try {
      const materialId = req.params.id;
      const metadata = await MaterialService.getMaterialWithDetails(materialId);
      res.status(200).json(metadata);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
module.exports = MaterialController;
