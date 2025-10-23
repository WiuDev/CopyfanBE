const Course = require("../models/Courses");

class CourseService {
  static async createCourse({ title, degree, modality }) {
    const valid_degrees = [
      "bacharelado",
      "licenciatura",
      "tecnólogo",
      "pós-graduação",
    ];
    const valid_modality = ["presencial", "ead", "híbrido"];

    const lowerCaseValidDegrees = valid_degrees.map((d) => d.toLowerCase());
    const lowerCaseValidModalities = valid_modality.map((m) => m.toLowerCase());

    if (!lowerCaseValidDegrees.includes(degree.toLowerCase())) {
      throw new Error(
        `400: The provided degree ("${degree}") is invalid. Valid options: ${valid_degrees.join(
          ", "
        )}.`
      );
    }
    if (!lowerCaseValidModalities.includes(modality.toLowerCase())) {
      throw new Error(
        `400: The provided modality ("${modality}") is invalid. Valid options: ${valid_modality.join(
          ", "
        )}.`
      );
    }

    if (!title || !degree || !modality) {
      throw new Error(
        "All fields are required: title, degree, modality"
      );
    }
    const course = new Course({ title, degree,modality });
    await course.save();
    return course;
  }
  static async getAllCourses() {
    const courses = await Course.findAll({
      attributes: ["id", "title"],
      order: [["title", "ASC"]],
    });
    return courses;
  }
}
module.exports = CourseService;
