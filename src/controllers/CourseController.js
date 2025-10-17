const CourseService = require("../services/CourseService");

class CourseController {
    static async createCourse(req, res) {
        try {
            const { title, degree, levelSeries, modality } = req.body;
            const course = await CourseService.createCourse({ title, degree, levelSeries, modality });
            res.status(201).json(course);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getAllCourses(req, res) {
        try {
            const courses = await CourseService.getAllCourses();
            res.status(200).json(courses);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = CourseController;