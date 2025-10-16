const Material = require("../models/Materials");

class MaterialService {
  static async createMaterial({
    name,
    classPeriod,
    course_id,
    fileBuffer,
    fileName,
    mimetype,
  }) {
    if (!name || !fileBuffer || !classPeriod || !course_id || !fileName) {
      throw new Error("All fields are required");
    }
    const material = new Material({
      name,
      classPeriod,
      course_id,
      file: fileBuffer,
      fileName: fileName,
      mimetype: mimetype,
    });
    await material.save();
    return {
      id: material.id,
      name: material.name,
      classPeriod: material.classPeriod,
      course_id: material.course_id,
      fileName: material.fileName,
      mimetype: material.mimetype,
    };
  }
}

module.exports = MaterialService;
