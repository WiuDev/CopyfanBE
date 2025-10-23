const Material = require("../models/Materials");
const Course = require("../models/Courses");
const User = require("../models/Users");
const { fileTypeFromBuffer } = require("file-type");
const pdf = require("pdf-parse");
const { Op, Sequelize } = require("sequelize");

class MaterialService {
  static async createMaterial({
    name,
    classPeriod,
    course_id,
    role,
    is_visible,
    user_id,
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

    if (
      !name ||
      !fileBuffer ||
      !classPeriod ||
      !course_id ||
      !fileName ||
      !user_id
    ) {
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
      user_id,
      role,
      is_visible,
      file: fileBuffer,
      fileName: fileName,
      mimetype: fileType,
      total_pages: total_pages,
    });

    const materialWithDetails = await MaterialService.getMaterialWithDetails(
      material.id
    );
    return {
      id: material.id,
      name: material.name,
      classPeriod: material.classPeriod,
      course_id: material.course_id,
      user_id: material.user_id,
      fileName: material.fileName,
      mimetype: material.mimetype,
      total_pages: material.total_pages,
      uploader: materialWithDetails.uploader,
      course: materialWithDetails.course,
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
  static async getAllMaterials(authenticatedUserId, filters) {
    const andConditions = [];

    let visibilityCondition = {
      [Op.or]: [
        { user_id: authenticatedUserId },
        { is_visible: true, role: "professor" },
      ],
    };

    if (filters.ownerId) {
      visibilityCondition = { user_id: filters.ownerId };
    }

    if (filters.role === "professor" && filters.is_visible === true) {
      visibilityCondition = {
        [Op.and]: [{ is_visible: true }, { role: "professor" }],
      };
    }

    andConditions.push(visibilityCondition);

    if (
      filters.classPeriod &&
      filters.classPeriod !== "null" &&
      filters.classPeriod !== ""
    ) {
      const filterValueLower = filters.classPeriod.toLowerCase();
      andConditions.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.col("classPeriod")), {
          [Op.like]: `%${filterValueLower}%`,
        })
      );
    }
    if (filters.course_id) {
      andConditions.push({ course_id: filters.course_id });
    }

    if (filters.name) {
      const searchTermLower = filters.name.toLowerCase();

      andConditions.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("Material.name")),
          { [Op.like]: `%${searchTermLower}%` }
        )
      );
    }
    const materials = await Material.findAll({
      where: { [Op.and]: andConditions },
      attributes: [
        "id",
        "name",
        "classPeriod",
        "course_id",
        "fileName",
        "is_visible",
        "role",
        "mimetype",
        "total_pages",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title"],
        },
        {
          model: User,
          as: "uploader",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return materials;
  }
  static async getMaterialWithDetails(materialId) {
    return await Material.findByPk(materialId, {
      attributes: [
        "id",
        "name",
        "classPeriod",
        "course_id",
        "user_id",
        "fileName",
        "mimetype",
        "total_pages",
        "createdAt",
      ],
      include: [
        { model: User, as: "uploader", attributes: ["id", "name"] },
        { model: Course, as: "course", attributes: ["title"] },
      ],
    });
  }
}
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/tiff"];

module.exports = MaterialService;
