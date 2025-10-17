const Course = require('../models/Courses');

class CourseService {
    static async createCourse({ title, degree, levelSeries, modality }) {
        if (!title || !degree || !levelSeries || !modality) {
            throw new Error('All fields are required: title, degree, levelSeries, modality');
        }
        const course = new Course({ title, degree, levelSeries, modality });
        await course.save();
        return course;
    }
    static async getAllCourses() {
        const courses = await Course.findAll();
        return courses;
    }
}
module.exports = CourseService;