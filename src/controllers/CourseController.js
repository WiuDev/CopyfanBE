const CourseService = require("../services/CourseService");

class CourseController {
    static async createCourse(req, res) {
        try {
            const { title, degree, modality } = req.body;
            const course = await CourseService.createCourse({ title, degree, modality });
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
    static async courseFilter(req, res) {
        try {
            const { search } = req.query;
            const courses = await CourseService.courseFilter(search);
            res.status(200).json(courses);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteCourse(req, res) {
        try {
            const courseId = req.params.id;
            await CourseService.deleteCourse(courseId);
            res.status(200).json({ message: "Course deleted successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = CourseController;