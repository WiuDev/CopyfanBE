const Material = require("../models/Materials");
const { fileTypeFromBuffer } = require("file-type");
const pdf = require("pdf-parse");

class MaterialService {
  static async createMaterial({
    name,
    classPeriod,
    course_id,
    fileBuffer,
    fileName,
    mimetype,
  }) {
    let fileType = mimetype;
    try {
      const type = await fileTypeFromBuffer(fileBuffer);
      if (type && type.mime) {
        fileType = type.mime;
      }
    } catch (error) {
      console.error("Error detecting file type:", error);
    }

    if (!name || !fileBuffer || !classPeriod || !course_id || !fileName) {
      throw new Error("All fields are required");
    }
    const total_pages = await MaterialService.getTotalPages(
      fileBuffer,
      fileType
    );
    if (total_pages <= 0) {
      throw new Error("O arquivo não contém páginas válidas para impressão.");
    }

    const material = await Material.create({
      name,
      classPeriod,
      course_id,
      file: fileBuffer,
      fileName: fileName,
      mimetype: fileType,
      total_pages: total_pages,
    });
    return {
      id: material.id,
      name: material.name,
      classPeriod: material.classPeriod,
      course_id: material.course_id,
      fileName: material.fileName,
      mimetype: material.mimetype,
      total_pages: material.total_pages,
    };
  }
  static async getMaterial(materialId) {
    const material = await Material.findByPk(materialId);
    if (!material) {
      throw new Error("Material not found");
    }
    const materialPlain = material.get({ plain: true });
    if (!materialPlain.file) {
      throw new Error("File not found");
    }
    return materialPlain;
  }
  static async getTotalPages(fileBuffer, mimetype) {
    if (mimetype === "application/pdf") {
      try {
        const data = await pdf(fileBuffer);
        return data.numpages;
      } catch (error) {
        console.error("Error reading PDF file:", error);
        throw new Error("Failed to read PDF file");
      }
    }
    if (imageMimeTypes.includes(mimetype)) {
      return 1;
    }
    throw new Error("Unsupported file type for page count");
  }
}
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/tiff"];

module.exports = MaterialService;
