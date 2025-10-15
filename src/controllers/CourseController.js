const express = require("express");
const CourseService = require("../services/CourseService");

class CourseController {
    static async createCourse(req, res) {
        try {
            const { title, description } = req.body;
            const course = await CourseService.createCourse({ title, description });
            res.status(201).json(course);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default CourseController;