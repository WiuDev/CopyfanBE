const MaterialService = require("../services/MaterialService");

class MaterialController {
  static async createMaterial(req, res) {
    try {
      const { name, classPeriod, is_visible, course_id } = req.body;
      const user_id = req.user.id;
      const role = req.user.role;
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
        role,
        is_visible,
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimetype: file.mimetype
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
      const AuthenticatedUserId = req.user.id;

      const {
        ownerId,
        role,
        is_visible,
        course_id,
        classPeriod,
        name
      } = req.query;
      const filters = {
        ownerId,
        role,
        is_visible: is_visible ? is_visible === 'true' : undefined,
        course_id,
        classPeriod,
        name
      }
      const finalFilters = Object.keys(filters).reduce((acc, key) => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== '') { 
                acc[key] = value;
            }
            return acc;
        }, {});
      const materials = await MaterialService.getAllMaterials(AuthenticatedUserId, finalFilters);
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
