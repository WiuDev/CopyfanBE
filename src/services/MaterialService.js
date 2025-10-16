const Material = require("../models/Materials");
const { fileTypeFromBuffer } = require('file-type');

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
        if(type && type.mime) {
            fileType = type.mime;
        }
    } catch (error) {
        console.error("Error detecting file type:", error);
    }

    if (!name || !fileBuffer || !classPeriod || !course_id || !fileName) {
      throw new Error("All fields are required");
    }
    const material = new Material({
      name,
      classPeriod,
      course_id,
      file: fileBuffer,
      fileName: fileName,
      mimetype: fileType,
    });
    await material.save();
    return {
      id: material.id,
      name: material.name,
      classPeriod: material.classPeriod,
      course_id: material.course_id,
      fileName: material.fileName,
      mimetype: material.mimetype
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
}

module.exports = MaterialService;
